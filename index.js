//CLI Weather Application
import fetch from "node-fetch";

// Read city name from command-line arguments
const city = process.argv[2];

// Validate input
if (!city) {
  console.error(" Please provide a city name.");
  process.exit(1);
}

// Fetch latitude and longitude for the city
async function getCityCoordinates(cityName) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`;

  const response = await fetch(geoUrl);
  if (!response.ok) {
    throw new Error("Unable to fetch city details");
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("City not found");
  }

  return {
    name: data.results[0].name,
    latitude: data.results[0].latitude,
    longitude: data.results[0].longitude
  };
}

// Fetch current weather using coordinates
async function getWeather(latitude, longitude) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

  const response = await fetch(weatherUrl);
  if (!response.ok) {
    throw new Error("Unable to fetch weather data");
  }

  const data = await response.json();
  return data.current_weather;
}

// Main function
async function main() {
  try {
    const cityData = await getCityCoordinates(city);
    const weather = await getWeather(
      cityData.latitude,
      cityData.longitude
    );

    console.log(
      `Weather in ${cityData.name}: ${weather.temperature}°C, Wind Speed ${weather.windspeed} km/h`
    );
  } catch (error) {
    console.error(" Error:", error.message);
  }
}

main();
