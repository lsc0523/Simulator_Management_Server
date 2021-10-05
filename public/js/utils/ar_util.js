/**
 * @description Common Util
 * @author Created by nosun10005 on 2016-01-26.
 * @class CommonUtil
 */
var CommonUtil = {
  isEmpty: function(obj) {
    if (obj==null||typeof obj=='undefined') {
        return true;
    } else {
        return false;
    }
  },
  todayHhmmss: function() {
    function checkTime(i) {
        if (i < 10) { i = "0" + i; }
        return i;
    }
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    return h + ":" + m + ":" + s;
  },
  getIntervalMmSs: function(timeinmillis) {
    function checkTime(i) {
        if (i < 10) { i = "0" + i; }
        return i;
    }
    if (timeinmillis==null||typeof(timeinmillis)=='undefined') {
        return "00:00";
    } else {
        var interval = (new Date().getTime() - timeinmillis)/1000;
        // console.log("now " + new Date().getTime() + ", start " + timeinmillis + ", interval " + interval);
        return checkTime(Math.round(interval/60)) + ":" + checkTime(Math.round(interval%60));
    }
  },
  hhmmss: function(timeinmillis) {
    function checkTime(i) {
        if (i < 10) { i = "0" + i; }
        return i;
    }
    var today = new Date();
    today.setTime(timeinmillis);
    var mo = checkTime(today.getMonth()+1);
    var d  = checkTime(today.getDate());
    var h  = checkTime(today.getHours());
    var m  = checkTime(today.getMinutes());
    return mo + "/" + d + " " + h + ":" + m;
  },
  mmdd_hhmmss: function(timeinmillis) {
    function checkTime(i) {
        if (i < 10) { i = "0" + i; }
        return i;
    }
    var today = new Date();
    today.setTime(timeinmillis);
    var mm = checkTime(today.getMonth()+1);
    var d = checkTime(today.getDate());
    var h = today.getHours();
    var m = checkTime(today.getMinutes());
    var s = checkTime(today.getSeconds());
    return mm + "." + d + ' ' + h + ":" + m + ":" + s;
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
  },
  mmdd_hhmm: function(timeinmillis) {
    function checkTime(i) {
        if (i < 10) { i = "0" + i; }
        return i;
    }
    var today = new Date();
    today.setTime(timeinmillis);
    var mm = checkTime(today.getMonth()+1);
    var d = checkTime(today.getDate());
    var h = today.getHours();
    var m = checkTime(today.getMinutes());
    return mm + "/" + d + ' ' + h + ":" + m;
  },
  requestFullScreen: function () {
    if (screenfull.enabled) {
        screenfull.request();
    } else {
        // Ignore or do something else
    }
  },
  toggleFullScreen: async function (callback) {
    if (screenfull.isEnabled) {
        if (screenfull.isFullscreen) {
            await screenfull.exit();
            callback(true);
        } else {
            await screenfull.request();
            callback(false);
        }
    } else {
        // Ignore or do something else
    }
  }
};

 /* exported trace */

// Logging utility function.
function trace(arg) {
    var now = (window.performance.now() / 1000).toFixed(3);
    console.log(now + ': ', arg);
}

// Check is empty
function isEmpty(obj) {
    return (typeof(obj)=='undefined' || obj==null);
}

// Check is empty value
function isEmptyValue(obj) {
    return (typeof(obj)=='undefined' || obj==null || obj.length<1);
}

function ajax(action, method, data, callback) {
    // console.log('method ' + method + ', data ' + data);
    $.ajax({
      url     : action,
      method  : method,
      dataType: 'json',
      data    : data,
      success: function(data) {
        // console.log('success ' + JSON.stringify(data));
        callback(data);
      },
      error: function(data) {
        console.log('error ' + JSON.stringify(data));
        var data     = {};
        data.result  = false;
        data.errCode = 404;
        data.errMsg  = "서버연결에 실패하였습니다.";
        callback(data);
      }
    });
}

function getDataFromServer(url, callback) {
    $.getJSON(url, function(data) { 
        callback(data);
    });
}

function sendDataToServer(url, method, data, callback) {
    return ajax(url, method, data, callback);
}

function isError(data) {
    if(data == null || data == undefined || !data.result) {
        return true;
    } else {
        return false;
    }
}

function getData(data) {
    if (data.data != null && data.data != undefined && data.data != "") {
        if(typeof(data.data) == "string") {
            //alert(data.data);
            return JSON.parse(data.data);
        } else {
            return data.data;
        }
    } else {
        return [];
    }
}

function processError(data) {
    if(typeof(data) == "string") {
        alert(data);
    } else if (data == null || data == undefined) {
        alert("Server data is empty.");
    } else {
        alert(data.errCode + ": " + data.errMsg);
    }
}

function getRequestParameter(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}

function isEmpty(str) {
    //console.log(str);
    if (str != null && str != undefined && str != "") {
        return false;
    } else {
        return true;
    }
}

String.prototype.isEmpty = function(str) {
    if (str != null && str != undefined && str != "") {
        return false;
    } else {
        return true;
    }
};

String.format = function() {
    var theString = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }
    return theString;
};

Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";

    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;

    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};

String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

function getWorkStatus(status) {
    
    if(status == 0) {
        return "작업전";
    }

    if(status == 1) {
        return "로그인";
    }

    if(status == 2) {
        return "작업지연";
    }

    if(status == 3) {
        return "작업중";
    }

    if(status == 4) {
        return "작업완료";
    }

    if(status == 5) {
        return "로그아웃";
    }

    if(status == 6) {
        return "완료확인";
    }

    return "알수없음"
}

function getWorkerName(arrTasks) {
    var arrWorkerName = new Array();
    for(var i=0 ; i < arrTasks.length ; i++) {
        var existWorker = false;
        for(var j=0 ; j < arrWorkerName.length ; j++) {
            if(arrWorkerName[j] == arrTasks[i].worker_name) {
                existWorker = true;
                break;
            }
        }

        if(!existWorker) {
            arrWorkerName.push(arrTasks[i].worker_name);
        }
    }

    var workerNames = "";
    for(var i=0 ; i < arrWorkerName.length ; i++) {
        if(i != 0) {
            workerNames = workerNames + ", " + arrWorkerName[i];
        } else {
            workerNames = arrWorkerName[i];
        }
    }

    return workerNames;
}

function isShowLocation(status) {
    if(status == 1 || status == 2 || status == 3) {
        return true;
    } else {
        return false;
    }
}

function isShowFeedback(status) {
    if(status == 5) {
        return true;
    } else {
        return false;
    }
}

function isShowDetail(status) {
    if(status == 0) {
        return true;
    } else {
        return false;
    }
}

function isShowCompleted(status) {
    if(status == 6) {
        return true;
    } else {
        return false;
    }
}

function isWorkHolding(status) {
    if(status == 2) {
        return true;
    } else {
        return false;
    }
}

function getToday() {
    Date.prototype.yyyymmdd = function() {
        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
        var dd  = this.getDate().toString();
        return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) +"-"+ (dd[1]?dd:"0"+dd[0]); // padding
    };

    var d = new Date();
    return d.yyyymmdd();
}

function getFormmatedDate(d) {

}