import camService from '../services/rest/camService.mjs';

var camPopup = {
    init: function (callBack) {
        var params = window.location.href;
        var str = params.split('/');
        var camId = '';
        var camUrl = '';
        var ws = null;
        camService.retrieveOne(str[str.length - 1])
            .then((datas) => {
                camId = datas.id;
                camUrl = "rtsp://" + datas.cam_id + datas.cam_url + datas.displayed_cam_url;
                $("#cam_description").html("[" + datas.region + "] " + datas.cam_name + " (" + datas.cam_description + ")");

                
                var hostName = window.location.hostname

                 if (hostName === 'www.raplgcns.com') {
                     ws = new WebSocket('wss://cam.raplgcns.com');
                 } else if (hostName === 'dev.raplgcns.com'){
                     ws = new WebSocket('wss://camdev.raplgcns.com');
                 } else{
                     //ws = new WebSocket('ws://localhost:9999');
                     ws = new WebSocket('wss://camdev.raplgcns.com');
                 }
                ws.onopen = function () {
                    var canvas = document.getElementById('camCanvas');
                    var player = new jsmpeg(ws, {
                        canvas: canvas
                    });
                    var message = {
                        event: "connect_cam",
                        data: 1,
                        camId: camId,
                        camUrl: camUrl
                    }
                    ws.send(JSON.stringify(message));
                    console.log(message);
                },
                    callBack({
                        webSocket: ws,
                        cameraUrl: camUrl
                    });
            })
            .catch((err) => {
                console.error(err);
            });

    },
    mmddhhmmss: function() {
        function checkTime(i) {
            if (i < 10) { i = "0" + i; }
            return i;
        }
        var today = new Date();
        var mm = checkTime(today.getMonth()+1);
        var d = checkTime(today.getDate());
        var h = checkTime(today.getHours());
        var m = checkTime(today.getMinutes());
        var s = checkTime(today.getSeconds());
        return mm + "-" + d + '-' + h + "-" + m + "-" + s;
      }
}

