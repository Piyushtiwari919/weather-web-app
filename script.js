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
const pressureParentEl = document.querySelector(".pressure-data")
const humidityParentEl = document.querySelector(".today-humidity")
const visibilityParentEl = document.querySelector(".today-visibility")
const locationNameEl = document.querySelector(".location-name");
let weekDayH2 = document.querySelector(".week-info");
let count = 0 ;
const rainParentEl = document.querySelector(".today-rain")
const uvIndexParentEl = document.querySelector(".today-uv-index")
const airQualityEl = document.querySelector(".air-quality-data")
const aqiSection = document.querySelector(".aqi-data-section")
const sunSectionEl = document.querySelector(".sunrise-sunset-section")
const sunStripEl = document.querySelector(".sun-strip-div")
const sunDataEl = document.querySelector(".sun-data-div")
const sunTimingEl = document.querySelector(".sunrise-sunset-timing")
let errorDiv = document.querySelector(".error-div-parent")
let locationErrorEl = document.querySelector(".location-error-parent")
const footerEl = document.querySelector("footer")
let locationErrorMessage = ''

let aqiDataArray = ["Particulate Matter","Particulate Matter","Sulphur Dioxide",'Carbon Monoxide','Nitrogen Dioxide','Ozone']
let aqiDataArrayshort = ['PM2.5','PM10','SO2','CO','NO2','O3']
let aqiRenderArray = ['pm2_5','pm10','so2','co','no2','o3']
function locationError(errorMsg){
    footerEl.style.position = 'absolute'
    footerEl.style.bottom = 0;
    footerEl.style.right= 0;
    footerEl.style.left = 0;
    weatherToday.style.display="none";
    mainContainer.style.display="none";
    aqiSection.style.display = 'none';
    if (errorDiv.children.length) {
        errorDiv.style.display = 'none';
    }
    if (locationErrorEl.children.length) {
        console.log('Location Error');
        locationErrorEl.style.display = 'flex';
    } else {
        locationErrorEl.style.display = 'flex';
        let locationErrorH2 = document.createElement("h2")
        locationErrorH2.textContent = 'Location Error';
        let errorEl = document.createElement("p");
        errorEl.textContent = `${errorMsg}`;
        locationErrorEl.appendChild(locationErrorH2)
        locationErrorEl.appendChild(errorEl);
    }

}
function errorFunction(){
    footerEl.style.position = 'absolute';
    footerEl.style.bottom = 0;
    footerEl.style.right= 0;
    footerEl.style.left = 0;
    weatherToday.style.display="none";
    mainContainer.style.display="none";
    aqiSection.style.display = 'none';
    if(errorDiv.children.length){
        console.log("try searching new location");
        errorDiv.style.display = "flex";
    }
    else{
        errorDiv.style.display = "flex";
        let errorEl1 = document.createElement("p")
        let errorEl2 = document.createElement("p")
        errorEl1.appendChild(document.createTextNode("Sorry! No Data Available"))
        errorEl2.appendChild(document.createTextNode(`Try searching different location`))
        errorDiv.appendChild(errorEl1)
        errorDiv.appendChild(errorEl2)
    }
};

fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature").then((res)=>{
    if(!res.ok){
        throw new Error("Failed to load Image");
    }
    return res.json()
}).then((data)=>{
    let imgUnsplash = document.createElement("img")
    imgUnsplash.setAttribute("src",`${data["urls"]["full"]}`)
    unsplashImgParent.appendChild(imgUnsplash)
    
}).catch((error)=>{
    imgUnsplash.setAttribute("src",'https://images.unsplash.com/photo-1483206048520-2321c1a5fb36?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDQ2MTkyMDh8&ixlib=rb-4.0.3&q=85')
    unsplashImgParent.appendChild(imgUnsplash)
});

