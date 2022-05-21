

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

$("#previousSearch").click(function () {
    let cityName = event.target.value;
    returnCurrentWeather(cityName);
    returnWeatherForecast(cityName);
})

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
function returnWeatherForecast(cityName) {
    let queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&APPID=6c0ac38b22e3e819b50460a5a899f855`;

    $.get(queryURL).then(function (response) {
        let forecastInfo = response.list;
        forecastDiv.empty();
        $.each(forecastInfo, function (i) {
            if (!forecastInfo[i].dt_txt.includes("12:00:00")) {
                return;
            }
            let forecastDate = new Date(forecastInfo[i].dt * 1000);
            let weatherIcon = `https://openweathermap.org/img/wn/${forecastInfo[i].weather[0].icon}.png`;
            forecastDiv.append(`
            <div class="col-md">
                <div class="card text-white bg-primary">
                    <div class="card-body">
                        <h4>${forecastDate.getMonth() + 1}/${forecastDate.getDate()}/${forecastDate.getFullYear()}</h4>
                        <img src=${weatherIcon} alt="Icon">
                        <p>Temp: ${forecastInfo[i].main.temp}&#176;F</p>
                        <p>Humidity: ${forecastInfo[i].main.humidity}%</p>
                    </div>
                </div>
            </div>
            `)
        })
    })
};

function returnUVIndex(coordinates) {
    let queryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${coordinates.lat}&lon=${coordinates.lon}&APPID=${apiKey}`;

    $.get(queryURL).then(function (response) {
        let currentUVIndex = response.value;
        let uvSeverity = "green";
        let textColour = "white"

        if (currentUVIndex >= 11) {
            uvSeverity = "purple";
        } else if (currentUVIndex >= 8) {
            uvSeverity = "red";
        } else if (currentUVIndex >= 6) {
            uvSeverity = "orange";
            textColour = "black"
        } else if (currentUVIndex >= 3) {
            uvSeverity = "yellow";
            textColour = "black"
        }
        currentWeatherDiv.append(`<p>UV Index: <span class="text-${textColour} uvPadding" style="background-color: ${uvSeverity};">${currentUVIndex}</span></p>`);
    })
}

function createHistoryButton(cityName) {
    var citySearch = cityName.trim();
    var buttonCheck = $(`#previousSearch > BUTTON[value='${citySearch}']`);
    if (buttonCheck.length == 1) {
        return;
    }

    if (!citiesArray.includes(cityName)) {
        citiesArray.push(cityName);
        localStorage.setItem("localWeatherSearches", JSON.stringify(citiesArray));
    }

    $("#previousSearch").prepend(`
    <button class="btn btn-light cityHistoryBtn" value='${cityName}'>${cityName}</button>
    `);
}

function writeSearchHistory(array) {
    $.each(array, function (i) {
        createHistoryButton(array[i]);
    })
};