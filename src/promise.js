const fs = require('fs')
const axios = require('axios').default

const unixToHuman = function (unix, reqd) {
    const dateObj = new Date(unix * 1000)
    //3 for Time and Date
    //2 for Date only
    //1 for Time only
    if (reqd === 3) {
        return dateObj.toLocaleString()
    }
    else if (reqd === 2) {
        return dateObj.toLocaleDateString()
    }
    else if (reqd == 1) {
        return dateObj.toLocaleTimeString()
    }
}

const addToJSON = function(data, filename) {
    fs.writeFileSync(filename, JSON.stringify(data))
}

const getJSONData = function(filename) {
    const read = fs.readFileSync(filename)
    const data = JSON.parse(read.toString())
    return data
}

function halfCalling (API_key, location, filename) {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_key}&units=metric`)
    .then(res => {
        
        addToJSON(res.data, filename)
    })
    .catch(err => {
        console.error(err)
    })
}

const parseData = function(arr) {
    arr.dt = unixToHuman(arr.dt, 2)
    arr.sunrise = unixToHuman(arr.sunrise, 1)
    arr.sunset = unixToHuman(arr.sunset, 1)
    return arr
}
const API_key = '0a988c0936426cf2b8d2c81c2e0b8851'

const getDataFunc = (API_key, location, part) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_key}`)
                .then(res => {
                    axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${res.data.coord.lat}&lon=${res.data.coord.lon}&exclude=${part}&appid=${API_key}&units=metric`)
                        .then(response => {
                            resolve(response.data)
                        })
                        .catch(error => {
                            reject({})
                        })
                })
                .catch(error => {
                    reject({})
                })
        }, 0)

    })
}




module.exports = {halfCalling, getJSONData, unixToHuman, getDataFunc}