navigator.geolocation.getCurrentPosition((position)=>{
    console.log(position);
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=2e6ca350b5bc4b49a14155929252005&q=${position.coords.latitude},${position.coords.longitude}&days=7&aqi=yes`)
    .then((res)=>{
        if(!res.ok){
            throw new Error("This location data is not available")
        }
        return res.json()
    }).then((data)=>{
        console.log(data);
        sunSectionEl.style.display = 'block';
        //For-Allocation
        footerEl.style.position = "static";
        weatherToday.style.display="flex";
        mainContainer.style.display="block";
        aqiSection.style.display = 'block';
        errorDiv.style.display='none';
        locationErrorEl.style.display = 'none';
        //for-AirQuality
        for(let i = 0 ; i<6;i++){
            let divAqiData = document.createElement("div");
            divAqiData.className = 'div-aqi-data';
            let aqiHeadingEl = document.createElement('p');
            aqiHeadingEl.appendChild(document.createTextNode(`${aqiDataArray[i]}`));
            let aqiTextEl = document.createElement("p")
            aqiTextEl.appendChild(document.createTextNode(`(${aqiDataArrayshort[i]})`))
            let aqiPaData = document.createElement("p")
            let aqiValueData = data['current']['air_quality'][aqiRenderArray[i]]
            if(aqiDataArrayshort[i]==='PM10' || aqiDataArrayshort[i]==='PM2.5'){
                if(aqiValueData>=100){
                    divAqiData.style.backgroundColor = '#ee7777';
                }
                else if(aqiValueData>50){
                    divAqiData.style.backgroundColor = '#dc7a8a';
                }
                
                aqiPaData.appendChild(document.createTextNode(`${aqiValueData} u/m³`))
            }
            else{
                aqiPaData.appendChild(document.createTextNode(`${aqiValueData} ppb`))
                
                
            }
            divAqiData.appendChild(aqiHeadingEl)
            divAqiData.appendChild(aqiTextEl);
            divAqiData.appendChild(aqiPaData)
            airQualityEl.appendChild(divAqiData)

        }
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
        let todayFeelTemp = data["current"]["feelslike_c"]
        let spanTodayEl = document.createElement('span')
        spanTodayEl.className = 'span-today-el';
        if(todayFeelTemp>=35){
            spanTodayEl.innerHTML = `<i class="fa-solid fa-temperature-high"></i>`
        }
        else if(todayFeelTemp>15 && todayFeelTemp<35){
            spanTodayEl.innerHTML = `<i class="fa-solid fa-temperature-three-quarters"></i>`
        }
        else if(todayFeelTemp>0 && todayFeelTemp<15){
            spanTodayEl.innerHTML = `<i class="fa-solid fa-temperature-quarter"></i>`
        }
        else{
            spanTodayEl.innerHTML = `<i class="fa-solid fa-temperature-low"></i>`
        }
        let weatherTodayEl = document.createElement("p");
        weatherTodayEl.className = "weather-today-p";
        let tempRangeData = Math.floor(todayFeelTemp);
        weatherTodayEl.appendChild(document.createTextNode(`Feels like : ${tempRangeData}°C`));
        todayEl.appendChild(spanTodayEl);
        todayEl.appendChild(weatherTodayEl);
        //location-name
        locationNameEl.textContent = `${data['location']['name']} , ${data['location']['country']}`
        //container
        //wind-data

        let windDataKm = document.createElement("p")
        windDataKm.className = "today-wind-speed"
        let windDirection = document.createElement("p")
        windDataKm.appendChild(document.createTextNode(`${data["current"]["wind_kph"]} km/hr`))
        windDirection.innerHTML = `<i class="fa-regular fa-compass"></i> ${data["current"]["wind_dir"]}`
        windDataKm.appendChild(windDirection)
        windParentEl.appendChild(windDataKm)
        //pressure-data
        let pressureEl = document.createElement('p')
        pressureEl.appendChild(document.createTextNode(`${data['current']['pressure_mb']} hPa`))
        let pressureTextEl = document.createElement('p')
        pressureTextEl.appendChild(document.createTextNode('Normal 🤘'))
        pressureParentEl.appendChild(pressureEl);
        pressureParentEl.appendChild(pressureTextEl);
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
        let visibiltyRangeEl = document.createElement("p");
        let visibilityData = data["current"]["vis_km"];
        visibiltyRangeEl.appendChild(document.createTextNode(`${visibilityData} km`))
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
        let rainTodayData = data["current"]["precip_mm"]
        rainDataEl.appendChild(document.createTextNode(`${rainTodayData} mm`))
        let rainTextEl = document.createElement('p');
        let todayPpDate = new Date()
        rainTextEl.appendChild(document.createTextNode(`${data['forecast']['forecastday'][0]['hour'][todayPpDate.getHours()]['condition']['text']}`))
        rainParentEl.appendChild(rainDataEl);
        rainParentEl.appendChild(rainTextEl);

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
        uvIndexParentEl.appendChild(uvDataEl);
        uvIndexParentEl.appendChild(uvRangeEl);
        //sunrise-sunset
        let sunriseTiming = data['forecast']['forecastday'][0]['astro']['sunrise']
        let sunsetTiming = data['forecast']['forecastday'][0]['astro']['sunset']
        console.log(sunriseTiming,sunsetTiming);
        //sun-moon
        let moonIcon = document.querySelector("#moon-fa-moon");
        let sunIcon = document.querySelector("#sun-fa-sun");
        let dateT = new Date()
        let sunriseT = false;
        dateTime = dateT.toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });
        let sunStripWidth = sunStripEl.getBoundingClientRect().width
        console.log(Math.floor(sunStripWidth));
        // Function to check if current time is before sunrise
        function checkTimeAndExecute(sunriseTime) {
            // Get current time
            let currentTime = new Date();
            let currentFormattedTime = formatTime(currentTime);

            console.log("Current time: " + currentFormattedTime);
            console.log("Sunrise time: " + sunriseTime);

            // Convert the sunrise time (e.g., '6:30 AM') to a comparable time in minutes
            let sunriseMinutes = convertToMinutes(sunriseTime, currentTime);
            let currentMinutes = convertToMinutes(currentFormattedTime, currentTime);

            // Compare current time with sunrise time (in minutes)
            if (currentMinutes < sunriseMinutes) {
                sunriseT = false;
            } else {
                sunriseT = true;
                console.log("Current time is later than sunrise. No task executed.");
            }
        }

        // Function to format time from Date object to 'HH:mm' format (e.g., '06:30')
        function formatTime(date) {
            let hours = date.getHours();
            let minutes = date.getMinutes();
            return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
        }

        // Function to convert time from '6:30 AM' or '6:30 PM' format to minutes since midnight
        function convertToMinutes(time, currentTime) {
            let [timePart, period] = time.split(' ');  // Split the time part from AM/PM
            let [hours, minutes] = timePart.split(':').map(num => parseInt(num));

            // Convert 12-hour format to 24-hour format based on AM/PM
            if (period === 'PM' && hours !== 12) {
                hours += 12;  // Convert PM hours to 24-hour format
            } else if (period === 'AM' && hours === 12) {
                hours = 0;  // Convert 12 AM to 00:00 (midnight)
            }

            // If the current time is after midnight and before sunrise, consider sunrise as the next day
            let sunriseDate = new Date(currentTime);
            sunriseDate.setHours(hours);
            sunriseDate.setMinutes(minutes);
            sunriseDate.setSeconds(0);

            // If current time is after midnight and the sunrise time is earlier, adjust the sunrise to the next day
            if (currentTime.getHours() < hours || (currentTime.getHours() === hours && currentTime.getMinutes() < minutes)) {
                sunriseDate.setDate(sunriseDate.getDate() + 1);  // Move sunrise to the next day
            }

            return sunriseDate.getHours() * 60 + sunriseDate.getMinutes();  // Convert the time to total minutes since midnight
        }
        checkTimeAndExecute(sunriseTiming);
        function toMinutes(timeStr) {
            let [time, period] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);

            if (period === 'PM' && hours !== 12) {
                hours += 12;
            } else if (period === 'AM' && hours === 12) {
                hours = 0;
            }
            return hours * 60 + minutes;
        }
        function subtractTimes(startStr, endStr) {
            let startMin = toMinutes(startStr);
            let endMin = toMinutes(endStr);
            if (endMin < startMin) {
                endMin += 24 * 60;
            }
            let diff = endMin - startMin;
            // let hours = Math.floor(diff / 60);
            // let minutes = diff % 60;
            return(diff/60)
        }
        let nDay = subtractTimes(sunriseTiming,sunsetTiming);
        let nNight = subtractTimes(sunsetTiming,sunriseTiming)
        let sunsetWidth = subtractTimes(sunsetTiming,dateTime);
        let sunriseWidth = subtractTimes(sunriseTiming,dateTime);
        console.log(nDay,nNight,sunStripWidth,sunriseWidth,sunsetWidth);
        
        


        if(sunriseT){
            sunSectionEl.style.backgroundColor = '#113131';
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
            moonIcon.style.color = "#FFF";
            sunStripEl.style.backgroundColor = '#fd91f0';
            sunSectionEl.style.color = '#fff';
            sunTimingEl.style.flexDirection = 'row-reverse';
            let leftNightPosition = (sunStripWidth/nNight)*sunsetWidth + 8;
            console.log(leftNightPosition);
            moonIcon.style.left = `${leftNightPosition}px`;
        }
        else{
            sunSectionEl.style.backgroundColor = '#fff';
            sunSectionEl.style.color = '#000';
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
            sunStripEl.style.backgroundColor = '#f8f85c';
            sunSectionEl.style.color = '#000';
            sunTimingEl.style.flexDirection = 'row';
            let leftDayPosition = (sunStripWidth/nDay)*sunriseWidth + 4;
            sunIcon.style.left = `${leftDayPosition}px`;
        }
        let sunriseDivEl = document.createElement("div")
        let sunsetDivEl = document.createElement('div')
        let sunriseEl = document.createElement('p')
        sunriseEl.appendChild(document.createTextNode(`Sunrise : ${sunriseTiming}`))
        let sunriseImgEl = document.createElement('img')
        sunriseImgEl.setAttribute('src','sunrise-org.png')
        let sunsetEl = document.createElement('p')
        sunsetEl.appendChild(document.createTextNode(`Sunset : ${sunsetTiming}`))
        let sunsetImgEl = document.createElement('img');
        sunsetImgEl.setAttribute('src','sunset-org.png')
        sunriseDivEl.appendChild(sunriseEl)
        sunriseDivEl.appendChild(sunriseImgEl)
        sunsetDivEl.appendChild(sunsetEl)
        sunsetDivEl.appendChild(sunsetImgEl)
        sunTimingEl.appendChild(sunriseDivEl)
        sunTimingEl.appendChild(sunsetDivEl)
        
        //weekly-data
        data['forecast']['forecastday'].forEach((dataQ)=> {
            console.log(dataQ);
            count += 1;
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
            weeklyDivEl.appendChild(weekDayEl)
            weeklyDivEl.appendChild(weeklyImgEl)
            weeklyDivEl.appendChild(weekTempEl)
            weeklyDataEl.appendChild(weeklyDivEl)
        });
        weekDayH2.textContent = `${count}-Days Weather`;
    }).catch((error)=>{
        errorFunction();
    })
},
  (error) => {
    if (error.code === error.PERMISSION_DENIED) {
        alert("Location access is needed for weather info. Please enable location.");
        locationErrorMessage = 'Location access is needed for weather info. Please enable location';
        locationError(locationErrorMessage);
    } else if (error.code === error.POSITION_UNAVAILABLE) {
        alert("Location is unavailable. Please turn on your device's location services.");
        locationErrorMessage = "Location is unavailable. Please turn on your device's location services";
        locationError(locationErrorMessage);
    } else {
        alert("An error occurred: " + error.message);
        locationErrorMessage = `An error Occured: ${error.message}`;
        locationError(locationErrorMessage);
    }
  }
)

//function-render
function renderData(locationName){
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=c44d33c70e474799992132141250505&q=${locationName}&days=7&aqi=yes`)
    .then((res)=>{
        if(!res.ok){
            throw new Error("This Location Data not available")
        }
        return res.json();
    }).then((data)=>{
        console.log(data);
        //weather-data
        footerEl.style.position = "static";
        weatherToday.style.display="flex";
        mainContainer.style.display="block";
        aqiSection.style.display = 'block';
        //error
        errorDiv.style.display='none';
        locationErrorEl.style.display = 'none';
        //for-aqi-data
        for(let i = 0 ; i<6;i++){
            let divAqiData = document.createElement("div");
            divAqiData.className = 'div-aqi-data';
            let aqiHeadingEl = document.createElement('p');
            aqiHeadingEl.appendChild(document.createTextNode(`${aqiDataArray[i]}`));
            let aqiTextEl = document.createElement("p");
            aqiTextEl.appendChild(document.createTextNode(`(${aqiDataArrayshort[i]})`));
            let aqiPaData = document.createElement("p");
            let aqiValueData = data['current']['air_quality'][aqiRenderArray[i]];
            if(aqiDataArrayshort[i]==='PM10' || aqiDataArrayshort[i]==='PM2.5'){
                if(aqiValueData>=100){
                    divAqiData.style.backgroundColor = '#ee7777';
                }
                else if(aqiValueData>50){
                    divAqiData.style.backgroundColor = '#dc7a8a';
                }
                
                aqiPaData.appendChild(document.createTextNode(`${aqiValueData} u/m³`))
            }
            else{
                aqiPaData.appendChild(document.createTextNode(`${aqiValueData} ppb`))
            }
            divAqiData.appendChild(aqiHeadingEl)
            divAqiData.appendChild(aqiTextEl);
            divAqiData.appendChild(aqiPaData);
            airQualityEl.appendChild(divAqiData);
        }
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
        let todayFeelTemp = data["current"]["feelslike_c"]
        let spanTodayEl = document.createElement('span')
        spanTodayEl.className = 'span-today-el';
        if(todayFeelTemp>=35){
            spanTodayEl.innerHTML = `<i class="fa-solid fa-temperature-high"></i>`
        }
        else if(todayFeelTemp>15 && todayFeelTemp<35){
            spanTodayEl.innerHTML = `<i class="fa-solid fa-temperature-three-quarters"></i>`
        }
        else if(todayFeelTemp>0 && todayFeelTemp<15){
            spanTodayEl.innerHTML = `<i class="fa-solid fa-temperature-quarter"></i>`
        }
        else{
            spanTodayEl.innerHTML = `<i class="fa-solid fa-temperature-low"></i>`
        }
        let weatherTodayEl = document.createElement("p");
        weatherTodayEl.className = "weather-today-p";
        let tempRangeData = Math.floor(todayFeelTemp);
        weatherTodayEl.appendChild(document.createTextNode(`Feels like : ${tempRangeData}°C`));
        todayEl.appendChild(spanTodayEl);
        todayEl.appendChild(weatherTodayEl);
        //location-el
        locationNameEl.textContent = `${data['location']['name']} , ${data['location']['country']}`
        //Container
        //wind-data
        let headingWind = document.createElement("p");
        headingWind.className = "highlights-heading"
        headingWind.innerHTML = `<i class="fa-solid fa-wind"></i> Wind Status`;
        let windDataKm = document.createElement("p");
        windDataKm.className = "today-wind-speed";
        let windDirection = document.createElement("p");
        windDataKm.appendChild(document.createTextNode(`${data["current"]["wind_kph"]} km/hr`));
        windDirection.innerHTML = `<i class="fa-regular fa-compass"></i> ${data["current"]["wind_dir"]}`;
        windParentEl.appendChild(headingWind)
        windDataKm.appendChild(windDirection)
        windParentEl.appendChild(windDataKm)
       
        //pressure-data
        let headingPressure = document.createElement("p")
        headingPressure.className = "highlights-heading"
        headingPressure.innerHTML = `<i class="fa-regular fa-face-smile"></i> Air Pressure`
        let pressureEl = document.createElement('p')
        pressureEl.appendChild(document.createTextNode(`${data['current']['pressure_mb']} hPa`))
        let pressureTextEl = document.createElement('p')
        pressureTextEl.appendChild(document.createTextNode('Normal 🤘'))
        pressureParentEl.appendChild(headingPressure);
        pressureParentEl.appendChild(pressureEl);
        pressureParentEl.appendChild(pressureTextEl);

        
        //humidity-data
        let headingHumidity = document.createElement("p");
        headingHumidity.className = "highlights-heading";
        headingHumidity.innerHTML = `<i class="fa-solid fa-droplet"></i> Humidity`
        let humidityData = data["current"]["humidity"];
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
        visibiltyRangeEl.appendChild(document.createTextNode(`${visibilityData} km`))
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
        headingRain.innerHTML = `<p><i class="fa-solid fa-snowflake"></i> Precipitation</p>`
        let rainDataEl = document.createElement("p")
        let rainTodayData = data["current"]["precip_mm"]
        rainDataEl.appendChild(document.createTextNode(`${rainTodayData} mm`))
        let rainTextEl = document.createElement('p');
        let todayPpDate = new Date()
        rainTextEl.appendChild(document.createTextNode(`${data['forecast']['forecastday'][0]['hour'][todayPpDate.getHours()]['condition']['text']}`))
        rainParentEl.appendChild(headingRain)
        rainParentEl.appendChild(rainDataEl)
        rainParentEl.appendChild(rainTextEl);    

        //uv-data
        let uvData = data["current"]["uv"]
        let headingUvI = document.createElement("p")
        headingUvI.className = "highlights-heading"
        if(uvData>0){
            headingUvI.innerHTML = `<i class="fa-solid fa-sun"></i> Uv Index`
        }
        else{
            headingUvI.innerHTML = `<i class="fa-regular fa-moon"></i> Uv Index`
        }
        let uvDataEl = document.createElement("p")
        let uvRangeEl = document.createElement("p")
        
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
        count = 0
        //weekly-data
        data['forecast']['forecastday'].forEach((dataQ)=> {
            console.log(dataQ);
            //parent-div
            let weeklyDivEl = document.createElement("div");
            count += 1;
            //p-element
            let weekDayEl = document.createElement("p");
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
        weekDayH2.textContent = `${count}-Days Weather`;
    }).catch((err)=>{
        errorFunction();
        console.error(err);

    })

}

//btn-click
searchBtn.addEventListener("click",()=>{
    let locationName = inputSearch.value;
    if(locationName){
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
        if(pressureParentEl.children.length){
            while(pressureParentEl.firstChild){
                pressureParentEl.removeChild(pressureParentEl.firstChild)
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
        sunSectionEl.style.display = 'none';
        inputSearch.value='';
        airQualityEl.replaceChildren();
        //render-function
        renderData(locationName)
    }
})

