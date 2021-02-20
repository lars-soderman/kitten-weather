const main = document.getElementById('main')

const locationIQAccessToken = 'pk.cb782d57e1da5eb2b2f70566b4fdb2eb'
const openWeatherApiKey = '3addfde144e16d817dcc3a5e9a46ea59' 
// let latitude = '59.30358549999999'
// let longitude = '17.979155'
// let city = ''
// let country = ''


const getWeather = async () => {
    const coords = await coordsData()
    console.log('response from coordsData: ' + coords)
    // const place = await placeData(latitude, longitude)
    const place = await placeData(coords.latitude, coords.longitude)
    console.log('response from placeData: ' + place)
    const weather = await weatherData(place.address.city, place.address.country)
    console.log('response from weatherData: ' + weather)
    return weather
}

// Get weather from openweather
const weatherData = async (city, country) => {
    const currentWeatherApiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&APPID=`
    fetch (currentWeatherApiUrl + openWeatherApiKey)
    .then(response => response.json())
    .then(json => {
        return json
    })
}

// Get city and country from locationIQ
const placeData = async (latitude, longitude) => {
    const url = `https://eu1.locationiq.com/v1/reverse.php?key=${locationIQAccessToken}&lat=${latitude}&lon=${longitude}&format=json`
    fetch(url)
    .then(response => response.json())
    .then(json => {
        console.log(json)
        return json
        // const response = {
        //     city: json.address.city,
        //     country: json.address.country
        // }
        // return response
    })
}

// Get coordinates from Geolocation API
const coordsData = async () => {
    console.log(' ')
    const success = async (json) => {
        console.log(json)
        return json.coords
        // return (json.coords.latitude, json.coords.longitude)
    }
    const error = async () => {
        console.log(' ')
        console.log('Unable to retrieve your location')
    }
    
    if (navigator.geolocation) {
        console.log(' ')
        const response = navigator.geolocation.getCurrentPosition(success, error)
        console.log(response)
        return response
    } else {
        console.log('Geolocation not supported!')
    }
}

// getCoords() 










const forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=Stockholm,Sweden&units=metric&APPID='
const apiKey = '3addfde144e16d817dcc3a5e9a46ea59' 

// This function converts the data for time into a readable format. (t.ex sunrise time of day)
const timeCalculator = (timestamp) => {
    const dateObject = new Date((timestamp) * 1000).toLocaleTimeString([], {timeStyle: 'short'})
    return dateObject 
}

fetch (currentWeatherApiUrl + apiKey)
    .then ((response) => {
        return response.json()
    })
    .then ((json) => {
        todaysDate.innerHTML = new Date().toDateString();
        temperature.innerHTML = Math.round(json.main.temp)+ '°C'
        city.innerHTML = 
        `
            <h1 class = city-local>${json.name}</h1>
        `
        iconToday.innerHTML = `<img src='http://openweathermap.org/img/wn/${json.weather[0].icon}@4x.png'>`
        condition.innerHTML = `<p>${json.weather[0].description.charAt(0).toUpperCase() + json.weather[0].description.slice(1)}</p>`
        sunrise.innerHTML = `<p>Sunrise ${timeCalculator(json.sys.sunrise)}</p>` // (json.sys.sunrise) filters into timestamp in TimeCalculator function
        sunset.innerHTML = `<p>Sunset ${timeCalculator(json.sys.sunset)}</p>`
        console.log(json)
    })
    .catch ((err) => {
        console.log('caught error', err)
        topContainer.innerHTML = `caught error: ${err}`
    })
  
const getWeekday = (daysFromToday) => {
    const now = new Date()
    const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] 
    return week[now.getDay() + daysFromToday]
}
  
fetch (forecastApiUrl + apiKey)
    .then ((response) => {
        return response.json()
    })
    .then ((json) => {
        console.log(json)
        const filteredForecast = json.list.filter(item => item.dt_txt.includes('12:00'))
        console.log(filteredForecast[0].main.temp)
        
        for(let i = 0; i < 5; i++) {
            const iconUrl = `http://openweathermap.org/img/wn/${filteredForecast[i].weather[0].icon}@2x.png`
            weeklyForecastContainer.innerHTML += 
            `
                <div class="day">
                    <p class="week-day-name">${getWeekday(i + 1)}</p>
                    <img src="${iconUrl}">
                    <p>${Math.round(filteredForecast[i].main.temp)}°C</p>
                </div>
            `
        }
    })
    .catch ((err) => {
        console.log('caught error', err)
        weeklyForecastContainer.innerHTML = `caught error: ${err}`
    })
