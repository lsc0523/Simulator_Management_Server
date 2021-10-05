const RapService = {

    get: function (url) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    if (res.ok) {
                        return res.json()
                    }
                    else {
                        throw new Error(res.body)
                    }
                })
                .then(data => resolve(data))
                .catch(err => reject(err))
        })
    },

    post: function (url, data) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    if (res.ok) {
                        return res.json()
                    }
                    else {
                        throw new Error(res.body)
                    }
                }).then(data => resolve(data))
                .catch(err => reject(err))
        })
    },

    postFile: function (url, key, file) {
        return new Promise((resolve, reject) => {

            const data = new FormData()
            data.append(key, file)
            fetch(url, {
                method: 'POST',
                body: data
            })
                .then(res => {
                    if (res.ok) {
                        return res.json()
                    }
                    else {
                        throw new Error(res.body)
                    }
                }).then(data => resolve(data))
                .catch(err => reject(err))
        })
    },

    put: function (url, data) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    if (res.ok) {
                        return res.json()
                    }
                    else {
                        throw new Error(res.body)
                    }
                }).then(data => resolve(data))
                .catch(err => reject(err))
        })
    },

    delete: function (url) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    if (res.ok) {
                        return res.json()
                    }
                    else {
                        throw new Error(res.body)
                    }
                })
                .then(data => resolve(data))
                .catch(err => reject(err))
        })
    },
    postSFTP: function (url, data) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                else {
                    throw new Error(res.body)
                }
            })
                .then(data => resolve(data))
                .catch(err => reject(err))
             
        })
        
    }

}

export default RapService;
