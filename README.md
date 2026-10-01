# Weather App

A lightweight weather dashboard built with plain JavaScript and Webpack. Search for a city to see current conditions and a five-day forecast, with temperature, wind, precipitation, and UV details.

## Features

- Search for a city by name
- Current temperature and weather condition
- Temperature display in Celsius or Fahrenheit
- Five-day forecast with daily high/low temperatures and precipitation probability
- Current wind speed and direction, precipitation, and UV index
- Uses the Open-Meteo geocoding and forecast APIs
- Fully client-side implementation with no backend required
- Responsive single-page dashboard

## Tech Stack

- JavaScript (vanilla ES modules)
- HTML5
- CSS3
- Webpack 5
- Open-Meteo API

## Project Structure

```text
weather-app-op/
├── src/
│   ├── index.js
│   ├── styles.css
│   └── template.html
├── package.json
├── webpack.config.js
├── README.md
└── dist/   # generated after build
```

## APIs Used

- Geocoding API: https://geocoding-api.open-meteo.com/v1/search
- Forecast API: https://api.open-meteo.com/v1/forecast

The app searches for a city using the geocoding endpoint, then requests current and daily weather data for the matched latitude and longitude. It uses the location's automatic time zone and does not require an API key.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the app in development mode

```bash
npx webpack serve
```

This starts the webpack development server. Open the local URL shown in the terminal (usually `http://localhost:8080`). The dashboard loads Dhaka's weather on startup; use the search field to look up another city.

### 3. Build for production

```bash
npm run build
```

The production bundle is generated in the `dist` folder.

## Deploying

The project includes a GitHub Pages deployment script. Configure the repository's GitHub Pages settings to publish from the `gh-pages` branch, then run:

```bash
npm run deploy
```

The `predeploy` script builds the app before publishing `dist`.

## Usage

1. Open the app; it loads Dhaka's weather automatically.
2. Enter a city name and click **Search** or press Enter.
3. Review the current conditions and five-day forecast.
4. Use the temperature button to switch between Celsius and Fahrenheit.

## Notes

- An empty search uses Dhaka as the default; the initial page load also fetches Dhaka.
- Weather conditions are mapped from Open-Meteo `weather_code` values to labels and icons.
- Search and network errors are displayed in the dashboard.
