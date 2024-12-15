import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import './WeatherComponent.css';

const WeatherComponent = ({ city }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = `/info?city=${city || "Mainpuri"}`;

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

    // Set interval to fetch weather data every second (1000ms)
    const intervalId = setInterval(fetchWeather, 1000);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [city]); // Re-run the effect when the city prop changes

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

WeatherComponent.propTypes = {
  city: PropTypes.string,
};

WeatherComponent.defaultProps = {
  city: "Mainpuri",
};

export default WeatherComponent;
