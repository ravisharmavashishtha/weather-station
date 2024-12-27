import React, { useState, useEffect } from "react";
import axios from "axios";
import './WeatherComponent.css';

const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [useFallback, setUseFallback] = useState(false); // Track whether fallback is used
  const [tempRange, setTempRange] = useState(null); // New state for highest and lowest temperatures

  const API_URL = "http://esp321-weather.local/info"; // Primary API endpoint
  const FALLBACK_API_URL = "http://pn.local:5000/weather"; // Fallback API endpoint
  const TEMP_DATA_URL = "http://pn.local:5000/tempdata"; // New endpoint for highest and lowest temperature

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

  // Function to fetch the highest and lowest temperatures for the day
  const fetchTempRange = async () => {
    try {
      const response = await axios.get(TEMP_DATA_URL);
      if (response.data && response.data.highest && response.data.lowest) {
        setTempRange({
          highest: response.data.highest,
          lowest: response.data.lowest,
        });
      } else {
        throw new Error("Malformed temperature range data received");
      }
    } catch (error) {
      console.error("Error fetching temperature range data:", error);
      setError("Failed to fetch temperature range data");
    }
  };

  useEffect(() => {
    fetchWeather(); // Fetch current weather data
    fetchTempRange(); // Fetch temperature range for the day
  }, []);

  return (
    <div className="weather-container">
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="weather-data">
            <h2>Current Weather</h2>
            {weatherData ? (
              <>
                <p>Temperature: {weatherData.temperature}°C</p>
                <p>Humidity: {weatherData.humidity}%</p>
                {useFallback && weatherData.timestamp && (
                  <p>Date: {formatTimestamp(weatherData.timestamp)}</p>
                )}
              </>
            ) : (
              <div className="loading-message">Loading...</div>
            )}
          </div>

          {/* New Section for Highest and Lowest Temperature */}
          {tempRange && (
            <div className="temp-range">
              <h3>Temperature Range for Today</h3>
              <p>Highest: {tempRange.highest}°C</p>
              <p>Lowest: {tempRange.lowest}°C</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WeatherComponent;
