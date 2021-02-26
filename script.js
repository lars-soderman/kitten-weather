const date = document.getElementById('date')
const time = document.getElementById('time')
const place = document.getElementById('place')
const weatherContainer = document.getElementById('weather-container')
const searchInput = document.getElementById('search-input')
const geoLocate = document.getElementById('geo-locate')
const searchBtn = document.getElementById('search-btn')

const locationIQAccessToken = 'pk.cb782d57e1da5eb2b2f70566b4fdb2eb'
const openWeatherApiKey = '3addfde144e16d817dcc3a5e9a46ea59' 
let foundPlace

// Put date in nav
date.innerHTML = new Date().toLocaleString('en-EN', { weekday: 'long', month: 'long', day: 'numeric' })

// Helper functions

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

// Render weather
const renderWeather = (json) => {
    
    const renderDayInfo = (json) => {
        console.log(json)
        let dayInfo = ''
        dayInfo +=
            `
            <p>Temp feels like:<span> ${Math.round(json.current.feels_like)}°</span></p>
            <p>Temp morning:<span> ${Math.round(json.current.feels_like)}°</span></p>
            <p>Temp day:<span> ${Math.round(json.current.feels_like)}°</span></p>
            <p>Temp evening:<span> ${Math.round(json.current.feels_like)}°</span></p>
            <p>Temp night:<span> ${Math.round(json.current.feels_like)}°</span></p>
            <p>Temp min:<span> ${Math.round(json.current.feels_like)}°</span></p>
            <p>Temp max:<span> ${Math.round(json.current.feels_like)}°</span></p>
            <p>Temp max:<span> ${Math.round(json.current.feels_like)}°</span></p>
            <p>Cloud cover:<span> ${json.current.clouds}%</span></p>
            <p>Humidity:<span> ${json.current.humidity}%</span></p>
            <p>Air pressure:<span> ${json.current.pressure}hPa</span></p>
            <p>UV index:<span> ${json.current.uvi}</span></p>
            <p>Wind direction:<span> ${json.current.wind_deg}</span></p>
            <p>Wind speed:<span> ${json.current.wind_speed}</span></p>
            <p>Dew point:<span> ${json.current.dew_point}</span></p>
            `
        return dayInfo
    }
    
    const renderDayForecast = (json) => {
        let dayForecast = ''
        for(let i = 0; i < 9; i++) {
            dayForecast +=
            `<div class="line ${(new Date(json.hourly[i].dt * 1000).toDateString() === new Date().toDateString()) ? `today` : `not-today`}">
                <p>${toTimeString(json.hourly[i].dt)}</p>
                <img src="https://openweathermap.org/img/wn/${json.hourly[i].weather[0].icon}@2x.png">
                <p class="forecast-temperature">${Math.round(json.hourly[i].temp)}°</p>
            </div>`   
        }
        return dayForecast
    }
    const renderWeekForecast = (json) => {
        let weekForecast = ''
        for(let i = 0; i < json.daily.length; i++) {
            weekForecast +=
            `<div class="line">
                <p>${getWeekday(i + 1)}</p>
                <img src="https://openweathermap.org/img/wn/${json.daily[i].weather[0].icon}@2x.png">
                <p class="forecast-temperature">${Math.round(json.daily[i].temp.day)}°</p>
            </div>`
        }
        return weekForecast
    }
    time.innerHTML = `<p>${new Date().toLocaleTimeString(['se-SE'], { hour: '2-digit', minute: '2-digit' })}</p>`
    weatherContainer.innerHTML =`

    <section id="current-weather">
        <h3>${json.current.weather[0].main}</h3>
        <img src='https://openweathermap.org/img/wn/${json.current.weather[0].icon}@4x.png'>
        <h2>${json.current.temp.toFixed()}°</h2>
    </section>
    <div class="divider"></div>
    <section id="day-info-forecast" class="day-info">
        ${renderDayInfo(json)}
    </section>
    <div class="divider"></div>
    <section id="sunrise-sunset">
        <div>
            <img src='./icons/sunrise.svg'>
            <h4>${toTimeString(json.current.sunrise)}</h4>
        </div>
        <div>
            <img src='./icons/sunset.svg'>
            <h4>${toTimeString(json.current.sunset)}</h4>
        </div>
    </section>
    <div class="divider"></div>
    <section id="day-forecast" class="day forecast">
        ${renderDayForecast(json)}
    </section>
    <div class="divider"></div>
    <section id="week-forecast" class="week forecast">
        ${renderWeekForecast(json)}
    </section>
    <div class="divider"></div>`
    
}

// Get weather and forecast from coordinates
const getWeatherFromCoords = (lat, lon) => {
    console.log(lat, lon)
    const openWeatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=`
    console.log('')
    fetch (openWeatherUrl + openWeatherApiKey)
    .then(response => response.json())
    .then(json => {
        console.log(json)
        renderWeather(json)
    })
}

// Get city and country from coordinates
const getPlaceFromCoords = (latitude, longitude) => {
        const url = `https://eu1.locationiq.com/v1/reverse.php?key=${locationIQAccessToken}&lat=${latitude}&lon=${longitude}&format=json`
        fetch(url)
        .then(response => response.json())
        .then(json => {
            console.log(json)
            if (json.address.city) {
                foundPlace = json.address.city
            } else if (json.address.county) {
                foundPlace = json.address.county
            }
            console.log(foundPlace)
            place.innerHTML = `<p>${foundPlace}</p>`
        })
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
            console.log()
            getWeatherFromCoords(json[0].lat, json[0].lon)
            console.log()
            getPlaceFromCoords(json[0].lat, json[0].lon)
        } else {
            currentWeather = 
            `<p>Sorry! Didn't find any weather on that location</p>`
        }
    })
}

// Get coordinates from Geolocation API
const getUserCoords = () => {
    console.log('')
    const success = (position) => {
        console.log('')
        getWeatherFromCoords(position.coords.latitude, position.coords.longitude)
        console.log('')
        getPlaceFromCoords(position.coords.latitude, position.coords.longitude)
}
    const error = () => {
        console.log('Unable to retrieve your location')
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error)
    } else {
        console.log('Geolocation not supported!')
    }
}

geoLocate.addEventListener('click', () => {getUserCoords()})

searchInput.addEventListener('keydown', function (key) {
    if (key.key === 'Enter') {
        getCoordsFromSearch(searchInput.value)
    }
})
searchBtn.addEventListener('click', () => {
    getCoordsFromSearch(searchInput.value)
})

window.addEventListener('load', (event) => {
    console.log('window load')
    getWeatherFromCoords(59.303590400000004, 17.979222099999998)
    console.log('')
    getPlaceFromCoords(59.303590400000004, 17.979222099999998)
    console.log('')
})


