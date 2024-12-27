import React, { useState, useEffect } from "react";
import axios from "axios";
import './WeatherComponent.css';

const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [useFallback, setUseFallback] = useState(false); // Track whether fallback is used

  const API_URL = "/info"; // Primary API endpoint
  const FALLBACK_API_URL = "/weather"; // Fallback API endpoint

  // Function to format timestamp into human-readable date
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Local date format
  };

  // Function to fetch weather data from the primary API
  const fetchWeather = async () => {
    try {
      // Try fetching from /info first
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
        setWeatherData({
          temperature: response.data.temperature,
          humidity: response.data.humidity,
        });
      }

      // Reset fallback flag since /info data is used
      setUseFallback(false);
      setError(null); // Clear any previous errors if /info request is successful
    } catch (error) {
      console.error('Error fetching from /info, trying fallback...', error);
      setError("Failed to fetch data from /info"); // Set error for the /info request

      // If proxy fails (504 or other error), fallback to /weather
      if (error.response && error.response.status === 504) {
        console.log("504 error, trying /weather fallback...");

        try {
          const fallbackResponse = await axios.get(FALLBACK_API_URL);
          if (fallbackResponse.data && fallbackResponse.data.length > 0) {
            const latestData = fallbackResponse.data[0]; // Use the most recent data
            setWeatherData({
              temperature: latestData.temperature,
              humidity: latestData.humidity,
              timestamp: latestData.timestamp,
            });
            setUseFallback(true); // Mark that fallback data was used
            setError(null); // Clear any previous errors since fallback succeeded
          } else {
            throw new Error("Malformed fallback weather data received");
          }
        } catch (fallbackError) {
          setError(fallbackError.message);
          console.error('Fallback failed: ', fallbackError.message);
        }
      }
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
          {useFallback && weatherData.timestamp && (
            <p>Date: {formatTimestamp(weatherData.timestamp)}</p>
          )}
        </div>
      ) : (
        <div className="loading-message">Loading...</div>
      )}
    </div>
  );
};

export default WeatherComponent;
