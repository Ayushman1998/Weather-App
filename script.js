// This won't work locally but needs a server because fetching json from same folder(line: 101)

const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const API_KEY = '4019ee63dde565c59a7476c5852595b8';
const KELVIN = 273.15;

const locateButton = document.getElementById("locate-button");
const searchButton = document.getElementById("search-button");
const temperatureValue = document.getElementById("temperatureValue");
const temp = document.querySelector(".temperature-value p");
const desc = document.querySelector(".temperature-description p");
const loc = document.querySelector(".location p");
const weatherIcon = document.querySelector(".weather-icon");
const notification = document.querySelector(".notification");

var input = document.getElementById('search');
var response;
var result;

let city = '';
let lat = 0.0;
let long = 0.0;

input.addEventListener("keyup" , function(event) {
    if(event.key === 'Enter'){
        event.preventDefault(1);
        city = input.value;
        if(city)
        {
            // console.log(city);
            getCityWeather(city);
        }
    }
})

searchButton.addEventListener("click" , function(){
    city = input.value;
    if(city)
    {
        // console.log(city);
        getCityWeather(city);
    }
})

locateButton.addEventListener("click" , function(){
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(success,showerror);
    }
    else{
        notification.style.display = 'block';
        notification.innerHTML = '<p>Browser does not support geolocation</p>'
    }

    function success(position){
        lat = position.coords.latitude;
        long = position.coords.longitude;

        // console.log(lat ,"------", long);

        getLocateWeather(lat,long);
    }

    function showerror(error){
        notification.style.display = 'block';
        notification.innerHTML = `<p>${error}</p>`
    }

});

async function getCityWeather(city){
    input.value = '';

    response = await fetch(`${BASE_URL}weather?q=${city}&appid=${API_KEY}`);
    result = await response.json();
    renderCard(result);
}

async function getLocateWeather(lat,long){
    response = await fetch(`${BASE_URL}weather?lat=${lat}&lon=${long}&appid=${API_KEY}`);
    result = await response.json();
    renderCard(result);
}

async function renderCard(res){

    let iconLocation = async() => {
        let abc = await getWeatherIcon(result.weather[0].id);
        weatherIcon.innerHTML = `<img src = "${abc}" alt="Weather Icon"/>`
    }

    iconLocation();    

    temp.innerHTML = `${(result.main.temp-KELVIN).toFixed(2)}<span>&#176;C</span>`;

    temperatureValue.addEventListener('click' , () => {
        if(temperatureValue.children[0].children[0].textContent.includes('C')){
            temp.innerHTML = `${(((result.main.temp-KELVIN)*(9/5))+32).toFixed(2)}<span>&#176;F</span>`;
        }else{
            temp.innerHTML = `${(result.main.temp-KELVIN).toFixed(2)}<span>&#176;C</span>`;
        }
    })

    desc.innerHTML = `${result.weather[0].description}`;
    desc.style.textTransform = "capitalize";

    loc.innerHTML = `${result.name},${result.sys.country}`
}

async function getWeatherIcon(code){

    weatherIconResponse = await fetch('icons.json');
    weatherIconsJson = await weatherIconResponse.json();
    
    let prefix = 'wi-';
    let icon = weatherIconsJson[code].icon;

    let today = new Date();
    let hour = today.getHours();
    let d_or_n = '';

    if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
        if (hour > 6 && hour < 20) {
            //Day time
           d_or_n = "day-";
        
        } else {
            //Night time
           d_or_n ="night-";
        }
    }

    // Finally
    icon = prefix + d_or_n + icon;

    // console.log(`svg/${icon}.svg`);

    return `svg/${icon}.svg`
}