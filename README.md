# View it live:
https://kitten-weather.netlify.app/

# Weather app
This is a weather app that uses vanilla Java Script and a few different api:s to display weather data. The browser geo-location api provides location, LocationIQ runs a reverse location to get the address data from the location coordinates, and OpenWeather's one-call-endpoint provides the weather data itself. 

Even though no async-await is implemented in this project, I did learn a bit about that from just researching and thinking about how to best chain the different fetch requests to get the desired result. I have some ideas on how to introduce more functionality, but I ran in to some CORS-problems trying to introduce a fetch request to a poetry-api (to display a suitable poem that fits with the current weather description. I think this is an interesting project so I might come back to it and rebuild it in React or React Native when i have a better grasp on how to avoid the cross-origin issues by working with a backend. 
