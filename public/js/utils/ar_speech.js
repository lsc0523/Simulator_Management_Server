'use strict';
/**
 * @class WebSpeech
 */
var WebSpeech = (function(lang = (navigator.language || navigator.userLanguage)) {
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    if(!SpeechRecognition) {
        console.log('[STT : Error] This browser is not support SpeechRecognition!');
        return;
    } else if(!SpeechSynthesisUtterance) {
        console.log('[TTS : Error] This browser is not support SpeechSynthesisUtterance!');
        return;
    }

    // speech recognition (STT)
    var recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    // stt status
    var recognizing = false;
    var ignore_onend;
    var start_timestamp;

    // speech utterance (TTS)
    var utterance = new SpeechSynthesisUtterance();
    utterance.rate = 1.0;
    utterance.lang = lang;

    // tts status
    var speaking = false;
    var speakQueue = [];

    // result
    var resultCallback = null;

    recognition.onstart = function() {
        recognizing = true;
        console.log("[STT] start");
    };

    recognition.onerror = function(event) {
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

    recognition.onend = function() {
        if (ignore_onend) {
            console.log('[STT] restart');
            recognition.start();
        } else {
            console.log('[STT] end');
            recognizing = false;
        }
    };

    recognition.onresult = function(event) {
        var interim_transcript = '', final_transcript = '';
        if (typeof(event.results) == 'undefined') {
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
        
        if(final_transcript) {
            console.log("[STT : Message] "+final_transcript);
            if(resultCallback) resultCallback(final_transcript);
        }  
    };

    utterance.onend = function(event){
        if(speakQueue.length > 0){
            utterance.text = speakQueue.shift();
            speechSynthesis.speak(utterance);
        } else {
            speaking = false;
        }
    };

    return {
        LANG : {
            'ko_KR' : "한국어",
            'en_US' : "English",
            'zh_CN'  : "普通话 (中国大陆)",
            'pl_PL' : "Polski"
        },
        setLanguage : function(langStr){
            recognition.lang = langStr;
            utterance.lang = langStr;
        },
        sttStart : function(cbResult){
            console.log("Speech: sttStart "+ recognizing +", msg: "+cbResult);
            if (!recognizing) {
                resultCallback = cbResult;
                recognition.start();

                ignore_onend = true;
                start_timestamp = Date.now();
            }
        },
        sttStop : function(){
            resultCallback = null;
            ignore_onend = false;
            recognition.stop();
        },
        speak : function(message){
            if(speaking){
                speakQueue.push(message);
            } else {
                speaking = true;

                // 말하기 대기중인 것이 있는경우 순서대로 말하기위해 큐에 저장
                if(speakQueue.length > 0){
                    speakQueue.push(message);
                    return;
                }

                // 텍스트 말하기 시작
                utterance.text = message;
                speechSynthesis.speak(utterance);
            }
        },
        speakStop : function(){
            speakQueue = [];
            speechSynthesis.cancel();
            setTimeout(function(){speaking=false;},1000);
        }
    }
});