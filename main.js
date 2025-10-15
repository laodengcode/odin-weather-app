const apiKey = 'HM6YJJZJX3HQW9FFCBG6PDUL8'; // Replace with your actual API key

const locationForm = document.getElementById('location-form');
const locationInput = document.getElementById('location-input');
const weatherContainer = document.getElementById('weather-container');
const unitToggle = document.getElementById('unit-toggle');
let lastWeatherData = null; // Variable to store the last fetched weather data

locationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = locationInput.value;
    getWeatherData(location);
});

// Event listener for the unit toggle to re-display weather with new units
unitToggle.addEventListener('change', () => {
    if (lastWeatherData) {
        displayWeatherData(lastWeatherData); // Re-display data with the new unit
    }
});

async function getWeatherData(location) {
    weatherContainer.innerHTML = '<div class="loading">Loading...</div>';
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=${apiKey}&contentType=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const processedData = processWeatherData(data);
        lastWeatherData = processedData; // Store the processed data
        displayWeatherData(processedData);
    } catch (error) {
        weatherContainer.innerHTML = `<div class="error">Could not fetch weather data. Please try again.</div>`;
        console.error('Error fetching weather data:', error);
    }
}

function processWeatherData(data) {
    return {
        location: data.resolvedAddress,
        current: {
            temp: data.currentConditions.temp,
            conditions: data.currentConditions.conditions,
            icon: data.currentConditions.icon
        },
        forecast: data.days.slice(1, 6).map(day => ({
            date: day.datetime,
            tempmax: day.tempmax,
            tempmin: day.tempmin,
            conditions: day.conditions,
            icon: day.icon
        }))
    };
}

function displayWeatherData(data) {
    const isCelsius = unitToggle.checked;
    const tempUnit = isCelsius ? '°C' : '°F';

    const toCelsius = (f) => ((f - 32) * 5 / 9).toFixed(1);

    const currentTemp = isCelsius ? toCelsius(data.current.temp) : data.current.temp;

    let forecastHtml = data.forecast.map(day => {
        const maxTemp = isCelsius ? toCelsius(day.tempmax) : day.tempmax;
        const minTemp = isCelsius ? toCelsius(day.tempmin) : day.tempmin;
        const iconUrl = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${day.icon}.png`;
        return `
            <div class="forecast-day">
                <div>${new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}</div>
                <div><img src="${iconUrl}" alt="${day.conditions}"></div>
                <div>${maxTemp}${tempUnit} / ${minTemp}${tempUnit}</div>
            </div>
        `;
    }).join('');

    const currentIconUrl = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${data.current.icon}.png`;

    weatherContainer.innerHTML = `
        <h2>${data.location}</h2>
        <div class="current-weather">
            <div class="current-temp">${currentTemp}${tempUnit}</div>
            <div class="current-conditions">${data.current.conditions}</div>
            <div><img src="${currentIconUrl}" alt="${data.current.icon}"></div>
        </div>
        <div class="forecast-container">
            ${forecastHtml}
        </div>
    `;

    updateBackground(data.current.icon);
}

function updateBackground(icon) {
    let imageUrl = '';
    switch (icon) {
        case 'clear-day':
            imageUrl = 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDNpZXVzN2dqM2p5d3A5N3MweWk4a3g3a2s0aWlqNTN1c2U4dG5hZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6gDWzmAzrpi5DQU8/giphy.gif';
            break;
        case 'clear-night':
            imageUrl = 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzA5Y2N0bXl2b3A0aWp6Z3JoM3A0ZzV6c2l3eXF3eXJ6dWJ1eXo2ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3q2Q2i54rCVa26L6/giphy.gif';
            break;
        case 'rain':
            imageUrl = 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3pva3N2dGg2dDR5N3U1c3pnaGZkbjVnMXU1cTBudWwzM3p3eHMzcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPoZniJ2hq8IItG/giphy.gif';
            break;
        case 'snow':
            imageUrl = 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExd29keTBudjVjZ3JpMndqZ3g3bzc4a3B2eTJ5eXk2eDI2bXl6eTNiZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/10rT2S2pi3x1XG/giphy.gif';
            break;
        case 'sleet':
            imageUrl = 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbW1xZ3h6Z3ZpZ3h6Z3h6Z3h6Z3h6Z3h6Z3h6Z3h6Z3h6Zg/3o7aCRlo2xN2ine2gU/giphy.gif';
            break;
        case 'wind':
            imageUrl = 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExenA1a3Mza3Fka3h1c3h1c3h1c3h1c3h1c3h1c3h1c3h1Zw/5oYgxQKHhEjEk/giphy.gif';
            break;
        case 'fog':
            imageUrl = 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDNpZXVzN2dqM2p5d3A5N3MweWk4a3g3a2s0aWlqNTN1c2U4dG5hZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6gDWzmAzrpi5DQU8/giphy.gif';
            break;
        case 'cloudy':
            imageUrl = 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3pva3N2dGg2dDR5N3U1c3pnaGZkbjVnMXU1cTBudWwzM3p3eHMzcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPoZniJ2hq8IItG/giphy.gif';
            break;
        case 'partly-cloudy-day':
            imageUrl = 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExenA1a3Mza3Fka3h1c3h1c3h1c3h1c3h1c3h1c3h1c3h1Zw/5oYgxQKHhEjEk/giphy.gif';
            break;
        case 'partly-cloudy-night':
            imageUrl = 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzA5Y2N0bXl2b3A0aWp6Z3JoM3A0ZzV6c2l3eXF3eXJ6dWJ1eXo2ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3q2Q2i54rCVa26L6/giphy.gif';
            break;
        default:
            imageUrl = 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDNpZXVzN2dqM2p5d3A5N3MweWk4a3g3a2s0aWlqNTN1c2U4dG5hZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6gDWzmAzrpi5DQU8/giphy.gif';
    }
    document.body.style.backgroundImage = `url(${imageUrl})`;
    document.body.style.backgroundSize = 'cover';
}