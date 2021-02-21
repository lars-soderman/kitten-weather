const main = document.getElementById('main')
const date = document.getElementById('date')
const timeContainer = document.getElementById('time-container')
// const jsArea = document.getElementById('js-area')
const currentWeatherContainer = document.getElementById('current-weather-container')
const sunriseSunsetContainer = document.getElementById('sunrise-sunset-container')
const dayForecastContainer = document.getElementById('day-forecast-container')
const weekForecastContainer = document.getElementById('week-forecast-container')
const cityInput = document.getElementById('city-input')

const geoLocate = document.getElementById('geo-locate')

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

const outputCurrentWeather = (json) => {
    currentWeatherContainer.innerHTML =`
        <h3>${json.weather[0].main}</h3>
        <img src='https://openweathermap.org/img/wn/${json.weather[0].icon}@4x.png'>
        <h2>${json.main.temp.toFixed()}°</h2>`
    sunriseSunsetContainer.innerHTML = `
        <div>
            <img src='./icons/sunrise.svg'>
            <h4>${toTimeString(json.sys.sunrise)}</h4>
        </div>
        <div>
            <img src='./icons/sunset.svg'>
            <h4>${toTimeString(json.sys.sunset)}</h4>
        </div>`
}

const outputForecast = (json) => {
    // Output forecast for current day
    for(let i = 0; i < 6; i++) {
        dayForecastContainer.innerHTML += `
        <div class="line ${json.list[i].dt_txt.includes(dateToday()) ? `today` : `not-today`}">
        <p>${toTimeString(json.list[i].dt)}</p>
                <img src="https://openweathermap.org/img/wn/${json.list[i].weather[0].icon}@2x.png">
                <p class="forecast-temperature">${Math.round(json.list[i].main.temp_min)}° / ${Math.round(json.list[i].main.temp_max)}°</p>
                </div>`
    }
    const filteredForecast = json.list.filter(item => item.dt_txt.includes('12:00'))
    for(let i = 0; i < filteredForecast.length; i++) {
        weekForecastContainer.innerHTML += `
        <div class="line">
        <p>${getWeekday(i + 1)}</p>
                <img src="https://openweathermap.org/img/wn/${filteredForecast[i].weather[0].icon}@2x.png">
                <p class="forecast-temperature">${Math.round(filteredForecast[i].main.temp)}°</p>
            </div>`
    }
}

// Put date in nav
date.innerHTML = new Date().toLocaleString('en-EN', { weekday: 'long', month: 'long', day: 'numeric' })
// Put time current weather container
timeContainer.innerHTML = new Date().toLocaleTimeString(['se-SE'], { hour: '2-digit', minute: '2-digit' })

// Get current weather from city and country
const getCurrentWeather = () => {
    if (city && country) {
        const currentWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&APPID=`
        console.log('')
        fetch (currentWeatherApiUrl + openWeatherApiKey)
        .then(response => response.json())
        .then(json => {
            console.log(json)
            outputCurrentWeather(json)
        })
    } else {
        console.log('error - no city and country data')
    }
}

// Get forecast from coordinates    
const getForecastFromCoords = (lat, lon) => {
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=`
    fetch (forecastApiUrl + openWeatherApiKey)
    .then ((response) => {
        return response.json()
    })
    .then ((json) => {
        console.log(json)
        outputForecast(json)
    })
    .catch ((err) => {
        console.log('caught error', err)
        dayForecastContainer.innerHTML = `caught error: ${err}`
    }) 
}
// Get forecast from city and country    
const getForecast = () => {
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&units=metric&APPID=`
    fetch (forecastApiUrl + openWeatherApiKey)
    .then ((response) => {
        return response.json()
    })
    .then ((json) => {
        console.log(json)
        outputForecast(json)
    })
    .catch ((err) => {
        console.log('caught error', err)
        dayForecastContainer.innerHTML = `caught error: ${err}`
    }) 
}
 
// Get weather from coordinates
const getWeatherFromCoords = (lat, lon) => {
    console.log(lat, lon)
    const openWeatherCoordApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=`
    console.log('')
    fetch (openWeatherCoordApiUrl + openWeatherApiKey)
    .then(response => response.json())
    .then(json => {
        console.log(json)
        outputCurrentWeather(json)
    })
}

// Get city and country from coordinates
const getPlaceFromCoords = () => {
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

// Get coordinates from search string
const getCoordsFromSearch = (str) => {
    console.log('')
    const url = `https://eu1.locationiq.com/v1/search.php?key=${locationIQAccessToken}&q=${str}&format=json`
    console.log('')
    fetch(url)
    .then(response => response.json())
    .then(json => {
        console.log('')
        console.log(json)
        if (json.length) {
            getWeatherFromCoords(json[0].lat, json[0].lon)
            getForecastFromCoords(json[0].lat, json[0].lon)

        } else {
            currentWeatherContainer = 
            `<p>Sorry! Didn't find any weather on that location</p>`
        }
    })
}

// Get coordinates from Geolocation API
const getUserCoords = () => {
    const success = (position) => {
        latitude = position.coords.latitude
        longitude = position.coords.longitude
        // Call next function
        getPlaceFromCoords()
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

geoLocate.addEventListener('click', () => {getUserCoords()})
cityInput.addEventListener('keydown', function (key) {
    if (key.key === 'Enter') {
        const inputCity = cityInput.value
        getCoordsFromSearch(inputCity)
    }
})

