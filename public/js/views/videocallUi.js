const VideocallUi = () => {

    let isShareRemote = false;
    let isShareScreen = false;
    let sharedVideoEl = null;
    let arCanvas = null;
    const localVideo = document.getElementById('localVideo');

    function openShareRemoteVideo(targetSession) {
        const cameraGridEl = document.getElementById("camera-grid");
        //const drawingBtn = document.getElementById("btn-drawing");
        // const operatorList = document.getElementById("operator-connection-list")

        if (targetSession) {
            [...cameraGridEl.children].forEach((colEl) => {
                if ([...colEl.children].includes(event.target)) {
                    colEl.className = "col col-full";
                } else {
                    colEl.className = "col is-hidden";
                }
            })
            $(".btn-capture").attr('class', 'btn btn-capture');
            const targetLi = document.getElementById(targetSession);
            targetLi.className = "is-login"
            cameraGridEl.className = "operation-camera grid";
            Global.peerManager.sendSetTargetCamGroup(targetSession);
            //drawingBtn.disabled = false;
            $("#btn-drawing").parent().removeClass("is-disabled");
            isShareRemote = true;
        }
        else {
            console.warn('[VideocallUi] there is no targetSession')
        }
    }

    function closeShareRemoteVideo() {
        const cameraGridEl = document.getElementById("camera-grid");
        //const drawingBtn = document.getElementById("btn-drawing");
        const operatorList = document.getElementById("operator-connection-list");
        const localVideoWrp = document.getElementById("localVideo-wrp");

        [...operatorList.getElementsByTagName('li')].forEach(li => {
            li.removeAttribute("class");
        });

        [...cameraGridEl.children].forEach((colEl) => {
            colEl.className = "col";
        })
        $(".btn-capture").attr('class', 'btn btn-capture is-hidden');
        cameraGridEl.className = "operation-camera grid cols2";
        localVideoWrp.className = "col-full is-hidden"
        //drawingBtn.disabled = true;
        $("#btn-drawing").parent().addClass("is-disabled");
        Global.peerManager.sendClearTargetCamGroup();
        isShareRemote = false;
    }

    function closeDrawing() {
        if (arCanvas) {
            arCanvas.setCameraMode();
            const canvasEl = document.getElementById("remoteCanvas");
            if (canvasEl) {
                canvasEl.remove();
            }
            $('#btn-drawing').removeClass("is-selected");
            $("#toolbar-drawing").addClass("hidden");
            $("#toolbar-recording").removeClass("hidden");
            let palette = document.getElementById("palette");
            if (palette) {
                palette.style.display = "none";
            }
        }
    }

    function onRemoteVideoDblClick(event) {
        sharedVideoEl = event.target;
        const targetSession = sharedVideoEl.getAttribute("session");;

        if (sharedVideoEl !== localVideo) {
            if (!isShareRemote) {
                openShareRemoteVideo(targetSession);
            } else {
                closeShareRemoteVideo();
            }
        }
    }

    function onClickDrawingBtn() {
        if (!document.getElementById('remoteCanvas')) {
            const canvasEl = document.createElement("canvas");
            canvasEl.setAttribute("id", "remoteCanvas");
            sharedVideoEl.parentElement.appendChild(canvasEl);
            arCanvas = ArCanvas(sharedVideoEl, canvasEl, false);
            arCanvas.setDrawingMode();

            //$('#btn-drawing').addClass("is-selected");
            $("#btn-drawing").parent().addClass("is-selected");
            $("#btn-camera").parent().removeClass("is-selected");
            $('#btn-share-screen').parent().removeClass("is-selected");
            $("#toolbar-recording").addClass("hidden");
            $("#toolbar-drawing").removeClass("hidden");
        }
    }

    function onClickCameraBtn() {
        if (arCanvas) {
            closeDrawing();
        }
        if (isShareScreen) {
            $('#btn-share-screen').parent().removeClass("is-selected");
            $('#btn-drawing').parent().addClass("is-disabled");
            const cameraGridEl = document.getElementById("camera-grid");
            [...cameraGridEl.children].forEach((colEl) => {
                colEl.className = "col";
            })
            Global.arWebRtc.stopShareScreen(localVideo);
            isShareScreen = false;
        }
        $("#btn-camera").parent().addClass("is-selected");
        const localVideoWrp = document.getElementById("localVideo-wrp");
        localVideoWrp.className = "col-full is-hidden"
    }

    function onClickShareScreenBtn() {
        if (arCanvas) {
            closeDrawing();
        }
        if (isShareRemote) {
            closeShareRemoteVideo();
        }
        if (!isShareScreen) {
            isShareScreen = true;
            Global.arWebRtc.shareScreen(localVideo, () => {
                onClickCameraBtn();
            });
            const cameraGridEl = document.getElementById("camera-grid");
            [...cameraGridEl.children].forEach((colEl) => {
                if (colEl.id === 'localVideo-wrp') {
                    colEl.className = "col-full";
                } else {
                    colEl.className = "col is-hidden";
                }
            })
            $("#btn-camera").parent().removeClass("is-selected");
            $('#btn-drawing').parent().removeClass("is-disabled");

            sharedVideoEl = localVideo;
        }
        $('#btn-share-screen').parent().addClass("is-selected");
    }

    function onSendDrawingBtnClick() {
        const imgbase64 = arCanvas.sendCanvasImageBySocket(null);
        if (!isEmpty(imgbase64)) {
            var blobBin = atob(imgbase64.split(',')[1]);	// base64 데이터 디코딩
            var array = [];
            for (var i = 0; i < blobBin.length; i++) {
                array.push(blobBin.charCodeAt(i));
            }
            var file = new Blob([new Uint8Array(array)], { type: 'image/png' });	// Blob 생성
            Global.arUpload.uploadChatImages(file)
                .then((data) => {
                    // Socket 전송 방식으로 변경
                    var filePath = data.file;
                    filePath = '/' + filePath.replace(/\\/g, "/");
                    Global.arMessage.send_chatImg(filePath);
                    Global.arUi.addToMainChat({ img: filePath });
                })
                .catch((err) => {
                    console.error(err);
                })
        }
    }

    function onClickSendMsg() {
        if (ClientsManager.getCallGroup().length > 0) {
            const msg = $("#group_message").val();
            // Global.peerManager.sendChatMessageGroup(msg);
            // Global.arUi.addToMainChat({ msg: msg });
            // Socket 전송 방식으로 변경
            Global.arMessage.send_message(msg);

            $("#group_message").val("");
        }
    }

    function onClickDisconnectBtn() {
        Global.arWebRtc.hangup();
        // ui.popup.open('popupMeeting');
    }

    function onClickCloseExtendBtn() {
        closeShareRemoteVideo();
    }

    function storeCaptureImage() {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = sharedVideoEl.videoWidth;
        tempCanvas.height = sharedVideoEl.videoHeight;
        const ctx = tempCanvas.getContext('2d');
        ctx.drawImage(sharedVideoEl, 0, 0, tempCanvas.width, tempCanvas.height);

        const image = tempCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

        if (image) {
            let fileName = 'captured-' + CommonUtil.mmddhhmmss() + '.png';
            let a = document.createElement("a");
            a.href = image;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
        } else {
            console.log("storeCaptureImage failed");
        }
    }

    // init. jush called at once
    (() => {
        $('.operation-camera video').on('dblclick', onRemoteVideoDblClick);
        $('#btn-drawing').on('click', onClickDrawingBtn);
        $("#btn-camera").on('click', onClickCameraBtn);
        $("#btn-share-screen").on('click', onClickShareScreenBtn);
        $("#btn-go-camera").on('click', onClickCameraBtn);
        $('#btn-send-drawing').on('click', onSendDrawingBtnClick);
        $("#btn-write-text-message").click(function () {
            let text = $("#drawing-text-input").val();
            arCanvas.drawText(text);
            $("#drawing-text-input").val('');
            ui.popup.close('popupDialog-input-text');
            // diagText.close();
        });


        $("#mtd-btn-send").on('click', onClickSendMsg);
        $("#btn-disconnect").on('click', onClickDisconnectBtn);
        $("#btn-close-extend").on('click', onClickCloseExtendBtn);
        $('#btn-capture').on('click', storeCaptureImage);

        Global.arWebRtc.addReadyEventListener((data) => {
            if(data.state === "UNAUTHORIZED") {
                const toggleBtn = document.getElementById("btn-userlist-toggle");
                const isExpanded = toggleBtn.getAttribute("aria-expanded");
                if (!isExpanded || isExpanded === "false") {
                    document.body.classList.add("new-user");
                }
            }
        });
        Global.arWebRtc.addCallEndEventListener((data) => {
            onClickCloseExtendBtn();
            onClickCameraBtn();
            $("#transBtn").attr('disabled', true);						//통화종료로 버튼 클릭 disabled 설정
            $("#btn-attach-chat-image").addClass("is-hidden");	        //통화종료로 버튼 클릭 disabled 설정
            $("#mtd-btn-send").attr('disabled', true);          		//통화종료로 버튼 클릭 disabled 설정
            go_meeting(data.call_id, '', '', '', '', '0')
            $("#recent_area").trigger('click');
        });
        Global.arWebRtc.addCallEventListener(() => {
            const toggleBtn = document.getElementById("btn-userlist-toggle");
            const isExpanded = toggleBtn.getAttribute("aria-expanded");
            if (!isExpanded || isExpanded === "false") {
                document.body.classList.add("new-user");
            }
        });
        Global.peerManager.setPeersChangeCallback((peerCount) => {
            if (peerCount) {
                $("#btn-share-screen").parent().removeClass("is-disabled");
            } else {
                $("#btn-drawing").parent().removeClass("is-selected");
                $("#btn-drawing").parent().addClass("is-disabled");
                $("#btn-share-screen").parent().addClass("is-disabled");
            }
        })

        const pk = new Piklor(".drawing-palette-wrp", [
            "#ffffff"
            , "#ff0000"
            , "#ff9900"
            , "#ffff00"
            , "#00ffff"
            , "#0000ff"
            , "#ff00ff"
        ], {
            open: "#btn-pick-color"
        });

        pk.colorChosen(function (color) {
            if (arCanvas) {
                arCanvas.setColor(color);
            }
        });
    })()


    // for public
    const _updateConnections = function (clients) {
        const operatorList = document.getElementById("operator-connection-list")
        operatorList.innerHTML = "";
        "#btn-disconnect"

        const makeButton = function (attributes, inner) {
            const Btn = document.createElement("button");
            for (const key in attributes) {
                if (attributes.hasOwnProperty(key)) {
                    Btn.setAttribute(key, attributes[key]);
                }
            }
            Btn.innerHTML = inner;
            return Btn;
        }

        const maketimerSpan = function (sid) {
            const Span = document.createElement("span")
            Span.setAttribute("id", `calltime_${sid}`)
            Span.setAttribute("class", "time");
            return Span
        }

        const makeUserLi = function (user) {

            const buttonArea = document.createElement("div");
            buttonArea.setAttribute("class", "btn-area");

            const callBtn = makeButton({
                type: "button",
                class: "btn btn-oparator type-call"
            }, '<span>Call</span>')
            callBtn.addEventListener("click", function () {
                Global.arWebRtc.requestCall(user.sid);
            })

            const disabledBtn = makeButton({
                type: "button",
                disabled: true,
                class: "btn btn-oparator type-hangup"
            }, '<span>Hang Up</span>')
            // hangupBtn.addEventListener("click", () => {
            //     Global.arWebRtc.hangup();
            // })

            const kickoutBtn = makeButton({
                type: "button",
                class: "btn btn-oparator type-hangup"
            }, '<span>Hang Up</span>')
            kickoutBtn.addEventListener("click", () => {
                Global.arWebRtc.kickout(user.sid);
            })


            const acceptBtn = makeButton({
                type: "button",
                class: "btn btn-oparator type-accept"
            }, '<span>Accept</span>')
            acceptBtn.addEventListener("click", () => {
                Global.arWebRtc.accept(user.sid);
            })

            const rejectBtn = makeButton({
                type: "button",
                class: "btn btn-oparator type-hangup"
            }, '<span>Hang Up</span>')
            rejectBtn.addEventListener("click", () => {
                Global.arWebRtc.reject(user.sid);
            })

            const connectingBtn = makeButton({
                type: "button",
                class: "btn btn-oparator type-connecting"
            }, '<span>Connecting</span>')


            const cancelBtn = makeButton({
                type: "button",
                class: "btn btn-oparator type-hangup"
            }, '<span>Hang Up</span>')
            cancelBtn.addEventListener("click", () => {
                Global.arWebRtc.cancel(user.sid);
            })

            const registerBtn = makeButton({
                type: "button",
                class: "btn btn-oparator type-register"
            }, '<span>Register</span>')
            registerBtn.addEventListener("click", () => {
                $('.col-right').css('display', 'none');
                $("#id_area").text('Device ID');
                $("#sPopUserID").prop('readonly', true);
                $("#sPopUserType option:eq(0)").replaceWith("<option value='OP-D'>Operator</option>");
                $("#sPopUserID").val(user.deviceId);
                $('.radio-area').css('display', 'none');
                $('.r_area').css('display', 'none');
                ui.popup.open('popupUserReg');
            })


            // timerSpan.innerHTML = user.timer;

            switch (user.state) {
                case "READY":
                    buttonArea.appendChild(callBtn);
                    buttonArea.appendChild(disabledBtn);
                    break;
                case "CALLING":
                    buttonArea.appendChild(acceptBtn);
                    buttonArea.appendChild(rejectBtn);
                    break;
                case "RINGING":
                    buttonArea.appendChild(connectingBtn);
                    buttonArea.appendChild(cancelBtn);
                    break;
                case "CONNECTED":
                    buttonArea.appendChild(maketimerSpan(user.sid));
                    buttonArea.appendChild(kickoutBtn);
                    break;
                case "UNAUTHORIZED":
                    buttonArea.appendChild(registerBtn)
                    buttonArea.appendChild(disabledBtn);
                    break;
                default:
                    break;
            }

            const infoArea = document.createElement("div");
            infoArea.className = "info-area";
            infoArea.innerHTML = `
                <button type="button" class="btn btn-select"><span>작업자선택</span></button>
                <div class="txt-area">
                    <p class="name" title=${user.name}><strong>${user.name}</strong></p>
                    <p class="city">${user.region ? user.region : " "}</p>
                    <p class="national">${user.language ? user.language : " "}</p>
                </div>
`
            infoArea.appendChild(buttonArea)

            const userLi = document.createElement("li");
            userLi.id = user.sid;
            userLi.appendChild(infoArea);

            return userLi
        }

        clients.forEach((client) => {
            operatorList.appendChild(makeUserLi(client))
        })

    }

    const _updateDashBoard = function (data) {

        const operTable = $("#active_body")
        let a_innerHtml = '';

        if (data.activeCall.length > 0) {
            operTable.html("");
            $.each(data.activeCall, function (idx, call) {
                a_innerHtml += `
                    <tr>
                        <td>${moment(call.start_date).format('YYYY-MM-DD HH:mm:ss')}</td>
                        <td>${call.manager}</td>
                        <td>${call.operators[0]}</td>
                        <td>${call.operators[1] || ""}</td>
                        <td>${call.operators[2] || ""}</td>
                    </tr>    
                `
            })
            operTable.html(a_innerHtml);
        }else{
            a_innerHtml = `
                <tr>
                    <td colspan="5">
                        <p class="nodata">No Active Calls Now</p>
                    </td>
                </tr>
            `
            operTable.html(a_innerHtml);
        }

        $("#op_area").find("div").removeClass("is-login");
        $("#mng_area").find("div").removeClass("is-login");

        if (data.activeOperator.length > 0) {

            $.each(data.activeOperator, function (idx, call) {
                var $o = $("#op_area");
                $o.find("div").each(function (i) {
                    $t = jQuery(this);
                    if ($t.attr("value") == data.activeOperator[idx]) {
                        $t.addClass("is-login");
                    }
                });
            })

        }
        if (data.activeManager.length > 0) {
            $.each(data.activeManager, function (idx, call) {
                var $m = $("#mng_area")
                $m.find("div").each(function (i) {
                    $t = jQuery(this);
                    if ($t.attr("value") == data.activeManager[idx]) {
                        $t.addClass("is-login");
                    }
                });
            })

        }

    }

    const _disableDisconnectButton = function (disable) {
        const disconnectButton = document.getElementById("btn-disconnect");
        disconnectButton.disabled = disable;
    }


    return {
        updateConnections: _updateConnections,
        updateDashBoard: _updateDashBoard,
        disableDisconnectButton: _disableDisconnectButton,
        closeShareVideo: closeShareRemoteVideo
    }

}