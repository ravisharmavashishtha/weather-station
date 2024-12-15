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
        setError(null);
      }
    } catch (error) {
      setError(error.message || "Failed to fetch weather data");
    }
  };

  useEffect(() => {
    // Fetch weather data immediately when the component mounts
    fetchWeather();

    // Set interval to fetch weather data every 10 seconds
    const intervalId = setInterval(fetchWeather, 10000);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Dependency array is empty as city is removed

  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="weather-container">
      <h1 className="weather-title">Weather Information</h1>
      {weatherData ? (
        <div className="weather-details">
          <h2 className="temperature">Temperature: {weatherData.temperature}°C</h2>
          <h2 className="humidity">Humidity: {weatherData.humidity}%</h2>
        </div>
      ) : (
        <div className="no-data-message">Fetching weather data...</div>
      )}
    </div>
  );
};

export default WeatherComponent;
