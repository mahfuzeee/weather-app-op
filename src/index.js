// index.js

import "./styles.css";

const weatherCodes = {
  0: ["Clear Sky", "sun"],
  1: ["Mainly Clear", "partly"],
  2: ["Partly Cloudy", "partly"],
  3: ["Overcast", "cloud"],
  45: ["Fog", "fog"],
  48: ["Depositing Rime Fog", "fog"],
  51: ["Light Drizzle", "rain"],
  53: ["Moderate Drizzle", "rain"],
  55: ["Heavy Drizzle", "rain"],
  61: ["Light Rain", "rain"],
  71: ["Light Snow", "snow"],
  80: ["Light Rain Showers", "rain"],
  81: ["Moderate Rain Showers", "rain"],
  82: ["Heavy Rain Showers", "rain"],
  85: ["Light Snow Showers", "snow"],
  86: ["Heavy Snow Showers", "snow"],
  95: ["Thunderstorm", "storm"],
};

//Function for getting elements
const $ = (id) => document.getElementById(id);
const form = $("form"),
  input = $("q"),
  btn = $("btn"),
  statusEl = $("status"),
  out = $("out"),
  toggleBtn = $("unit");

function getWeatherCondition(code) {
  return weatherCodes[code] || "Unspecified Condition";
}

//Svg images for weather conditions
const CLOUD =
  '<path d="M20 46a10 10 0 0 1 2-19.8A14 14 0 0 1 49 24a11 11 0 0 1 1 22z" fill="#9fb3c4"/>';
const SUN =
  '<circle cx="32" cy="32" r="11" fill="#f2b84b"/><g stroke="#f2b84b" stroke-width="3" stroke-linecap="round"><path d="M32 8v6M32 50v6M8 32h6M50 32h6M15 15l4 4M45 45l4 4M15 49l4-4M45 19l4-4"/></g>';

//Function for svg icon
function icon(kind) {
  let body = "";
  switch (kind) {
    case "sun":
      body = SUN;
      break;
    case "partly":
      body =
        '<g transform="translate(-6 -8) scale(.7)">' +
        SUN +
        '</g><g transform="translate(6 6) scale(.85)">' +
        CLOUD +
        "</g>";
      break;
    case "cloud":
      body = CLOUD;
      break;
    case "fog":
      body =
        CLOUD.replace("M20 46", "M20 40").replace(
          "a10 10 0 0 1 2-19.8",
          "a10 10 0 0 1 2-19.8",
        ) +
        '<g stroke="#9fb3c4" stroke-width="3" stroke-linecap="round"><path d="M14 50h36M20 57h24"/></g>';
      break;
    case "rain":
      body =
        CLOUD +
        '<g stroke="#3b8ed0" stroke-width="3" stroke-linecap="round"><path d="M22 52l-3 7M32 52l-3 7M42 52l-3 7"/></g>';
      break;
    case "snow":
      body =
        CLOUD +
        '<g fill="#5d7a90"><circle cx="22" cy="55" r="2.5"/><circle cx="32" cy="58" r="2.5"/><circle cx="42" cy="55" r="2.5"/></g>';
      break;
    case "storm":
      body = CLOUD + '<path d="M34 46l-7 10h6l-3 8 10-12h-6z" fill="#f2b84b"/>';
      break;
  }
  return (
    '<svg viewBox="0 0 64 64" role="img" aria-hidden="true">' + body + "</svg>"
  );
}

//Function for setting status
function setStatus(msg, isError) {
  statusEl.textContent = msg;
  statusEl.className = isError ? "error" : "";
  statusEl.hidden = !msg;
}

//Handle Search funtion
async function handleSearch() {
  setStatus("Loading…");
  btn.disabled = true;
  out.hidden = true;
  const query = input.value.trim() || "Dhaka";
  if (!query) return;

  try {
    // 1. Geocoding API Step
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      setStatus(
        'No place found for "' +
          query +
          '". Check the spelling or try a nearby city.',
        true,
      );
      return;
    }

    const { latitude = 23.7104, longitude = 9.40744 } = geoData.results[0];

    // 2. Forecast API Step
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,precipitation,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,&timezone=auto&forecast_days=5`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    updateUI(geoData.results[0], weatherData);

    setStatus("");
  } catch (error) {
    console.error("Data tracking error:", error);
    setStatus(
      "Could not load weather. Check your connection and try again.",
      true,
    );
  } finally {
    btn.disabled = false;
  }
}

//Function for compass
function compass(deg) {
  return ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(deg / 45) % 8];
}

let unit = "C";

function formatTemperature(celsius) {
  const value = unit === "F" ? (celsius * 9) / 5 + 32 : celsius;
  return `${Math.round(value)}`;
}

//Function for updating UI
function updateUI(place, data) {
  const c = data.current,
    d = data.daily;
  const [label, kind] = getWeatherCondition(c.weather_code);
  $("place").textContent = [place.name, place.admin1, place.country]
    .filter(Boolean)
    .join(", ");
  $("temp").textContent = Math.round(c.temperature_2m) + "°C";
  $("cond").textContent = label;
  $("cIcon").innerHTML = icon(kind);
  $("wind").textContent =
    Math.round(c.wind_speed_10m) + " km/h " + compass(c.wind_direction_10m);
  $("rainNow").textContent = c.precipitation + " mm";
  $("rainChance").textContent = d.precipitation_probability_max[0] + "%";
  $("uv").textContent = `${Number(c.uv_index).toFixed(1)}`;

  //Daily forecast data update
  $("days").innerHTML = "";
  d.time.forEach((date, i) => {
    const [dLabel, dKind] = getWeatherCondition(d.weather_code[i]);
    const name =
      i === 0
        ? "Today"
        : new Date(date + "T00:00:00").toLocaleDateString("en", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
    const el = document.createElement("div");
    el.className = "day";
    el.innerHTML =
      '<div class="name">' +
      name +
      "</div>" +
      icon(dKind) +
      '<div class="hi">' +
      Math.round(d.temperature_2m_max[i]) +
      "°</div>" +
      '<div class="lo">' +
      Math.round(d.temperature_2m_min[i]) +
      "°</div>" +
      '<div class="rain">' +
      d.precipitation_probability_max[i] +
      "% rain</div>";
    el.title = dLabel;
    $("days").appendChild(el);
  });
  out.hidden = false;
  toggleBtn.addEventListener("click", () => {
    const isPressed = toggleBtn.getAttribute("aria-pressed") === "true";
    unit = isPressed ? "C" : "F";
    toggleBtn.setAttribute("aria-pressed", !isPressed);
    $("temp").textContent = formatTemperature(c.temperature_2m) + "°" + unit;
    toggleBtn.textContent = isPressed ? "°F" : "°C";
  });
}

//Event Listener
form.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSearch();
});

await handleSearch();
