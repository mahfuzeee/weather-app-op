# Weather App

A lightweight weather dashboard built with plain JavaScript and Webpack. The app lets users search for a city, fetch its current weather and 3-day forecast, and display the results in a clean card-based layout.

## Features

- Search for a city by name
- Current temperature and weather condition
- 3-day forecast summary
- Uses the Open-Meteo geocoding and forecast APIs
- Fully client-side implementation with no backend required
- Responsive single-page interface

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

The app searches for a city using the geocoding endpoint, then requests weather data for the matched latitude and longitude.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the app in development mode

```bash
npx webpack serve
```

This starts the webpack dev server and serves the app locally in the browser.

### 3. Build for production

```bash
npx webpack --mode production
```

The production bundle is generated in the `dist` folder.

## Usage

1. Open the app in your browser.
2. Type a city name in the input box.
3. Click the Search button or press Enter.
4. The app fetches the city coordinates and displays the current temperature plus a 3-day forecast.

## Notes

- The app defaults to Dhaka if the input is empty.
- Weather states are mapped from Open-Meteo `weather_code` values to readable text.
- If a location is not found, the app shows an alert message.

## Author

Md. Mahfuzur Rahman

## License

ISC
