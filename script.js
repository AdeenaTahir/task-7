
const API_KEY = '155d4b483cbcdbf2ddcc4400a011a34c';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const errorMsg = document.getElementById('errorMsg');
const loader = document.getElementById('loader');
const weatherDisplay = document.getElementById('weatherDisplay');

searchBtn.addEventListener('click', getWeather);

cityInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});

function getWeather() {
    const city = cityInput.value.trim();  
    
    if (city === '') {
        showError('Please enter a city name');
        return;
    }
    
    if (API_KEY === 'YOUR_API_KEY_HERE' || API_KEY === '') {
        showError('⚠️ API Key missing! Please follow these steps:\n\n1. Go to https://openweathermap.org/api\n2. Sign up (FREE)\n3. Get your API key\n4. Open script.js file\n5. Replace YOUR_API_KEY_HERE with your actual key');
        return;
    }
    
    showLoader();
   
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
            
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            hideLoader();
            displayWeather(data);
        })
        .catch(error => {
            hideLoader();
            
            if (error.message === 'City not found') {
                showError('City not found. Please check spelling and try again.');
            } else {
                showError('Error loading weather. Please check your API key.');
            }
            console.error('Error:', error);
        });
}

function displayWeather(data) {
  
    errorMsg.style.display = 'none';
 
    weatherDisplay.style.display = 'block';
    
    document.getElementById('cityName').textContent = data.name + ', ' + data.sys.country;
    
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = today.toLocaleDateString('en-US', options);
    
    const iconCode = data.weather[0].icon;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    document.getElementById('temperature').textContent = Math.round(data.main.temp) + '°C';
    
    document.getElementById('weatherDesc').textContent = data.weather[0].description;
    
    document.getElementById('humidity').textContent = data.main.humidity + '%';
    
    document.getElementById('windSpeed').textContent = data.wind.speed + ' m/s';
    
    document.getElementById('feelsLike').textContent = Math.round(data.main.feels_like) + '°C';
    
    document.getElementById('pressure').textContent = data.main.pressure + ' hPa';
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    weatherDisplay.style.display = 'none';
}

function showLoader() {
    loader.style.display = 'block';
    weatherDisplay.style.display = 'none';
    errorMsg.style.display = 'none';
}

function hideLoader() {
    loader.style.display = 'none';
}