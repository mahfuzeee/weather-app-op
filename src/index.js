// index.js

import "./styles.css";

const weatherCodes = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing Rime Fog",
  51: "Light Drizzle",
  61: "Light Rain",
  71: "Light Snow",
  95: "Thunderstorm",
};

function getWeatherCondition(code) {
  return weatherCodes[code] || "Unspecified Condition";
}

document.getElementById("search-btn").addEventListener("click", handleSearch);
document.getElementById("city-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSearch();
});

async function handleSearch() {
  const query = document.getElementById("city-input").value.trim() || "dhaka";
  if (!query) return;

  try {
    // 1. Geocoding API Step
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      alert("City location not found.");
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2. Forecast API Step
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    updateUI(`${name}, ${country}`, weatherData);
  } catch (error) {
    console.error("Data tracking error:", error);
    alert("An error occurred while fetching information.");
  }
}

function updateUI(locationLabel, data) {
  document.getElementById("location-name").textContent = locationLabel;
  document.getElementById("current-temp").textContent = Math.round(
    data.current.temperature_2m,
  );
  document.getElementById("current-condition").textContent =
    getWeatherCondition(data.current.weather_code);

  const forecastContainer = document.getElementById("forecast-container");
  forecastContainer.innerHTML = ""; // Reset structural grid

  // Map array sequence loop (limiting to 3 days execution)
  for (let i = 0; i < 3; i++) {
    const rawDate = new Date(data.daily.time[i]);
    const formattedDate = rawDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const maxTemp = Math.round(data.daily.temperature_2m_max[i]);
    const minTemp = Math.round(data.daily.temperature_2m_min[i]);
    const condition = getWeatherCondition(data.daily.weather_code[i]);

    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
      <div class="date">${formattedDate}</div>
      <div style="font-size:0.8rem; margin-bottom:5px;">${condition}</div>
      <div class="temps">${maxTemp}° / ${minTemp}°</div>
    `;
    forecastContainer.appendChild(card);
  }

  document.getElementById("weather-display").classList.remove("hidden");
}
