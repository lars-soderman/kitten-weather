const main = document.getElementById('main')
const jsArea = document.getElementById('js-area')
const currentWeatherContainer = document.getElementById('current-weather-container')
const sunriseSunsetContainer = document.getElementById('sunrise-sunset-container')
const forecastContainer = document.getElementById('forecast-container')

// let city = ''
// let country = ''
const locationIQAccessToken = 'pk.cb782d57e1da5eb2b2f70566b4fdb2eb'
const openWeatherApiKey = '3addfde144e16d817dcc3a5e9a46ea59' 
let latitude = ''
let longitude = ''

const dateToday = () => {
    return new Date().toLocaleDateString()
}

const toTimeString = unix => {
    const dateObject = new Date(unix * 1000).toLocaleTimeString(['se-SE'], { hour: '2-digit', minute: '2-digit' })
    return dateObject
}

const getWeekday = (daysFromToday) => {
    const now = new Date()
    const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] 
    return week[now.getDay() + daysFromToday]
}
    
    const getForecast = () => {
        const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&units=metric&APPID=`
        fetch (forecastApiUrl + openWeatherApiKey)
        .then ((response) => {
            return response.json()
        })
        .then ((json) => {
            console.log(json)
            // const thisDay = json.list.filter(item => item.dt_txt.includes(dateToday()))
            // console.log(thisDay)
            
            for(let i = 0; i < 6; i++) {
                const iconUrl = `https://openweathermap.org/img/wn/${json.list[i].weather[0].icon}@2x.png`
                forecastContainer.innerHTML += 
                `
                    <div class="day ${json.list[i].dt_txt.includes(dateToday()) ? `today` : `not-today`}">
                        <p>${toTimeString(json.list[i].dt)}</p>
                        <img src="${iconUrl}">
                        <p>${Math.round(json.list[i].main.temp_min)}° / ${Math.round(json.list[i].main.temp_max)}°</p>
                    </div>
                `
            }
        })
        .catch ((err) => {
            console.log('caught error', err)
            forecastContainer.innerHTML = `caught error: ${err}`
        }) 
    }
    
    
    // Get current weather from openweather
    const getCurrentWeather = () => {
        if (city && country) {
        const currentWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&APPID=`
        console.log('')
        fetch (currentWeatherApiUrl + openWeatherApiKey)
        .then(response => response.json())
        .then(json => {
            console.log(json)
            currentWeatherContainer.innerHTML =
            `
                <h3>${json.weather[0].main}</h3>
                <img src='https://openweathermap.org/img/wn/${json.weather[0].icon}@4x.png'>
                <h2>${json.main.temp.toFixed()}°</h2>
            `
            sunriseSunsetContainer.innerHTML =
            `   <div>
                    <img src='./icons/sunrise.svg'>
                    <h4>${toTimeString(json.sys.sunrise)}</h4>
                </div>
                <div>
                    <img src='./icons/sunset.svg'>
                    <h4>${toTimeString(json.sys.sunset)}</h4>
                </div>
            `
            // jsArea.innerHTML = json.weather[0].main

        })
    } else {
        console.log('error - no city and country data')
    }
}

// Get city and country from locationIQ
const getPlaceJson = () => {
    if (latitude && longitude) {
        const url = `https://eu1.locationiq.com/v1/reverse.php?key=${locationIQAccessToken}&lat=${latitude}&lon=${longitude}&format=json`
        fetch(url)
        .then(response => response.json())
        .then(json => {
            console.log(json)
            city = json.address.city
            country = json.address.country
            // Call next function
            getCurrentWeather()
            getForecast()
        })
    } else {
        console.log('error - no latitude and longitude')
    }
}

// Get coordinates from Geolocation API
const getCoords = () => {
    const success = (position) => {
        latitude = position.coords.latitude
        longitude = position.coords.longitude
        // Call next function
        getPlaceJson()
    }
    const error = () => {
        console.log('Unable to retrieve your location')
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error)
        // console.('40')
    } else {
        console.log('Geolocation not supported!')
    }
}

getCoords() 