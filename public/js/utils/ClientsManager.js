
const ClientsManager = (function () {

    let clients = [];
    let callGroup = [];


    const _updateClient = function (oldCl, newCl) {
        // 상태가 다르면 newCl 적용,
        // Connected 상태로 변경시 timer update
        // Connected 상태유지시 oldCl의 timer유지
        if (oldCl.state === "CONNECTEED" && newCl.state === "CONNECTED") {
            return oldCl;
        }
        else if (oldCl.state !== "CONNECTEED" && newCl.state === "CONNECTED") {
            console.log('[ClinetsManager] start Clock')
            // newCl.timer = new AppStopwatch();
            // newCl.timer.startClock($(`#calltime_${newCl.sid}`).children());
            return newCl
        }
        else {
            return newCl
        }

    }

    const _setClients = function (newClients) {
        // 기존 클라이언트와 새 클라이언트 비교하여
        // 1. 새 클라이언트에 없는 기존 클라이언트 제거
        // 2. 기존 클라이언트에 없는 새 클라이언트 추가
        // 3. 기존 클라이언트에 있는 새 클라이언트 업데이트
        const tmpClients = []
        newClients.forEach((newCl) => {
            let oldCl = clients.find((cl) => cl.sid === newCl.sid)
            if (oldCl) {
                tmpClients.push(_updateClient(oldCl, newCl));
            }
            else {
                tmpClients.push(newCl);
            }
        })

        clients = tmpClients;
        console.log('[ClientsManager] _setClients >> ', clients)
    }

    const _setCallGroup = function (newClients) {

        // 통화가 끊어진 client는 timer제거
        callGroup.forEach((cl) => {
            if (!newClients.find((nCl) => nCl.sid === cl.sid)) {
                // console.log(cl.timer)
                cl.timer.reset();
                // clearInterval(cl.timer);
            }
        })

        const tmpGroup = []
        newClients.forEach((newCl) => {
            let oldCl = callGroup.find((cl) => cl.sid === newCl.sid)
            if (oldCl) {
                console.log(oldCl)
                tmpGroup.push(oldCl);
            }
            else {
                newCl.timer = new Timer(`calltime_${newCl.sid}`);
                newCl.timer.start();
                tmpGroup.push(newCl);
            }
        })


        callGroup = tmpGroup;
        console.log('[ClientsManager] _setCallGroup >> ', callGroup)
    }

    const _getClients = function () {
        return callGroup.concat(clients)
    }

    const _getCallGroup = function () {
        return callGroup
    }

    // const _startTimer = function (sid) {
    //     let client = callGroup.find((cl) => cl.sid === sid)
    //     if (client) {
    //         // client.timer = new AppStopwatch();
    //         // client.timer.startClock($(`#calltime_${sid}`).children());
    //         client.timer = new Timer(`calltime_${sid}`);
    //         client.timer.start();
    //     }
    // }

    return {
        getClients: _getClients,
        setClients: _setClients,
        setCallGroup: _setCallGroup,
        getCallGroup: _getCallGroup,
        // startTimer: _startTimer
    }

}())

function Timer(id) {
    this.time = 0;
    this.interval = null;
    this.id = id;

    this.start = function () {
        this.interval = setInterval(() => {
            this.time++;
            let element = document.getElementById(this.id);
            if (element) {
                element.textContent = moment().hour(0).minute(0).second(this.time).format('mm : ss');
            }
        }, 1000)
    }

    this.reset = function () {
        clearInterval(this.interval);
        this.time = 0;
    }
}

// export default ClientsManager;
