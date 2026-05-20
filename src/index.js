import './style.css';

// DOM Module Pattern
const domManip = (() => {
    const searchButton = document.querySelector(".search-button");
    const clearButton =  document.querySelector(".reset-button");
    searchButton.addEventListener("click", fetchCurrentWeather);
    clearButton.addEventListener("click", clearSearch);
})();

// Async function to fetch current forecast from user input on form
async function fetchCurrentWeather() {
    try {
        const searchCity = document.getElementById("search-city").value;
        const searchState = document.getElementById("search-state").value;
        const searchCountry = document.getElementById("search-country").value;

        // Run check to ensure all fields have values
        if (searchCity == "" || searchCountry == "") {
            alert("City and Country are required. Please try again!");
            return;
        }

        console.log(searchCity);
        console.log(searchState);
        console.log(searchCountry);

        const location = searchCity + "," + searchState + "," + searchCountry;
        const response = await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + encodeURIComponent(location) + "?unitGroup=us" + "&key=2NAY3KFXESMGC8DA6M8EML7ZS" + "&contentType=json");
        const currentData = await response.json();

        // Construct object for my weather app from the API JSON data
        const currentWeather = {
            mainWeather: currentData.currentConditions.icon,
            place: currentData.resolvedAddress,
            description: currentData.currentConditions.conditions,
            temp: Math.round(currentData.currentConditions.temp),
            humidity: currentData.currentConditions.humidity + "%",
            wind: Math.round(currentData.currentConditions.windspeed) + " mph"
        };

        console.log(currentWeather);

        displayWeather(currentWeather);

        getIcon(currentWeather.mainWeather);
        
    } catch (err) {
        console.log("Something has went wrong with fetching the current weather data....", err);
    }
}

function clearSearch() {
    document.getElementById("search-city").value = "";
    document.getElementById("search-state").value = "";
    document.getElementById("search-country").value = "";
    clearDOM();
}

function displayWeather(currentWeather) {
    const displayDiv = document.querySelector(".display-div");

    // Call the function to clear any DOM elements that may appear from previous searches
    clearDOM();

    // Create the elements in the DOM
    const city = document.createElement("p");
    city.textContent = currentWeather.place;
    displayDiv.appendChild(city);
    const status = document.createElement("p");
    status.textContent = currentWeather.mainWeather;
    displayDiv.appendChild(status);
    const cityTemp = document.createElement("p");
    cityTemp.textContent = currentWeather.temp + " Degrees";
    displayDiv.appendChild(cityTemp);
    const cityHumidity = document.createElement("p");
    cityHumidity.textContent = currentWeather.humidity + " Humidity";
    displayDiv.appendChild(cityHumidity);
    const cityWind = document.createElement("p");
    cityWind.textContent = currentWeather.wind + " Wind";
    displayDiv.appendChild(cityWind);
}

function getIcon(mainWeather) {
    document.getElementById("weather-icon").src = `./icons/${mainWeather}.svg`;
}

function clearDOM() {
    // Clear the DOM if anything was present from a prior search
    const nodeList = document.querySelectorAll("p");
    if (nodeList !== null) {
        for (let i = 0; i < nodeList.length; i++) {
            nodeList[i].remove();
        }
    }
}