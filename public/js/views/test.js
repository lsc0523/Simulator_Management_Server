var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
// if (!SpeechRecognition) {
//     console.log('[STT : Error] This browser is not support SpeechRecognition!');
//     return;
// } else if (!SpeechSynthesisUtterance) {
//     console.log('[TTS : Error] This browser is not support SpeechSynthesisUtterance!');
//     return;
// }

var recognition = new SpeechRecognition();
// recognition.continuous = true;
// recognition.interimResults = true;
// recognition.lang = 'en-US';
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
// stt status
var recognizing = false;
var ignore_onend;
var start_timestamp;


var resultCallback = null;

recognition.onstart = function () {
    recognizing = true;
    console.log("[STT] start");
};

recognition.onerror = function (event) {
    console.log("@#@#@#@      event "+event.error)
    if (event.error == 'no-speech') {
        console.log("[STT : Warn] no sppech detected. check microphone.");
    }
    if (event.error == 'audio-capture') {
        console.log("[STT : Error] No microphone was found.");
        ignore_onend = false;
    }
    if (event.error == 'not-allowed') {
        if (event.timeStamp - start_timestamp < 100) {
            console.log("[STT : Error] Permission to use microphone is blocked.");
        } else {
            console.log("[STT : Error] Permission to use microphone was denied.")
        }
        ignore_onend = false;
    }
};

recognition.onend = function () {
    if (ignore_onend) {
        console.log('[STT] restart');
        recognition.start();
    } else {
        console.log('[STT] end');
        recognizing = false;
    }
};

recognition.onresult = function (event) {
    var interim_transcript = '', final_transcript = '';
    if (typeof (event.results) == 'undefined') {
        recognition.onend = null;
        recognition.stop();
        console.log("[STT : Error] onresult - browser is not supported.")
        return;
    }

    for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript + '\n';
        } else {
            interim_transcript += event.results[i][0].transcript;
        }
    }

    if (final_transcript) {
        console.log("[STT : Message] " + final_transcript);
        if (resultCallback) resultCallback(final_transcript);
    }
};

function start_click(cbResult) {
    
    console.log("Speech: sttStart-" + recognizing +", msg: "+cbResult);
    if (!recognizing) {
        resultCallback = cbResult;
        recognition.start();

        ignore_onend = true;
        start_timestamp = Date.now();
    }else{
        console.log("start cannot ")
    }
}
function stop_click() {
    resultCallback = null;
    ignore_onend = false;
    recognition.stop();
}