

const apiKey = "41db9ba470e0f2125c6deb5b56dc1197"

var currentWeatherDiv = $("#currentWeather");
var forecastDiv = $("#weatherForecast");
var citiesArray;


$("#submitCity").click(function () {
    event.preventDefault();
    let cityName = $("#cityInput").val();
    returnCurrentWeather(cityName);
    returnWeatherForecast(cityName);
});

if (localStorage.getItem("localWeatherSearches")) {
    citiesArray = JSON.parse(localStorage.getItem("localWeatherSearches"));
    writeSearchHistory(citiesArray);
} else {
    citiesArray = [];
};

$("#clear").click(function () {
    localStorage.clear('localWeatherSearches');
});

function returnCurrentWeather(cityName) {
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&APPID=${apiKey}`;

    $.get(queryURL).then(function (response) {

        let currentTime = new Date(response.dt * 1000);
        let weatherIcon = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;

        currentWeatherDiv.html(`
        <h2>${response.name}, ${response.sys.country} (${currentTime.getMonth() + 1}/${currentTime.getDate()}/${currentTime.getFullYear()})<img src=${weatherIcon} height="70px"></h2>
        <p>Temperature: ${response.main.temp}&#176;F</p>
        <p>Humidity: ${response.main.humidity}%</p>
        <p>Wind Speed: ${response.wind.speed} mph</p>
        `, returnUVIndex(response.coord))
        createHistoryButton(response.name);
    })
};
