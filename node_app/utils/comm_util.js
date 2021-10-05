var hhmmss = function(timeinmillis) {
    var today = new Date();
    today.setTime(timeinmillis);
    var mo = this.checkTime(today.getMonth()+1);
    var d  = this.checkTime(today.getDate());
    var h  = this.checkTime(today.getHours());
    var m  = this.checkTime(today.getMinutes());
    return mo + "/" + d + " " + h + ":" + m;
}
var checkTime = function (i) {
    if (i < 10) { i = "0" + i; }
    return i;
}
    
module.exports = function() {
    
    return {
        isEmpty: function(obj) {
            if (obj==null||typeof obj=='undefined') {
                return true;
            } else {
                return false;
            }
        },
        getCurrentDatetime: function() {
			return new Date().getTime();
		},
        todayHhmmss: function() {
            var today = new Date();
            var h = today.getHours();
            var m = today.getMinutes();
            var s = today.getSeconds();
            m     = this.checkTime(m);
            s     = this.checkTime(s);
            return h + ":" + m + ":" + s;
        },
        getIntervalMmSs: function(timeinmillis) {
            if (timeinmillis==null||typeof(timeinmillis)=='undefined') {
                return "00:00";
            } else {
                var interval = (new Date().getTime() - timeinmillis)/1000;
                return this.checkTime(Math.round(interval/60)) + ":" + this.checkTime(Math.round(interval%60));
            }
        },
        hhmmss: hhmmss,
        checkTime: checkTime,
        mmdd_hhmmss: function(timeinmillis) {
            var today = new Date();
            today.setTime(timeinmillis);
            var mm = this.checkTime(today.getMonth()+1);
            var d  = this.checkTime(today.getDate());
            var h  = today.getHours();
            var m  = this.checkTime(today.getMinutes());
            var s  = this.checkTime(today.getSeconds());
            return mm + "." + d + ' ' + h + ":" + m + ":" + s;
        },
        mmdd_hhmm: function(timeinmillis) {
            var today = new Date();
            today.setTime(timeinmillis);
            var mm = this.checkTime(today.getMonth()+1);
            var d  = this.checkTime(today.getDate());
            var h  = today.getHours();
            var m  = this.checkTime(today.getMinutes());
            return mm + "/" + d + ' ' + h + ":" + m;
        }
    }
  
};