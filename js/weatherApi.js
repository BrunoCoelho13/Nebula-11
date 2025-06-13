import { API_KEY, BASE_URL, UNITS, LANG, CITY } from './weather-config.js';

export async function getCurrentWeather() {
    const response = await fetch(
        `${BASE_URL}/weather?q=${CITY}&appid=${API_KEY}&units=${UNITS}&lang=${LANG}`
    );
    return await response.json();
}

export async function getFiveDayForecast() {
    const response = await fetch(
        `${BASE_URL}/forecast?q=${CITY}&appid=${API_KEY}&units=${UNITS}&lang=${LANG}`
    );
    return await response.json();
}