
//Start
const weatherToday = document.querySelector(".weather-today")
const weatherData = document.querySelector(".weather-data")
const todayEl = document.querySelector(".today-el")
const mainContainer = document.querySelector(".container")
const weeklyDataEl = document.querySelector(".weekly-data")
const todayHighlights = document.querySelector("today-highlights")
const unsplashImgParent = document.querySelector(".img-unsplash")
const inputSearch = document.querySelector(".input-search")
const searchBtn = document.querySelector(".weather-search-btn")
const todayDataH2 = document.querySelector(".today-weather-h2")
const windParentEl = document.querySelector(".today-wind")
const sunParentEl = document.querySelector(".sun-data")
const humidityParentEl = document.querySelector(".today-humidity")
const visibilityParentEl = document.querySelector(".today-visibility")
const rainParentEl = document.querySelector(".today-rain")
const uvIndexParentEl = document.querySelector(".today-uv-index")
let errorDiv = document.createElement("div")
let locationErrorEl = document.createElement("div")

function locationError(){
    weatherToday.style.display="none";
    mainContainer.style.display="none";
    if(errorDiv.children.length){
        errorDiv.style.display = 'none'
    }
    if(locationErrorEl.children.length){
        console.log('Location Error');
        locationErrorEl.style.display = 'flex';
    }
    else{
        locationErrorEl.style.display = 'flex';
        locationErrorEl.className = 'location-error'
        let errorEl = document.createElement("p")
        errorEl.appendChild(document.createElement(`We couldn't access your location. Make sure location services are turned ON in your phone's settings, then reload the page.`))
        locationErrorEl.appendChild(errorEl)
        document.body.appendChild(locationErrorEl)
    }
}

