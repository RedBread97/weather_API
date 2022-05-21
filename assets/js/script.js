

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

