import React, { useState, useEffect } from "react";
import axios from "axios";
import './WeatherComponent.css';

const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = "/info"; // API endpoint without city parameter

  const fetchWeather = async () => {
    try {
      const response = await axios.get(API_URL);
      if (!response.data || !response.data.temperature || !response.data.humidity) {
        throw new Error("Malformed weather data received");
      }

      // Only update state if data has changed
      if (
        !weatherData ||
        weatherData.temperature !== response.data.temperature ||
        weatherData.humidity !== response.data.humidity
      ) {
        setWeatherData(response.data);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <div className="weather-container">
      {error ? (
        <div className="error-message">{error}</div>
      ) : weatherData ? (
        <div className="weather-data">
          <h2>Current Weather</h2>
          <p>Temperature: {weatherData.temperature}°C</p>
          <p>Humidity: {weatherData.humidity}%</p>
        </div>
      ) : (
        <div className="loading-message">Loading...</div>
      )}
    </div>
  );
};

export default WeatherComponent;

