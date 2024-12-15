import React, { useState, useEffect } from "react";
import axios from "axios";

const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modify the API URL to be relative because of the proxy in package.json
  const API_URL = `/info`; // The proxy will automatically point this to http://esp32-weather.local

  const fetchWeather = async () => {
    try {
      const response = await axios.get(API_URL);
      setWeatherData(response.data);
    } catch (error) {
      setError(error.message || "Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1>Weather Information</h1>
      <h2>Temperature: {weatherData.temperature}°C</h2>
      <p>Humidity: {weatherData.humidity}%</p>
    </div>
  );
};

export default WeatherComponent;