function errorFunction(){
    weatherToday.style.display="none";
    mainContainer.style.display="none";
    if(errorDiv.children.length){
        console.log("try searching new location");
    }
    else{
        errorDiv.style.display = "flex";
        errorDiv.className = "error-search-div"
        let errorEl1 = document.createElement("p")
        let errorEl2 = document.createElement("p")
        errorEl1.appendChild(document.createTextNode("Sorry! No Data Available"))
        errorEl2.appendChild(document.createTextNode(`Try searching different location`))
        errorDiv.appendChild(errorEl1)
        errorDiv.appendChild(errorEl2)
        document.body.appendChild(errorDiv);
    }
};
fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature").then((res)=>{
    if(!res.ok){
        throw new Error("Failed to load Image");
    }
    return res.json()
}).then((data)=>{
    let imgUnsplash = document.createElement("img")
    if(data){
        imgUnsplash.setAttribute("src",`${data["urls"]["full"]}`)
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
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=c44d33c70e474799992132141250505&q=${position.coords.latitude},${position.coords.longitude}&days=7`)
    .then((res)=>{
        if(!res.ok){
            throw new Error("This location data is not availbale")
        }
        return res.json()
    }).then((data)=>{
        console.log(data);
        //For-Allocation
        weatherToday.style.display="flex";
        mainContainer.style.display="block";
        errorDiv.style.display='none';
        locationErrorEl.style.display = 'none';
        //image-element
        let imgData = document.createElement("div");
        imgData.className = "img-data";
        let imgEl = document.createElement("img");
        imgEl.setAttribute("src",`${data["current"]["condition"]["icon"]}`);
        imgData.appendChild(imgEl);
        //temp-data
        let tempData = document.createElement("p");
        tempData.className = "temp-data";
        let tempToday = Math.floor(data["current"]["temp_c"]);
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
        imgWeather.setAttribute("src",`${data["current"]["condition"]["icon"]}`);
        let weatherTodayEl = document.createElement("p");
        weatherTodayEl.className = "weather-today-p";
        let tempRangeData = Math.floor(data["current"]["feelslike_c"]);
        weatherTodayEl.appendChild(document.createTextNode(`Fells like : ${tempRangeData}°C`));
        todayEl.appendChild(imgWeather);
        todayEl.appendChild(weatherTodayEl);

        //container
        //wind-data

        let windDataKm = document.createElement("p")
        windDataKm.className = "today-wind-speed"
        let windDirection = document.createElement("p")
        windDataKm.appendChild(document.createTextNode(`${data["current"]["wind_kph"]} km/hr`))
        windDirection.innerHTML = `<i class="fa-regular fa-compass"></i> ${data["current"]["wind_dir"]}`
        windDataKm.appendChild(windDirection)
        windParentEl.appendChild(windDataKm)
        //sun-data
        let sunriseEl = document.createElement("p")
        let sunsetEl = document.createElement("p")
        sunriseEl.innerHTML = `<i class="fa-regular fa-circle-up"></i> ${data["forecast"]["forecastday"][0]["astro"]["sunrise"]}`
        sunsetEl.innerHTML = `<i class="fa-regular fa-circle-down"></i> ${data["forecast"]["forecastday"][0]["astro"]["sunset"]}`
        sunParentEl.appendChild(sunriseEl)
        sunParentEl.appendChild(sunsetEl)
        //humidity-data
        let humidityData = data["current"]["humidity"]
        let humidityEl = document.createElement("p")
        humidityEl.appendChild(document.createTextNode(`${humidityData}%`))
        let humidtyDataEl = document.createElement("p")
        if(humidityData>=30 && humidityData<=50){
            humidtyDataEl.appendChild(document.createTextNode(`Normal 🤙🏻`))
        }
        else if(humidityData>50){
            humidtyDataEl.appendChild(document.createTextNode('High 🙄'))
        }
        else{
            humidtyDataEl.appendChild(document.createTextNode('Dry 😏'))
        }
        humidityParentEl.appendChild(humidityEl)
        humidityParentEl.appendChild(humidtyDataEl)
        //visibility-data
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
        let rainDataEl = document.createElement("p")
        rainDataEl.appendChild(document.createTextNode(`${data["current"]["precip_mm"]} mm`))
        rainParentEl.appendChild(rainDataEl)

        //uv-data
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
        
        //weekly-data
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
    }).catch((error)=>{
        errorFunction();
    })
},
  (error) => {
    if (error.code === error.PERMISSION_DENIED) {
      alert("Location access is needed for weather info. Please enable location.");
      errorFunction();
    } else if (error.code === error.POSITION_UNAVAILABLE) {
      alert("Location is unavailable. Please turn on your device's location services.");
      errorFunction();
    } else {
      alert("An error occurred: " + error.message);
      errorFunction();
    }
  }
)

//function-render
function renderData(locationName){
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=c44d33c70e474799992132141250505&q=${locationName}&days=7`)
    .then((res)=>{
        if(!res.ok){
            throw new Error("This Location Data not available")
        }
        return res.json();
    }).then((data)=>{
        console.log(data);
        //weather-data
        weatherToday.style.display="flex";
        mainContainer.style.display="block";
        //error
        errorDiv.style.display='none';
        locationErrorEl.style.display = 'none';
        //img-data
        let imgData = document.createElement("div");
        imgData.className = "img-data";
        let imgEl = document.createElement("img");
        imgEl.setAttribute("src",`${data["current"]["condition"]["icon"]}`);
        imgData.appendChild(imgEl);
        //temp-data
        let tempData = document.createElement("p");
        tempData.className = "temp-data";
        let tempToday = Math.floor(data["current"]["temp_c"]);
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
        imgWeather.setAttribute("src",`${data["current"]["condition"]["icon"]}`);
        let weatherTodayEl = document.createElement("p");
        weatherTodayEl.className = "weather-today-p";
        let tempRangeData = Math.floor(data["current"]["feelslike_c"]);
        weatherTodayEl.appendChild(document.createTextNode(`Fells like : ${tempRangeData}°C`));
        todayEl.appendChild(imgWeather);
        todayEl.appendChild(weatherTodayEl);
        //Container
        //wind-data
        let headingWind = document.createElement("p")
        headingWind.className = "highlights-heading"
        headingWind.appendChild(document.createTextNode(`Wind Status`))
        let windDataKm = document.createElement("p")
        windDataKm.className = "today-wind-speed"
        let windDirection = document.createElement("p")
        windDataKm.appendChild(document.createTextNode(`${data["current"]["wind_kph"]} km/hr`))
        windDirection.innerHTML = `<i class="fa-regular fa-compass"></i> ${data["current"]["wind_dir"]}`
        windParentEl.appendChild(headingWind)
        windDataKm.appendChild(windDirection)
        windParentEl.appendChild(windDataKm)
       
        //sun-data
        let headingSun = document.createElement("p")
        headingSun.className = "highlights-heading"
        headingSun.appendChild(document.createTextNode(`Sunrise & Sunset`))
        let sunriseEl = document.createElement("p")
        let sunsetEl = document.createElement("p")
        sunriseEl.innerHTML = `<i class="fa-regular fa-circle-up"></i> ${data["forecast"]["forecastday"][0]["astro"]["sunrise"]}`
        sunsetEl.innerHTML = `<i class="fa-regular fa-circle-down"></i> ${data["forecast"]["forecastday"][0]["astro"]["sunset"]}`
        sunParentEl.appendChild(headingSun)
        sunParentEl.appendChild(sunriseEl)
        sunParentEl.appendChild(sunsetEl)
        //humidity-data
        let headingHumidity = document.createElement("p")
        headingHumidity.className = "highlights-heading"
        headingHumidity.appendChild(document.createTextNode(`Humidity`))
        let humidityData = data["current"]["humidity"]
        let humidityEl = document.createElement("p")
        humidityEl.appendChild(document.createTextNode(`${humidityData}%`))
        let humidtyDataEl = document.createElement("p")
        if(humidityData>=30 && humidityData<=50){
            humidtyDataEl.appendChild(document.createTextNode(`Normal 🤙🏻`))
        }
        else if(humidityData>50){
            humidtyDataEl.appendChild(document.createTextNode('High 🙄'))
        }
        else{
            humidtyDataEl.appendChild(document.createTextNode('Dry 😏'))
        }
        humidityParentEl.appendChild(headingHumidity)
        humidityParentEl.appendChild(humidityEl)
        humidityParentEl.appendChild(humidtyDataEl)

        //visibility-data
        let headingVisibility = document.createElement("p")
        headingVisibility.className = "highlights-heading"
        headingVisibility.appendChild(document.createTextNode(`Visibility`))
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
        visibilityParentEl.appendChild(headingVisibility)
        visibilityParentEl.appendChild(visibiltyRangeEl)
        visibilityParentEl.appendChild(visibilityDataEl)

        //rain-data
        let headingRain = document.createElement("p")
        headingRain.className = "highlights-heading"
        headingRain.innerHTML = `<p>Precipitation</p><i class="fa-solid fa-snowflake"></i>`
        let rainDataEl = document.createElement("p")
        rainDataEl.appendChild(document.createTextNode(`${data["current"]["precip_mm"]} mm`))
        rainParentEl.appendChild(headingRain)
        rainParentEl.appendChild(rainDataEl)


        //uv-data
        let headingUvI = document.createElement("p")
        headingUvI.className = "highlights-heading"
        headingUvI.appendChild(document.createTextNode(`Uv Index`))
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
        uvIndexParentEl.appendChild(headingUvI)
        uvIndexParentEl.appendChild(uvDataEl)
        uvIndexParentEl.appendChild(uvRangeEl)

        //weekly-data
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
            // weekTempEl.innerHTML = `High:${maxTemp}°C Low:${minTemp}°C`
            weekTempEl.appendChild(document.createTextNode(`High:${maxTemp}°C Low:${minTemp}°C`))
            weeklyDivEl.appendChild(weekDayEl)
            weeklyDivEl.appendChild(weeklyImgEl)
            weeklyDivEl.appendChild(weekTempEl)
            weeklyDataEl.appendChild(weeklyDivEl)
        });
    }).catch((err)=>{
        errorFunction();
        console.error(err);

    })

}

