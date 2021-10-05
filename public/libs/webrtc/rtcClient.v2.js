/**
 * WebRTC P2P manager
 * Reference) https://github.com/pchab/ProjectRTC/blob/master/public/javascripts/rtcClient.js
 */
const PeerManager = (function () {

    const CMD_CLEAR_DRAWING = "CNSAR:Clear";
    const CMD_SWITCHTO_HIGH = "CNSAR:HighRes";
    const CMD_SWITCHTO_LOW = "CNSAR:LowRes";
    const CMD_CHAT_MESSAGE = "CNSAR:Message:";
    const CMD_SET_TARGET_CAM = "CNSAR:SetTargetCam:";
    const CMD_CLEAR_TARGET_CAM = "CNSAR:RemoveTargetCam";

    const peerDatabase = {};
    let localId;
    let localStream = null;
    let socket = null;
    let onPeersChange = null;
    //let isShareScreen = false; //Timeing issue RollBack

    function addPeer(remoteId) {
        var idx = Global.arUi.newRemoteVideo(); //Timeing issue RollBack
        //const idx = Global.arUi.newRemoteVideo(); //Timeing issue RollBack
        console.log('addPeer idx ' + idx);

        const peer = new Peer(
            Global.peerConnectionConfig,
            Global.peerConnectionConstraints,
            idx,
            remoteId
        );

        peerDatabase[remoteId] = peer;
        if (onPeersChange) {
            onPeersChange(Object.keys(peerDatabase).length)
        }
        return peer;
    }

    const answer = async (remoteId) => {

        const pc = peerDatabase[remoteId].pc;
        for (const track of localStream.getTracks()) {
            pc.addTrack(track, localStream);
            // pc.addTrack(track);
        }

        try {
            const sessionDescription = await pc.createAnswer();
            await pc.setLocalDescription(sessionDescription);
            this.sendMessage('answer', remoteId, sessionDescription);
        } catch (err) {
            console.error(err);
        }

        // pc.createAnswer(
        //     function (sessionDescription) {
        //         // console.log('answer localDescription ' + sessionDescription);
        //         pc.setLocalDescription(sessionDescription);
        //         send('answer', remoteId, sessionDescription);
        //     },
        //     error
        // );
    }

    const offer = async (remoteId) => {
        const pc = peerDatabase[remoteId].pc;
        try {
            const sessionDescription = await pc.createOffer();
            await pc.setLocalDescription(sessionDescription);
            this.sendMessage('offer', remoteId, sessionDescription);
        } catch (err) {
            console.error(err);
        }
        // pc.createOffer(
        //     function (sessionDescription) {
        //         // console.log('offer localDescription ' + sessionDescription);
        //         pc.setLocalDescription(sessionDescription);
        //         send('offer', remoteId, sessionDescription);
        //     },
        //     error
        // );
    }
    function handleMessage(message) { //Timing issue RollBack
    //const handleMessage = (message) => { //Timing issue RollBack
        var type = message.type, from = message.from, //Timing issue RollBack
        //const type = message.type, from = message.from, //Timing issue RollBack
            pc = (peerDatabase[from] || addPeer(from)).pc;

        //if (type != 'candidate') {
        console.log('[Socket] onmessage:: received ' + type + ' from ' + from);
        //}

        if (message.payload && message.payload["sdp"] && message.payload["encode"] == "base64") {
            message.payload["sdp"] = atob(message.payload["sdp"]);
            delete message.payload.encode
        }

        switch (type) {
            case 'init':
                // toggleLocalStream(pc);
                offer(from);
                break;
            case 'offer':
                // console.log('offer remoteDescription ' + new RTCSessionDescription(message.payload));
                pc.setRemoteDescription(new RTCSessionDescription(message.payload), function () {
                }, error);
                answer(from);
                break;
            case 'answer':
                // console.log('answer remoteDescription ' + new RTCSessionDescription(message.payload));
                pc.setRemoteDescription(new RTCSessionDescription(message.payload), function (){
                // pc.setRemoteDescription(new RTCSessionDescription(message.payload), () => {
                //     if (isShareScreen) {
                //         this.sendSetTargetCam(from, localId)
                //     }
                }, error);
                break;
            case 'candidate':
                if (pc.remoteDescription) {
                    // console.log("candidate has remoteDescription " + JSON.stringify(message.payload));
                    pc.addIceCandidate(new RTCIceCandidate({
                        sdpMLineIndex: message.payload.label,
                        sdpMid: message.payload.id,
                        candidate: message.payload.candidate
                    }), function () {
                    }, error);

                } else {
                    console.log("candidate has not remoteDescription");
                }
                break;
        }
    }

    this.sendMessage = function (type, to, payload) {
        if (type != 'candidate') {
            console.log('sending ' + type + ' to ' + to);
        }
        socket.emit('message', {
            to: to,
            type: type,
            payload: payload
        });
    }

    // function toggleLocalStream(pc) {
    //     console.log('[RTC] toggleLocalStream')
    //     console.log('[RTC] has localStream? : ', (!!localStream))
    //     if (localStream) {
    //         console.log('[RTC] peerConnection has localstream? : ', (!!pc.getLocalStreams().length));
    //         pc.addStream(localStream)
    //         // pc.add
    //         // (!!pc.getLocalStreams().length) ? pc.removeStream(localStream) : pc.addStream(localStream);
    //     }
    // }

    function error(err) {
        console.error(err);
    }


    this.getId = function () {
        return localId;
    };
    this.hasPeer = function (remote_sid) {
        return !!peerDatabase[remote_sid];
    };
    this.setSocketConnection = function (sock) {
        socket = sock;
        socket.on('message', handleMessage);
        socket.on('id', function (data) {
            localId = data.id;

            socket.emit('ready_to_stream', { sid: localId, type: "AA" });
        });
    };
    this.setLocalStream = function (stream) {
        // if local cam has been stopped, remove it from all outgoing streams.
        if (!stream) {
            for (id in peerDatabase) {
                pc = peerDatabase[id].pc;
                if (!!pc.getLocalStreams().length) {
                    pc.removeStream(localStream);
                    //offer(id);
                }
            }
        }
        localStream = stream;
    }
    this.getLocalStream = function () {
        return localStream;
    }
    this.getPeerDatabase = function () {
        return peerDatabase;
    }
    // this.toggleLocalStream = function (remoteId) {
    //     console.log('toggleLocalStream');
    //     peer = peerDatabase[remoteId] || addPeer(remoteId);
    //     toggleLocalStream(peer.pc);
    // };

    this.peerInit = function (remoteId) {
        console.log('peerInit ' + remoteId);
        peer = peerDatabase[remoteId] || addPeer(remoteId);
        //send('init', remoteId, null);
    };

    this.peerRenegociate = function (remoteId) {
        console.log(`peerRenegociate : ${remoteId}`);
        //offer(remoteId);
    };

    this.sendDataGroup = function (groupId, data) {

        console.log("send data to group");
        for (var i in peerDatabase) {
            if (typeof (peerDatabase[i].dataChannel) != 'undefined') {
                try {
                    peerDatabase[i].dataChannel.send(data);
                } catch (e) {
                    console.warn('failed when send message ' + e.description);
                }
            }
        }
    };

    this.sendData1To1 = function (remoteId, data) {

        console.log('send data to ' + remoteId);

        if (!(typeof (remoteId) == 'undefined' || remoteId == null)) {

            console.log("checking peerDatabase: " + JSON.stringify(peerDatabase[remoteId]));

            if (typeof (peerDatabase[remoteId]) != 'undefined' &&
                typeof (peerDatabase[remoteId].dataChannel) != 'undefined') {
                try {
                    peerDatabase[remoteId].dataChannel.send(data);
                    // console.log("sent data: " + data);
                } catch (e) {
                    console.warn('failed when send message ' + e.description);
                }
            } else {
                // 클라이언트를 못찾는 경우
                console.warn("No remote peer exists may be disconnected " + remoteId);
            }
        } else {
            // 전체 송신?
        }

    };
    this.sendClearMessage = function () {
        if (Global.clientIdDetail.length > 0) {
            this.sendData1To1(Global.clientIdDetail, CMD_CLEAR_DRAWING);
        }
    };
    this.sendClearMessageGroup = function () {
        this.sendDataGroup(null, CMD_CLEAR_DRAWING);
    };
    this.sendHighResCommand = function () {
        if (Global.clientIdDetail.length > 0) {
            this.sendData1To1(Global.clientIdDetail, CMD_SWITCHTO_HIGH);
        }
    };
    this.sendLowResCommand = function () {
        if (Global.clientIdDetail.length > 0) {
            this.sendData1To1(Global.clientIdDetail, CMD_SWITCHTO_LOW);
        }
    };
    // method76) 2018/01/19추가, 채팅 메시지 전송
    this.sendChatMessage = function (message) {
        if (Global.clientIdDetail.length > 0) {
            this.sendData1To1(Global.clientIdDetail, CMD_CHAT_MESSAGE + message);
        }
    };
    this.sendChatMessageGroup = function (message) {
        this.sendDataGroup(null, CMD_CHAT_MESSAGE + message);
    };
    // this.sendSetTargetCam = function (remoteId, message) {
    //     this.sendData1To1(remoteId, CMD_SET_TARGET_CAM + message);
    // };
    this.sendSetTargetCamGroup = function (message) {
        this.sendDataGroup(null, CMD_SET_TARGET_CAM + message);
    };
    this.sendClearTargetCamGroup = function () {
        this.sendDataGroup(null, CMD_CLEAR_TARGET_CAM);
    };
    this.close = function (remoteId) {
        if (typeof peerDatabase[remoteId] != 'undefined') {
            // peerDatabase[remoteId].close();
            delete peerDatabase[remoteId];
            if (onPeersChange) {
                onPeersChange(Object.keys(peerDatabase).length)
            }
        }
    }
    this.setPeersChangeCallback = function (cb) {
        onPeersChange = cb;
    }
    // this.setIsShareScreen = function (isShare) {
    //     isShareScreen = isShare;
    // }

});

