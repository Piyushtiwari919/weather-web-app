//Start
const weatherToday = document.querySelector(".weather-today")
const weatherData = document.querySelector(".weather-data")
const todayEl = document.querySelector(".today-el")
const mainContainer = document.querySelector(".container")
const weeklyDataEl = document.querySelector(".weekly-data")
const todayHighlights = document.querySelector("today-highlights")
const unsplashImgParent = document.querySelector(".img-unsplash")
let mainData = 0
let imageData = 0
fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature").then((res)=>{
    if(!res.ok){
        throw new Error("Failed to load Image");
    }
    return res.json()
}).then((data)=>{
    imageData = data
    let imgUnsplash = document.createElement("img")
    if(imageData){
        imgUnsplash.setAttribute("src",`${imageData["urls"]["full"]}`)
    }
    else{
        imgUnsplash.setAttribute("src",'https://images.unsplash.com/photo-1483206048520-2321c1a5fb36?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDQ2MTkyMDh8&ixlib=rb-4.0.3&q=85')
    }
    unsplashImgParent.appendChild(imgUnsplash)
    
}).catch((error)=>{
    document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1483206048520-2321c1a5fb36?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDQ2MTkyMDh8&ixlib=rb-4.0.3&q=85)`
})

navigator.geolocation.getCurrentPosition((position)=>{
    console.log(position);
    fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`)
    .then((res)=>{
        return res.json();
    }).then((data)=>{
        console.log(data);
        mainData = data
        //weather-data
        //img-data
        let imgData = document.createElement("div");
        imgData.className = "img-data";
        let imgEl = document.createElement("img");
        imgEl.setAttribute("src",`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
        imgData.appendChild(imgEl);
        //temp-data
        let tempData = document.createElement("p");
        tempData.className = "temp-data";
        let tempToday = Math.floor(data["main"]["temp"]);
        tempData.appendChild(document.createTextNode(`${tempToday}°C`));
        //date-data
        let date = new Date();
        const options = {
            weekday: "long",
            month: "long",
            day: "numeric",
        };
        let todayDate = date.toLocaleDateString("en-us",options);
        let dateEl = document.createElement("p");
        dateEl.className = "today-date";
        dateEl.appendChild(document.createTextNode(`${todayDate}`))
        weatherData.appendChild(imgData);
        weatherData.appendChild(tempData);
        weatherData.appendChild(dateEl);
        
        //today-el
        let imgWeather = document.createElement("img");
        imgWeather.setAttribute("src",`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
        let weatherTodayEl = document.createElement("p");
        weatherTodayEl.className = "weather-today-p";
        weatherTodayEl.appendChild(document.createTextNode(`${data["weather"][0]["main"]}`));
        todayEl.appendChild(imgWeather)
        todayEl.appendChild(weatherTodayEl)
        
        //later
        // let sunriseTimeStamp = data["sys"]["sunrise"]
        // let sunsetTimeStamp = data["sys"]["sunset"]
        // let sunriseData = new Date(sunriseTimeStamp*1000)
        // let sunsetData = new Date(sunsetTimeStamp*1000)
        // console.log(sunriseData.toLocaleTimeString());
        // console.log(sunsetData.toLocaleTimeString());

    });

    fetch(`http://api.weatherapi.com/v1/forecast.json?key=c44d33c70e474799992132141250505&q=${position.coords.latitude},${position.coords.longitude}&days=7`)
    .then((res)=>{
        return res.json()
    }).then((data)=>{
        console.log(data);
        //wind-data
        const windParentEl = document.querySelector(".today-wind")
        let windDataKm = document.createElement("p")
        windDataKm.className = "today-wind-speed"
        let windDirection = document.createElement("p")
        windDataKm.appendChild(document.createTextNode(`${data["current"]["wind_kph"]} km/hr`))
        windDirection.innerHTML = `<i class="fa-regular fa-compass"></i> ${data["current"]["wind_dir"]}`
        windParentEl.appendChild(windDataKm)
        windDataKm.appendChild(windDirection)
        //sun-data
        const sunParentEl = document.querySelector(".sun-data")
        let sunriseEl = document.createElement("p")
        let sunsetEl = document.createElement("p")
        sunriseEl.innerHTML = `<i class="fa-regular fa-circle-up"></i> ${data["forecast"]["forecastday"][0]["astro"]["sunrise"]}`
        sunsetEl.innerHTML = `<i class="fa-regular fa-circle-down"></i> ${data["forecast"]["forecastday"][0]["astro"]["sunset"]}`
        sunParentEl.appendChild(sunriseEl)
        sunParentEl.appendChild(sunsetEl)
        //humidity-data
        const humidityParentEl = document.querySelector(".today-humidity")
        let humidityData = data["current"]["humidity"]
        let humidityEl = document.createElement("p")
        humidityEl.appendChild(document.createTextNode(`${humidityData}%`))
        let humidtyDataEl = document.createElement("p")
        if(humidityData>=30 && humidityData<=50){
            humidtyDataEl.appendChild(document.createTextNode(`Normal 🤙🏻`))
        }
        else if(humidityData>50){
            humidtyDataEl.appendChild(document.createTextNode('Uncomfortable 🙄'))
        }
        else{
            humidtyDataEl.appendChild(document.createTextNode('Dry 😏'))
        }
        humidityParentEl.appendChild(humidityEl)
        humidityParentEl.appendChild(humidtyDataEl)
        //visibility-data
        const visibilityParentEl = document.querySelector(".today-visibility")
        let visibiltyRangeEl = document.createElement("p")
        let visibilityData = data["current"]["vis_km"]
        visibiltyRangeEl.appendChild(document.createTextNode(`${visibilityData}`))
        let visibilityDataEl = document.createElement("p")
        if(visibilityData>=10){
            visibilityDataEl.appendChild(document.createTextNode('Good 🙂'))
        }
        else if(visibilityData>=5 && visibilityData<10){
            visibilityDataEl.appendChild(document.createTextNode('Moderate 😐'))
        }
        else{
            visibilityDataEl.appendChild(document.createTextNode("Poor 🙁"))
        }
        visibilityParentEl.appendChild(visibiltyRangeEl)
        visibilityParentEl.appendChild(visibilityDataEl)
        //rain-data
        const rainParentEl = document.querySelector(".today-rain")
        let rainDataEl = document.createElement("p")
        let rainDecoEl = document.createElement("p")
        rainDataEl.appendChild(document.createTextNode(`${data["current"]["precip_mm"]} mm`))
        rainParentEl.appendChild(rainDataEl)

        //uv-data
        const uvIndexParentEl = document.querySelector(".today-uv-index")
        let uvDataEl = document.createElement("p")
        let uvRangeEl = document.createElement("p")
        let uvData = data["current"]["uv"]
        uvDataEl.appendChild(document.createTextNode(`${uvData}`))
        if(0<=uvData && uvData<=2){
            uvRangeEl.appendChild(document.createTextNode('Normal 🙂'))
        }
        else if(2<uvData && uvData<=5){
            uvRangeEl.appendChild(document.createTextNode('Moderate 😐'))
        }
        else if(5<uvData && uvData<=7){
            uvRangeEl.appendChild(document.createTextNode('High 🙁'))
        }
        else if(8<uvData && uvData<=10){
            uvRangeEl.appendChild(document.createTextNode('Very High ☹️'))
        }
        else{
            uvRangeEl.appendChild(document.createTextNode('Extreme 🤕'))
        }
        uvIndexParentEl.appendChild(uvDataEl)
        uvIndexParentEl.appendChild(uvRangeEl)
        data['forecast']['forecastday'].forEach((dataQ)=> {
            console.log(dataQ);
            //parent-div
            let weeklyDivEl = document.createElement("div")
            //p-element
            let weekDayEl = document.createElement("p")
            const dateString = dataQ["date"];
            const date = new Date(dateString);
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const dayName = days[date.getDay()];
            weekDayEl.appendChild(document.createTextNode(`${dayName}`))
            // //img-element
            let weeklyImgEl = document.createElement("img")
            weeklyImgEl.setAttribute("src",`${dataQ["day"]["condition"]["icon"]}`)
            weeklyImgEl.setAttribute("alt",dataQ["day"]["condition"]["text"])
            let weekTempEl = document.createElement("p")
            let maxTemp = Math.floor(dataQ["day"]["maxtemp_c"])
            let minTemp = Math.floor(dataQ["day"]["mintemp_c"])
            weekTempEl.innerHTML = `High:${maxTemp}°C Low:${minTemp}°C`
            // weekTempEl.appendChild(document.createTextNode(`${maxTemp}°C ${minTemp}°C`))
            weeklyDivEl.appendChild(weekDayEl)
            weeklyDivEl.appendChild(weeklyImgEl)
            weeklyDivEl.appendChild(weekTempEl)
            weeklyDataEl.appendChild(weeklyDivEl)
        });
    })
})