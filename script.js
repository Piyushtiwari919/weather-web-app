// Refactored script.js
// Preserves original constant names (DO NOT rename these) and improves structure, error handling, and scalability.

(async function () {
  'use strict';

  // --- DOM references (kept original names) ---
  const weatherToday = document.querySelector('.weather-today');
  const weatherData = document.querySelector('.weather-data');
  const todayEl = document.querySelector('.today-el');
  const mainContainer = document.querySelector('.container');
  const weeklyDataEl = document.querySelector('.weekly-data');
  const todayHighlights = document.querySelector('today-highlights');
  const unsplashImgParent = document.querySelector('.img-unsplash');
  const inputSearch = document.querySelector('.input-search');
  const searchResults = document.querySelector('.search-results');
  const searchBtn = document.querySelector('.weather-search-btn');
  const todayDataH2 = document.querySelector('.today-weather-h2');
  const windParentEl = document.querySelector('.today-wind');
  const pressureParentEl = document.querySelector('.pressure-data');
  const humidityParentEl = document.querySelector('.today-humidity');
  const visibilityParentEl = document.querySelector('.today-visibility');
  const locationNameEl = document.querySelector('.location-name');
  let weekDayH2 = document.querySelector('.week-info');
  let count = 0;
  let citiesNames;
  const rainParentEl = document.querySelector('.today-rain');
  const uvIndexParentEl = document.querySelector('.today-uv-index');
  const airQualityEl = document.querySelector('.air-quality-data');
  const aqiSection = document.querySelector('.aqi-data-section');
  let errorDiv = document.querySelector('.error-div-parent');
  let locationErrorEl = document.querySelector('.location-error-parent');
  const footerEl = document.querySelector('footer');

  // Keep AQI labels constant names used in original app
  const aqiDataArray = ['Particulate Matter', 'Particulate Matter', 'Sulphur Dioxide', 'Carbon Monoxide', 'Nitrogen Dioxide', 'Ozone'];
  const aqiDataArrayshort = ['PM2.5', 'PM10', 'SO2', 'CO', 'NO2', 'O3'];
  const aqiRenderArray = ['pm2_5', 'pm10', 'so2', 'co', 'no2', 'o3'];

  // --- Config ---
  const WEATHER_API_KEY = '2e6ca350b5bc4b49a14155929252005';
  const WEATHER_BASE = 'https://api.weatherapi.com/v1/forecast.json';
  const UNSPLASH_ENDPOINT = 'https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature';

  // Request identity to ignore stale responses when multiple requests happen
  let latestRequestId = 0;

  // --- Utilities ---
  function setFooterStatic() {
    footerEl.style.position = 'static';
  }
  function setFooterAbsoluteBottom() {
    footerEl.style.position = 'absolute';
    footerEl.style.bottom = 0;
    footerEl.style.right = 0;
    footerEl.style.left = 0;
  }

  function clearChildren(el) {
    if (!el) return;
    // modern API
    el.replaceChildren();
  }

  function createText(tag, text) {
    const p = document.createElement(tag || 'p');
    p.appendChild(document.createTextNode(String(text)));
    return p;
  }

  function createIconHTML(html) {
    const span = document.createElement('span');
    span.innerHTML = html;
    return span;
  }

  function showLocationError(message) {
    setFooterAbsoluteBottom();
    weatherToday.style.display = 'none';
    mainContainer.style.display = 'none';
    aqiSection.style.display = 'none';
    errorDiv.style.display = 'none';

    locationErrorEl.style.display = 'flex';
    clearChildren(locationErrorEl);
    const h2 = document.createElement('h2');
    h2.textContent = 'Location Error';
    const p = document.createElement('p');
    p.textContent = message || "We couldn't access your location. Make sure location services are turned ON in your device settings, then reload the page.";
    locationErrorEl.appendChild(h2);
    locationErrorEl.appendChild(p);
  }

  function showGenericError(message) {
    setFooterAbsoluteBottom();
    weatherToday.style.display = 'none';
    mainContainer.style.display = 'none';
    aqiSection.style.display = 'none';

    locationErrorEl.style.display = 'none';
    errorDiv.style.display = 'flex';
    clearChildren(errorDiv);
    errorDiv.appendChild(createText('p', message || 'Sorry! No Data Available'));
    errorDiv.appendChild(createText('p', 'Try searching a different location'));
  }

  function toTitleCase(s) {
    return s.replace(/(^|\s)\S/g, (t) => t.toUpperCase());
  }

  // --- Unsplash image (with fallback) ---
  async function loadUnsplash() {
    try {
      const res = await fetch(UNSPLASH_ENDPOINT);
      if (!res.ok) throw new Error('Failed to load image');
      const data = await res.json();
      const img = document.createElement('img');
      img.src = data.urls.full;
      img.alt = data.alt_description || 'background image';
      clearChildren(unsplashImgParent);
      unsplashImgParent.appendChild(img);
    } catch (err) {
      // fallback static image
      const img = document.createElement('img');
      img.src = 'https://images.unsplash.com/photo-1483206048520-2321c1a5fb36?crop=entropy&cs=srgb&fm=jpg&q=85';
      img.alt = 'fallback image';
      clearChildren(unsplashImgParent);
      unsplashImgParent.appendChild(img);
    }
  }

  // --- Geolocation wrapper that returns a promise ---
  function getCurrentPositionAsync(options = {}) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  }

  // --- Fetch weather with request id check ---
  async function fetchWeather(locationQuery, requestId) {
    const url = `${WEATHER_BASE}?key=${WEATHER_API_KEY}&q=${encodeURIComponent(locationQuery)}&days=7&aqi=yes`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('This location data is not available');
    const data = await res.json();
    // if this request is not latest, ignore result
    if (requestId !== latestRequestId) throw new Error('stale-response');
    return data;
  }

  // --- Cities list (fetch once per country) ---
  const citiesCache = new Map();
  async function fetchCitiesForCountry(country) {
    if (!country) return [];
    if (citiesCache.has(country)) return citiesCache.get(country);
    try {
      const res = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country }),
      });
      if (!res.ok) throw new Error('Failed to load cities');
      const payload = await res.json();
      const arr = payload.data || [];
      citiesCache.set(country, arr);
      return arr;
    } catch (err) {
      console.error('fetchCitiesForCountry error:', err.message);
      citiesCache.set(country, []);
      return [];
    }
  }

  // --- Render helpers ---
  function renderAQI(current) {
    clearChildren(airQualityEl);
    for (let i = 0; i < aqiRenderArray.length; i++) {
      const div = document.createElement('div');
      div.className = 'div-aqi-data';
      const heading = createText('p', aqiDataArray[i]);
      const short = createText('p', `(${aqiDataArrayshort[i]})`);
      const valueEl = createText('p', '');
      const val = current.air_quality[aqiRenderArray[i]];
      if (['PM10', 'PM2.5'].includes(aqiDataArrayshort[i])) {
        if (val >= 100) div.style.backgroundColor = '#ee7777';
        else if (val > 50) div.style.backgroundColor = '#dc7a8a';
        valueEl.textContent = `${val} u/m³`;
      } else {
        valueEl.textContent = `${val} ppb`;
      }
      div.appendChild(heading);
      div.appendChild(short);
      div.appendChild(valueEl);
      airQualityEl.appendChild(div);
    }
  }

  function renderWeatherData(current) {
    clearChildren(weatherData);

    const imgWrap = document.createElement('div');
    imgWrap.className = 'img-data';
    const img = document.createElement('img');
    img.src = current.condition.icon;
    img.alt = current.condition.text || 'weather icon';
    imgWrap.appendChild(img);

    const temp = createText('p', `${Math.floor(current.temp_c)}°C`);
    temp.className = 'temp-data';

    const dateEl = createText('p', new Date().toLocaleDateString('en-us', { weekday: 'long', month: 'long', day: 'numeric' }));
    dateEl.className = 'today-date';

    weatherData.appendChild(imgWrap);
    weatherData.appendChild(temp);
    weatherData.appendChild(dateEl);
  }

  function renderTodayHighlights(current) {
    clearChildren(todayEl);

    const feel = Math.floor(current.feelslike_c);
    const iconSpan = document.createElement('span');
    iconSpan.className = 'span-today-el';
    if (feel >= 35) iconSpan.innerHTML = '<i class="fa-solid fa-temperature-high"></i>';
    else if (feel > 15) iconSpan.innerHTML = '<i class="fa-solid fa-temperature-three-quarters"></i>';
    else if (feel > 0) iconSpan.innerHTML = '<i class="fa-solid fa-temperature-quarter"></i>';
    else iconSpan.innerHTML = '<i class="fa-solid fa-temperature-low"></i>';

    const p = createText('p', `Feels like : ${feel}°C`);
    p.className = 'weather-today-p';

    todayEl.appendChild(iconSpan);
    todayEl.appendChild(p);
  }

  function renderHighlightsSection(data) {
    // wind
    clearChildren(windParentEl);
    const headingWind = createIconHTML('<p class="highlights-heading"><i class="fa-solid fa-wind"></i> Wind Status</p>');
    const windDataKm = createText('p', `${data.current.wind_kph} km/hr`);
    windDataKm.className = 'today-wind-speed';
    const windDir = createIconHTML(`<p><i class="fa-regular fa-compass"></i> ${data.current.wind_dir}</p>`);
    windDataKm.appendChild(windDir);
    windParentEl.appendChild(headingWind);
    windParentEl.appendChild(windDataKm);

    // pressure
    clearChildren(pressureParentEl);
    pressureParentEl.appendChild(createIconHTML('<p class="highlights-heading"><i class="fa-regular fa-face-smile"></i> Air Pressure</p>'));
    pressureParentEl.appendChild(createText('p', `${data.current.pressure_mb} hPa`));
    pressureParentEl.appendChild(createText('p', `Normal 🤘`));

    // humidity
    clearChildren(humidityParentEl);
    humidityParentEl.appendChild(createIconHTML('<p class="highlights-heading"><i class="fa-solid fa-droplet"></i> Humidity</p>'));
    const humidity = data.current.humidity;
    humidityParentEl.appendChild(createText('p', `${humidity}%`));
    if (humidity >= 30 && humidity <= 50) humidityParentEl.appendChild(createText('p', 'Normal 🤙🏻'));
    else if (humidity > 50) humidityParentEl.appendChild(createText('p', 'High 🙄'));
    else humidityParentEl.appendChild(createText('p', 'Dry 😏'));

    // visibility
    clearChildren(visibilityParentEl);
    visibilityParentEl.appendChild(createIconHTML('<p class="highlights-heading"><i class="fa-solid fa-eye"></i> Visibility</p>'));
    const vis = data.current.vis_km;
    visibilityParentEl.appendChild(createText('p', `${vis} km`));
    if (vis >= 10) visibilityParentEl.appendChild(createText('p', 'Good 🙂'));
    else if (vis >= 5) visibilityParentEl.appendChild(createText('p', 'Moderate 😐'));
    else visibilityParentEl.appendChild(createText('p', 'Poor 🙁'));

    // rain
    clearChildren(rainParentEl);
    rainParentEl.appendChild(createIconHTML('<p class="highlights-heading"><i class="fa-solid fa-snowflake"></i> Precipitation</p>'));
    rainParentEl.appendChild(createText('p', `${data.current.precip_mm} mm`));
    const nowHour = new Date().getHours();
    const condText = data.forecast?.forecastday?.[0]?.hour?.[nowHour]?.condition?.text || '';
    rainParentEl.appendChild(createText('p', condText));

    // uv
    clearChildren(uvIndexParentEl);
    const uv = data.current.uv;
    uvIndexParentEl.appendChild(createIconHTML(`<p class="highlights-heading">${uv > 0 ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-regular fa-moon"></i>'} Uv Index</p>`));
    uvIndexParentEl.appendChild(createText('p', `${uv}`));
    if (0 <= uv && uv <= 2) uvIndexParentEl.appendChild(createText('p', 'Normal 🙂'));
    else if (uv <= 5) uvIndexParentEl.appendChild(createText('p', 'Moderate 😐'));
    else if (uv <= 7) uvIndexParentEl.appendChild(createText('p', 'High 🙁'));
    else if (uv <= 10) uvIndexParentEl.appendChild(createText('p', 'Very High ☹️'));
    else uvIndexParentEl.appendChild(createText('p', 'Extreme 🤕'));
  }

  function renderWeekly(forecastArr) {
    clearChildren(weeklyDataEl);
    let daysCount = 0;
    forecastArr.forEach((day) => {
      daysCount++;
      const weeklyDiv = document.createElement('div');
      const dayName = new Date(day.date).toLocaleDateString('en-us', { weekday: 'long' });
      weeklyDiv.appendChild(createText('p', dayName));
      const img = document.createElement('img');
      img.src = day.day.condition.icon;
      img.alt = day.day.condition.text || '';
      weeklyDiv.appendChild(img);
      weeklyDiv.appendChild(createText('p', `High:${Math.floor(day.day.maxtemp_c)}°C Low:${Math.floor(day.day.mintemp_c)}°C`));
      weeklyDataEl.appendChild(weeklyDiv);
    });
    weekDayH2.textContent = `${daysCount}-Days Weather`;
  }

  // --- Search UI (single setup, avoids duplication) ---
  function debounce(fn, wait = 250) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  function setupSearchHandlers() {
    // click outside to hide
    document.addEventListener('click', (event) => {
      const isClickInsideInput = event.target === inputSearch;
      const isClickInsideResults = searchResults.contains(event.target);
      if (!isClickInsideInput && !isClickInsideResults) {
        clearChildren(searchResults);
        searchResults.style.display = 'none';
      }
    });

    inputSearch.addEventListener(
      'input',
      debounce(async () => {
        const query = inputSearch.value.trim();
        if (!query) {
          clearChildren(searchResults);
          searchResults.style.display = 'none';
          return;
        }
        // If cities list not loaded, show empty
        if (!citiesNames || !citiesNames.length) {
          searchResults.style.display = 'none';
          return;
        }
        const filtered = citiesNames.filter((c) => c.toLowerCase().startsWith(query.toLowerCase()));
        clearChildren(searchResults);
        if (!filtered.length) {
          searchResults.style.display = 'none';
          return;
        }
        const max = Math.min(filtered.length, 10);
        for (let i = 0; i < max; i++) {
          const li = document.createElement('li');
          li.textContent = filtered[i];
          li.addEventListener('click', () => {
            inputSearch.value = filtered[i];
            clearChildren(searchResults);
            searchResults.style.display = 'none';
          });
          searchResults.appendChild(li);
        }
        searchResults.style.display = 'block';
      }, 200)
    );

    // allow Enter key for search
    inputSearch.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        searchBtn.click();
      }
    });

    // prevent accidental form submit (if any) by preventing default on click
    searchBtn.addEventListener('click', (ev) => {
      if (ev) ev.preventDefault && ev.preventDefault();
      const locationName = inputSearch.value.trim();
      if (!locationName) return;

      // Clear UI containers safely
      clearChildren(weatherData);
      clearChildren(todayEl);
      clearChildren(windParentEl);
      clearChildren(pressureParentEl);
      clearChildren(rainParentEl);
      clearChildren(humidityParentEl);
      clearChildren(visibilityParentEl);
      clearChildren(uvIndexParentEl);
      clearChildren(weeklyDataEl);
      clearChildren(airQualityEl);

      // reset input
      inputSearch.value = '';

      // trigger render
      renderData(locationName);
    });
  }

  // --- Main render data function (used for both geolocation and search) ---
  async function renderData(locationName) {
    const requestId = ++latestRequestId;
    try {
      const data = await fetchWeather(locationName, requestId);
      // success UI state
      setFooterStatic();
      weatherToday.style.display = 'flex';
      mainContainer.style.display = 'block';
      aqiSection.style.display = 'block';
      errorDiv.style.display = 'none';
      locationErrorEl.style.display = 'none';

      // fetch cities once for search auto-complete
      citiesNames = await fetchCitiesForCountry(data.location.country);

      // render sections
      renderAQI(data.current);
      renderWeatherData(data.current);
      renderTodayHighlights(data.current);
      locationNameEl.textContent = `${data.location.name} , ${data.location.country}`;
      renderHighlightsSection(data);
      renderWeekly(data.forecast.forecastday);
    } catch (err) {
      if (err.message === 'stale-response') return; // ignore stale
      console.error('renderData error:', err.message || err);
      showGenericError(err.message || 'Sorry! Something went wrong');
    }
  }

  // --- Initialization ---
  setupSearchHandlers();
  await loadUnsplash();

  // Try geolocation first (graceful fallbacks)
  try {
    const pos = await getCurrentPositionAsync({ enableHighAccuracy: false, timeout: 8000 });
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    // render weather using lat,lon
    await renderData(`${lat},${lon}`);
  } catch (err) {
    // show a friendly location-related UI instead of multiple alerts
    console.warn('Geolocation error:', err.message || err);
    if (err.code === 1 || (err.message && err.message.toLowerCase().includes('permission'))) {
      showLocationError('Location access is needed for weather info. Please enable location.');
    } else {
      // still allow user to search manually
      showGenericError('Unable to get device location. You can search places manually.')
      // Optionally do not hide the search box so user can search
      weatherToday.style.display = 'none';
      mainContainer.style.display = 'none';
      aqiSection.style.display = 'none';
    }
  }

  // expose renderData for manual testing (optional)
  window._renderData = renderData;
})();
