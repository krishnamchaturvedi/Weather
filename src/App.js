/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
import './style.css';
import { storeWeatherData, getAllWeatherData } from './indexedDB';

const weatherApi = {
  key: '9f23b56e8dcad8299bf4e5a2a3fc932b',
  baseUrl: 'https://api.openweathermap.org/data/2.5/weather',
};


document.addEventListener('DOMContentLoaded', () => {
  let searchInputBox = document.getElementById('input-box');
  searchInputBox.addEventListener('keypress', (event) => {
    if (event.keyCode === 13) {
      getWeatherReport($searchInputBox.value);
      setTimeout(() => {
        displayNotification(`New Weather Data Available for `, {
          body: `Weather data for ${searchInputBox} is ready!`,
          icon: 'C:/Users/Admin/Downloads/38-385668_push-notifications-push-notification-icon-png.png',
          badge: 'C:/Users/Admin/Downloads/notification weather.png',
        });
      }, 60000);
    }
  });
});

// Function to display a notification
function displayNotification(title, options) {
  if ('Notification' in window && Notification.permission === 'granted') {
    return navigator.serviceWorker.ready.then(function(registration) {
      return registration.showNotification(title, options);
    });
  }
}

function getWeatherReport(city) {
  fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
    .then((weather) => weather.json())
    .then(showWeatherReport)
    .catch((error) => {
      console.error('Error fetching weather data:', error);
      swal('Error', 'Failed to fetch weather data. Please try again.', 'error');
    });
}

async function showWeatherReport(weather) {
  let city_code = weather.cod;
  if (city_code === '400') {
    swal('Empty Input', 'Please enter any city', 'error');
    reset();
  } else if (city_code === '404') {
    swal('Bad Input', "Entered city didn't match", 'warning');
    reset();
  } else {
    console.log(weather.cod);
    console.log(weather);
    let op = document.getElementById('weather-body');
    op.style.display = 'block';
    let todayDate = new Date();
    let parent = document.getElementById('parent');
    let weather_body = document.getElementById('weather-body');
    weather_body.innerHTML = `
    <div class="location-deatils">
        <div class="city" id="city">${weather.name}, ${weather.sys.country}</div>
        <div class="date" id="date"> ${dateManage(todayDate)}</div>
    </div>
    <div class="weather-status">
        <div class="temp" id="temp">${Math.round(weather.main.temp)}&deg;C </div>
        <div class="weather" id="weather"> ${weather.weather[0].main} <i class="${getIconClass(
      weather.weather[0].main
    )}"></i>  </div>
        <div class="min-max" id="min-max">${Math.floor(weather.main.temp_min)}&deg;C (min) / ${Math.ceil(
      weather.main.temp_max
    )}&deg;C (max) </div>
        <div id="updated_on">Updated as of ${getTime(todayDate)}</div>
    </div>
    <hr>
    <div class="day-details">
        <div class="basic">Feels like ${weather.main.feels_like}&deg;C | Humidity ${
      weather.main.humidity
    }%  <br> Pressure ${weather.main.pressure} mb | Wind ${weather.wind.speed} KMPH</div>
    </div>
    `;
    parent.append(weather_body);
    changeBb(weather.weather[0].main);
    reset();

    const allWeatherData = await getAllWeatherData();
    const existingData = allWeatherData.find((data) => data.city === weather.name);
    if (existingData) {
      const lastUpdateTimestamp = existingData.timestamp;
      const newTimestamp = Math.floor(new Date().getTime() / 1000);
      if (newTimestamp > lastUpdateTimestamp) {
        showUpdateNotification(existingData, weather);
      }
    }

    storeWeatherData(weather)
      .then(() => {
        console.log('Weather data stored in IndexedDB');
      })
      .catch((error) => {
        console.error('Error storing weather data:', error);
      });
  }
}



function getTime(todayDate) {
  let hour = addZero(todayDate.getHours());
  let minute = addZero(todayDate.getMinutes());
  return `${hour}:${minute}`;
}

function dateManage(dateArg) {
  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  let months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  let year = dateArg.getFullYear();
  let month = months[dateArg.getMonth()];
  let date = dateArg.getDate();
  let day = days[dateArg.getDay()];
  return `${date} ${month} (${day}), ${year}`;
}

function changeBb(status) {
  console.log('Changing background with status:', status);
  document.body.className = ''; // Clear existing classes
  document.body.classList.add(status); // Add class based on weather status
}

  function getIconClass(classarg) {
    if (classarg === 'Rain') {
        return 'fas fa-cloud-showers-heavy';
    } else if (classarg === 'Clouds') {
        return 'fas fa-cloud';
    } else if (classarg === 'Clear') {
        return 'fas fa-cloud-sun';
    } else if (classarg === 'Snow') {
        return 'fas fa-snowman';
    } else if (classarg === 'Sunny') {
        return 'fas fa-sun';
    } else if (classarg === 'Mist') {
        return 'fas fa-smog';
    } else if (classarg === 'Thunderstorm' || classarg === 'Drizzle') {
        return 'fas fa-thunderstorm';
    } else {
        return 'fas fa-cloud-sun';
    }
}


function reset() {
  let input = document.getElementById('input-box');
  input.value = '';
}

function addZero(i) {
  if (i < 10) {
    i = '0' + i;
  }
  return i;
}

export default App;
