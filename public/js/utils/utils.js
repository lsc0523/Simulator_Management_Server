function AppStopwatch(element) {

    this.counter = 0;
    this.el = element;
    this.clock = null;

    const displayTime = () => {
        this.el.textContent = moment().hour(0).minute(0).second(this.counter++).format('mm : ss');
    }

    this.startClock = function () {
        if(!this.clock) {
            this.clock = setInterval(displayTime, 1000);
        }
    }

    this.stopClock = function () {
        this.counter = 0;
        this.el.textContent = "00 : 00"
        clearInterval(this.clock);
        this.clock = null;
    }
}

function currentTime() {
    return (moment().format('HH:mm a'));
}

function trace(text) {
    text = text.trim();
    const now = (window.performance.now() / 1000).toFixed(3);

    console.log(now, text);
}