//btn-click
searchBtn.addEventListener("click",()=>{
    let locationName = inputSearch.value;
    if (weatherData.children.length) {
        while (weatherData.firstChild) {
            weatherData.removeChild(weatherData.firstChild);
        }
    }
    if(todayEl.children.length){
        while(todayEl.firstChild){
            todayEl.removeChild(todayEl.firstChild)
        }
    }
    
    if(windParentEl.children.length){
        while(windParentEl.firstChild){
            windParentEl.removeChild(windParentEl.firstChild)
        }
    }
    if(sunParentEl.children.length){
        while(sunParentEl.firstChild){
            sunParentEl.removeChild(sunParentEl.firstChild)
        }
    }
    if(rainParentEl.children.length){
        while(rainParentEl.firstChild){
            rainParentEl.removeChild(rainParentEl.firstChild)
        }
    }
    if(humidityParentEl.children.length){
        while(humidityParentEl.firstChild){
            humidityParentEl.removeChild(humidityParentEl.firstChild)
        }
    }
    if(visibilityParentEl.children.length){
        while(visibilityParentEl.firstChild){
            visibilityParentEl.removeChild(visibilityParentEl.firstChild)
        }
    }
    if(uvIndexParentEl.children.length){
        while(uvIndexParentEl.firstChild){
            uvIndexParentEl.removeChild(uvIndexParentEl.firstChild)
        }
    }
    if(weeklyDataEl.children.length){
        while(weeklyDataEl.firstChild){
            weeklyDataEl.removeChild(weeklyDataEl.firstChild)
        }
    }
    inputSearch.value='';
    //render-function
    renderData(locationName)
})