const Peer = function (pcConfig, pcConstraints, idx, remoteId) {

    this.idx = idx;
    this.remoteId = remoteId;
    this.pc = new RTCPeerConnection(pcConfig, pcConstraints);
    this.tracks = { audio: null, video: null };
    this.remoteVideoEl = document.getElementById('remoteVideo_' + idx);
    this.remoteVideoEl.setAttribute("session", this.remoteId);
    this.screenSender = null;

    this.inboundStream = null;
    // this.videoEl = makePeerVideo(remoteId);

    const dataChannelOptions = {
        ordered: false, // false=>순서 보장안함
        maxRetransmitTime: 3000   // 밀리초 단위
    };

    this.dataChannel = this.pc.createDataChannel("myLabel", dataChannelOptions);

    this.pc.onicecandidate = (event) => {
        if (event.candidate) {
            Global.peerManager.sendMessage('candidate', remoteId, {
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            });
        }
    };

    this.pc.onaddstream = function (event) {
        console.log('[RTC] onaddstream event');
        // console.log(event.stream);
        // console.log(peer.remoteVideoEl);
        // attachMediaStream(peer.remoteVideoEl, event.stream);
        // Global.arUi.onClientJoin(remoteId);

        // peer.tracks.video = null;
        // peer.tracks.audio = null;
    };

    this.pc.ontrack = ev => {
        console.log('[RTC] ontrack', ev);
        if (ev.streams && ev.streams[0]) {
            // console.log('[RTC] ontrack has stream');
            this.remoteVideoEl.srcObject = ev.streams[0];
        }
        else {
            // console.log("[RTC] ontrack hasn't stream");
            if (!this.inboundStream) {
                this.inboundStream = new MediaStream();
                this.remoteVideoEl.srcObject = this.inboundStream;
            }
            this.inboundStream.addTrack(ev.track);
        }
    }

    this.pc.onnegotiationneeded = () => {
        console.log('onnegotiationneeded');
        this.pc.createOffer()
            .then((offer) => {
                return this.pc.setLocalDescription(offer);
            })
            .then(() => {
                Global.peerManager.sendMessage('offer', remoteId, this.pc.localDescription);
                // Send the offer to the remote peer through the signaling server
            })
            .catch(err => console.error(err));
    }


    // peer.pc.ontrack = function (event) {
    //     console.log('[RTC] ontrack');
    //     console.log(event)
    //     // toggleLocalStream(peer.pc);
    //     // peer.pc.

    //     if (event && event.track) {
    //         console.log('ontrack event :: ' + event.track.kind);
    //         peer.tracks[event.track.kind] = event.track;
    //     }

    //     // if (peer.tracks.audio && peer.tracks.video) {
    //     if (peer.tracks.video) {
    //         console.log('ontrack event :: play video');
    //         // attachMediaStream(peer.remoteVideoEl, new MediaStream([peer.tracks.video, peer.tracks.audio]));
    //         const remoteStream = new MediaStream([peer.tracks.video]);
    //         console.log(remoteStream);
    //         console.log(peer.remoteVideoEl);
    //         peer.remoteVideoEl.srcObject = remoteStream;
    //         Global.arUi.onClientJoin(remoteId);
    //     }
    // };

    this.pc.onremovestream = (event) => {
        // 비디오
        console.log('[RTC] onremovestream')
        event.stream.getTracks().forEach(
            function (track) {
                track.stop();
            }
        );
        this.remoteVideoEl.srcObject = null;
        this.remoteVideoEl.src = '';

        this.pc.tracks.video = null;
        this.pc.tracks.audio = null;
    };

    this.pc.oniceconnectionstatechange = (event) => {
        console.log('[RTC] oniceconnectionstatechange :' + event.srcElement.iceConnectionState);
        switch ((event.srcElement /*Chrome*/ || event.target /*Firefox*/).iceConnectionState) {
            case 'disconnected':
            case "closed": // The connection has been closed
                // console.log(peer.remoteVideoEl.srcObject)
                // if(peer.remoteVideoEl.srcObject) {
                //     peer.remoteVideoEl.srcObject.getVideoTracks()
                //         .forEach(track => {
                //             track.stop()
                //             peer.remoteVideoEl.srcObject.removeTrack(track);
                //         });
                //     peer.remoteVideoEl.srcObject = null;
                // }

                // peer.remoteVideoEl.removeAttribute("srcObject");
                // peer.remoteVideoEl.removeAttribute("src");

                // peer.pc.tracks.video = null;
                // peer.pc.tracks.audio = null;

                // recorded video download
                let id = Number(this.remoteVideoEl.id.replace('remoteVideo_', '')) - 1;
                if (Global.recorder[id] != null) {
                    Global.recorder[id].stop();
                    Global.arUi.downloadFile(id);
                    Global.recorder[id] = null;
                }

                this.remoteVideoEl.srcObject = null;
                this.remoteVideoEl.src = '';
                this.remoteVideoEl.removeAttribute("src");
                this.remoteVideoEl.removeAttribute("session");

                if (this.pc.tracks && this.pc.tracks.video) {
                    this.pc.tracks.video = null;
                }
                if (this.pc.tracks && this.pc.tracks.audio) {
                    this.pc.tracks.audio = null;
                }
                if (this.dataChannel) {
                    this.dataChannel.close();
                }
                if (this.pc) {
                    this.pc.close();
                }
                Global.peerManager.close(remoteId);
                // Global.peerDatabase.close(remoteId)
                // delete Global.peerDatabase[remoteId];

                // 모든 recorder가 종료되었을 경우 UI 처리
                var closedCount = 0;
                for (var i = 0; i < Global.recorder.length; i++) {
                    if (Global.recorder[i] == null) {
                        closedCount++;
                    }
                }

                if (Global.recorder.length == closedCount) {
                    console.log("stopRecording");

                    Global.arUi.resetRecorderTimer();
                    $(".btn-stop").attr('class', 'btn btn-recoder');
                    $(".btn-recoder").children().text("REC");

                    Global.recording = false;
                }
                break;
        }
    };

    this.pc.onsignalingstatechange = function (event) {
        console.log('[RTC] onsignalingstatechange', event)
    }



    this.pc.ondatachannel = function (ev) {
        console.log('[RTC] ondatachannel');
        ev.channel.onerror = function (error) {
            console.error("[RTC] datachannel onerror:", error);
        };

        ev.channel.onmessage = function (event) {
            // DataChannel onMessage: {"isTrusted":true}, data: 432,244
            console.log("[RTC] datachannel onmessage:", JSON.stringify(event) + ", data: " + event.data);
            try {
                var dataObj = JSON.parse(event.data);
                if (typeof (dataObj) == 'object') {
                    if (typeof (dataObj.CMD) != 'undefined' && dataObj.CMD === 'Hello') {
                        console.log('client sent Hello message');
                    }
                }
            } catch (e) { }
        };

        ev.channel.onopen = function () {
            console.log("[RTC] datachannel onopen");
            $("#transBtn").attr('disabled', false);						//통화 시작으로 버튼 클릭 이벤트로 toggle 처리 위해 disabled 해제
            $("#btn-attach-chat-image").removeClass("is-hidden");	    //통화 시작으로 버튼 활성화
            $("#mtd-btn-send").attr('disabled', false);          		//통화 시작으로 버튼 활성화
            var msg = "CNSAR:Hello,{oper_id:'" + Global.oper_id + "', oper_name:'" + Global.oper_name + "'}";
            ev.channel.send(msg);
        };

        ev.channel.onclose = function () {
            console.log("[RTC] datachannel onclose");
        };
    };


};