$(function () {
    //var camInit = camPopup.init();
    var camInit = null;
    camPopup.init(function (data) {
        var ws = data.webSocket;
        var camUrl = data.cameraUrl;

        window.addEventListener("beforeunload", function (e) {
            //var confirmationMessage = "\o/";
            //(e || window.event).returnValue = confirmationMessage; //Gecko + IE
            var message = {
                event: "kill_cam",
                data: 1,
                camId: '1',
                camUrl: camUrl
            }
            ws.send(JSON.stringify(message));
            console.log(message);
            //return confirmationMessage; //Webkit, Safari, Chrome
        });

     })
    

    const mediaSource = new MediaSource();
    mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
    let mediaRecorder;
    let recordedBlobs;
    let sourceBuffer;
    var recordTimer;

    var canvas = document.getElementById('camCanvas');


    const recordButton = document.querySelector('button#record');
    const recordStopButton = document.querySelector('button#recordStop');
    const downloadButton = document.querySelector('button#download');
    const recordTimerDisplay = document.getElementById('recoder-timer');
    let captureButton = document.querySelector('button#capture');
    captureButton.addEventListener('click', function (ev) {
        takepicture();
        ev.preventDefault();
    }, false);

    recordButton.onclick = startRecording;
    recordStopButton.onclick = stopRecording;
    captureButton.onclick = capture;
    downloadButton.onclick = download;

    const stream = canvas.captureStream(); // frames per second
    console.log('Started stream capture from canvas element: ', stream);

    function handleSourceOpen(event) {
        console.log('MediaSource opened');
        sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
        console.log('Source buffer: ', sourceBuffer);
    }

    function handleDataAvailable(event) {
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    }

    function handleStop(event) {
        console.log('Recorder stopped: ', event);
        const superBuffer = new Blob(recordedBlobs, { type: 'video/webm' });

    }

    function startRecording() {
        startRecording();

    }
    function stopRecording() {
        stopRecording();

    }
    // The nested try blocks will be simplified when Chrome 47 moves to Stable
    function startRecording() {
        recordTimer = new Timer("recoder-timer");
        recordTimer.start();
        let options = { mimeType: 'video/webm' };
        recordedBlobs = [];
        try {
            mediaRecorder = new MediaRecorder(stream, options);
        } catch (e0) {
            console.log('Unable to create MediaRecorder with options Object: ', e0);
            try {
                options = { mimeType: 'video/webm,codecs=vp9' };
                mediaRecorder = new MediaRecorder(stream, options);
            } catch (e1) {
                console.log('Unable to create MediaRecorder with options Object: ', e1);
                try {
                    options = 'video/vp8'; // Chrome 47
                    mediaRecorder = new MediaRecorder(stream, options);
                } catch (e2) {
                    alert('MediaRecorder is not supported by this browser.\n\n' +
                        'Try Firefox 29 or later, or Chrome 47 or later, ' +
                        'with Enable experimental Web Platform features enabled from chrome://flags.');
                    console.error('Exception while creating MediaRecorder:', e2);
                    return;
                }
            }
        }
        console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
        recordButton.className = 'btn btn-recoder is-hidden'
        recordStopButton.className = 'btn btn-stop'
        downloadButton.disabled = true;
        recordTimerDisplay.className = 'recoder-timer'
        mediaRecorder.onstop = handleStop;
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start(100); // collect 100ms of data
        console.log('MediaRecorder started', mediaRecorder);
    }

    function stopRecording() {
        recordTimer.reset();
        mediaRecorder.stop();
        console.log('Recorded Blobs: ', recordedBlobs);
        recordButton.className = 'btn btn-recoder'
        recordStopButton.className = 'btn btn-stop is-hidden'
        downloadButton.disabled = false;
        recordTimerDisplay.className = 'recoder-timer is-hidden'
        download();
    }

    function download() {
        const blob = new Blob(recordedBlobs, { type: "video/webm" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'record-' + camPopup.mmddhhmmss() + '.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }
    function Timer(id) {
        this.time = 0;
        this.interval = null;
        this.id = id;

        this.start = function () {
            this.interval = setInterval(() => {
                this.time++;
                let element = document.getElementById(this.id);
                if (element) {
                    element.textContent = moment().hour(0).minute(0).second(this.time).format('HH:mm:ss');
                }
            }, 1000)
        }

        this.reset = function () {
            clearInterval(this.interval);
            this.time = 0;
            let element = document.getElementById(this.id);
            if (element) {
                element.textContent = '00:00:00';
            }
        }
    }
    function takepicture() {
        // var el = document.getElementById("target");
        // var shotImg = document.getElementById("shotImg");
        // var ctx = canvas.getContext('2d');
        // console.log(ctx);
        // el.href = canvas.toDataURL("image/png");
        // el.download = 'Capture.jpg';
        // el.click();
        // var imageCapture;
        // var canvasStream = canvas.captureStream();
        // const track = canvasStream.getVideoTracks()[0];
        // imageCapture = new ImageCapture(track);
        // imageCapture.getPhotoCapabilities();
        // console.log(imageCapture.getPhotoCapabilities());
        //console.log(canvas.getContext('2d'));

        var photo = document.getElementById('photo');
        var tempCanvas = document.getElementById('tempCanvas');
        var tempVideo = document.getElementById('tempVideo');
        tempVideo.srcObject = stream;

        tempCanvas.width = tempVideo.videoWidth;
        tempCanvas.height = tempVideo.videoHeight;

        var ctx = tempCanvas.getContext('2d');
        ctx.drawImage(tempVideo, 0, 0, tempCanvas.width, tempCanvas.height);

        var image = tempCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

        if (image) {
            let fileName = 'captured-' + camPopup.mmddhhmmss() + '.png';
            //let fileName = 'captured.png';
            let a = document.createElement("a");
            a.href = image;
            a.download = fileName;  
            document.body.appendChild(a);
            a.click();
            photo.setAttribute('src', image);
        } else {
            console.log("storeCaptureImage failed");
        }

    }
});