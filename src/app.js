const hbs = require('hbs')
const express = require('express')
const path = require('path')
const axios = require('axios').default
const fs = require('fs')
const bodyParser = require('body-parser')
const pr = require('../src/promise')
const app = express()
const config = require('../config.json')
const urlencodedParser = bodyParser.urlencoded({extended: true})
const statPath = path.join(__dirname, '../public')
const views = path.join(__dirname, '../templates/views')
const partials = path.join(__dirname, '../templates/partials')
const API_key = config.API_Key


const parseDataDaily = function (obj) {
    obj.dt = pr.unixToHuman(obj.dt, 2)
    
    if (obj.sunrise) {
        obj.sunrise = pr.unixToHuman(obj.sunrise, 1)
        obj.sunset = pr.unixToHuman(obj.sunset, 1)
    }
    obj.weather = obj.weather[0]
    return obj
}

const doItFunc = (data) => {
    if (data.current && data.hourly && data.daily) {
        data.current = parseDataDaily(data.current)
        data.hourly.forEach(element => {
            element = parseDataDaily(element);

        });
        data.daily.forEach(element => {
            element = parseDataDaily(element);
        });
        return data
    }
    else {
        return {}
    }


}

const timeLimit = function (filename) {
    const timeOnce = fs.readFileSync(filename)
    const elapsed = Date.now() - Number(timeOnce)
    if (elapsed > 15000) {

        console.log(`Time elapsed: ${elapsed}`)
        console.log('Calling API......')
        pr.halfCalling(API_key, 'Delhi', 'secData01.json')
        pr.halfCalling(API_key, 'Tokyo', 'secData02.json')
        pr.halfCalling(API_key, 'New%20York', 'secData03.json')

        fs.writeFileSync(filename, Date.now().toString())
    }
    else {
        console.log('Waiting!')
    }

}

timeLimit('data.txt');

app.set('view engine', 'hbs')
app.set('views', views)
hbs.registerPartials(partials)

app.use(express.static(statPath))
app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/home', (req, res) => {
    const one = pr.getJSONData('secData01.json')
    const two = pr.getJSONData('secData02.json')
    const three = pr.getJSONData('secData03.json')

    res.render('index', {
        first: {
            name: one.name,
            weather: one.weather[0],
            main: one.main,
            vis: one.visibility,
            wind: one.wind,
            cloud: one.clouds,
            date: pr.unixToHuman(one.dt, 2),
            sunrise: pr.unixToHuman(one.sys.sunrise, 1),
            sunset: pr.unixToHuman(one.sys.sunset, 1),
            timezone: one.timezone/3600
        },
        second: {
            name: two.name,
            weather: two.weather[0],
            main: two.main,
            vis: two.visibility,
            wind: two.wind,
            cloud: two.clouds,
            date: pr.unixToHuman(two.dt, 2),
            sunrise: pr.unixToHuman(two.sys.sunrise, 1),
            sunset: pr.unixToHuman(two.sys.sunset, 1),
            timezone: two.timezone/3600
        },
        third: {
            name: three.name,
            weather: three.weather[0],
            main: three.main,
            vis: three.visibility/1000,
            wind: three.wind,
            cloud: three.clouds,
            date: pr.unixToHuman(three.dt, 2),
            sunrise: pr.unixToHuman(three.sys.sunrise, 1),
            sunset: pr.unixToHuman(three.sys.sunset, 1),
            timezone: three.timezone/3600
        }
    })
})



app.get('/forms', (req, res) => {
    res.render('forms', )
})

app.get('/process', (req, res) => {
    res.render('process',)
})

app.post('/process', urlencodedParser, (req, res) => {
    
    pr.getDataFunc(API_key, req.body.location, 'minutely').then(response => {
        const newData = doItFunc(response)
        res.render('process', {
            timezone: newData.timezone,
            location: req.body.location,
            current: newData.current,
            daily: {
                one: newData.daily[0],
                two: newData.daily[1],
                three: newData.daily[2],
                four: newData.daily[3],
                five: newData.daily[4],
                six: newData.daily[5],
                seven: newData.daily[6],
                eight: newData.daily[7]
            }
        })
    })
    
})

app.get('/about', (req, res) => {
    res.render('about', )
})

app.get('*', (req, res)=> {
    res.send('404 Error!')
})
app.listen(3000, () => {
    console.log("Server has started!")
})







