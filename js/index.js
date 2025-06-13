
import { getCurrentWeather, getFiveDayForecast } from './weatherApi.js';
import { API_KEY, BASE_URL } from './weather-config.js';

console.log("API_KEY:", API_KEY);
console.log("BASE_URL:", BASE_URL);

function updateTime() {
  const time = new Date();
  const options = {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  const formattedTime = time.toLocaleTimeString('pt-BR', options);
  document.getElementById("time").textContent = formattedTime;
}

function updateDay() {
  const date = new Date();
  const options = {
    weekday: 'long',
    timeZone: 'America/Sao_Paulo'
  };
  let dayName = date.toLocaleDateString('pt-BR', options);
  dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  document.getElementById("day").textContent = `| ${dayName}`;
}

function updateFavoritePlacesTime() {
  const time = new Date();
  const options = {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };

  const dateOptions = {
    day: 'numeric',
    month: 'long',
    timeZone: 'America/Sao_Paulo'
  };
  const formattedDate = time.toLocaleDateString('pt-BR', dateOptions);

  document.querySelectorAll('.hours').forEach(element => {
    element.textContent = time.toLocaleTimeString('pt-BR', options);
  });

  const dateElement = document.querySelector('.titulo-favorite span');
  if (dateElement) {
    dateElement.textContent = formattedDate;
  }
}

function updateForecastDays() {
  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const hoje = new Date();

  const elementosDias = document.querySelectorAll('.text-0');

  elementosDias.forEach((elemento, index) => {
    const data = new Date();
    data.setDate(hoje.getDate() + index);
    const diaSemana = diasSemana[data.getDay()];

    if (index === 0) {
      elemento.textContent = 'Hoje';
    } else if (index === 1) {
      elemento.textContent = 'Amanhã';
    } else {
      elemento.textContent = diaSemana;
    }

    const diaMes = data.getDate();
    const mes = data.toLocaleString('pt-BR', { month: 'short' }).toUpperCase();
    elemento.closest('.day_col').querySelector('.subtitle-m').textContent = `${diaMes} ${mes}.`;
  });
}

function helpfulMessage(temp) {
  const mensagem = document.getElementById('message');
  mensagem.className = 'weather-message';

  if (temp > 30) {
    mensagem.classList.add('hot');
    mensagem.innerHTML = `🔥 <strong>Calor Extremo!</strong><span>Melhor ficar na sombra com uma gelada.</span> <small>Dica: Evite sair entre 10h-16h e use MUITO protetor solar</small>`;
  } else if (temp > 25) {
    mensagem.classList.add('warm');
    mensagem.innerHTML = `☀️ <strong>Dia Quente</strong> <span>Perfeito para praia ou piscina!</span> <small>Dica: Chapéu e óculos escuros são ótimos aliados</small>`;
  } else if (temp > 20) {
    mensagem.classList.add('mild');
    mensagem.innerHTML = `🌤️ <strong>Clima Perfeito</strong> <span>Temperatura ideal para qualquer atividade ao ar livre!</span> <small>Dica: Aproveite para fazer um piquenique no parque</small>`;
  } else if (temp > 15) {
    mensagem.classList.add('cool');
    mensagem.innerHTML = `🍃 <strong>Fresquinho</strong> <span>Ótimo para caminhar ou pedalar com um casaco leve.</span> <small>Dica: Leve um agasalho para quando o vento aumentar</small>`;
  } else if (temp > 0) {
    mensagem.classList.add('cold');
    mensagem.innerHTML = `❄️ <strong>Frio Chegando</strong> <span>Hora dos casacos quentes e bebidas aconchegantes!</span> <small>Dica: Chocolate quente ou chá vão te aquecer bem</small>`;
  } else {
    mensagem.classList.add('freezing');
    mensagem.innerHTML = `⛄  <strong>Frio Polar!</strong> <span>Cuidado com hipotermia! Melhor ficar embaixo das cobertas.</span> <small>Dica: Sopas quentes e aquecedores são seus melhores amigos</small>`;
  }
}

const elements = {
  cityName: document.querySelector('.forecast-main h1'),
  currentTemp: document.querySelector('.celsius'),
  feelsLike: document.querySelector('.txt-strng'),
  weatherIcon: document.getElementById('cloud'),
  weatherDesc: document.querySelector('.description'),
  dailyForecast: document.querySelectorAll('.grid-item')
};

const iconMap = {
    '01d': 'cloud.png',
    '01n': 'cloud.png',
    '02d': 'cloud.png',
    '03d': 'cloud.png',
    '04d': 'cloud.png',
    '09d': 'cloud.png',
    '10d': 'cloud.png',
    '11d': 'cloud.png',
    '13d': 'cloud.png',
    '50d': 'cloud.png'
};

async function updateCurrentWeather() {
  try {
    const data = await getCurrentWeather();

    elements.cityName.textContent = `Previsão do Tempo ${data.name}`;
    elements.currentTemp.textContent = `${Math.round(data.main.temp)}°`;
    elements.feelsLike.textContent = `${Math.round(data.main.feels_like)}°`;
    elements.weatherDesc.textContent = data.weather[0].description;

    const iconCode = data.weather[0].icon;
    elements.weatherIcon.src = `./img/${iconMap[iconCode] || 'cloud.png'}`;

    helpfulMessage(Math.round(data.main.temp));

  } catch (error) {
    console.error("Erro ao buscar clima atual:", error);
    elements.weatherDesc.textContent = "Erro ao carregar dados meteorológicos";
  }
}

async function updateCurrentDayTemps() {
  try {
      const data = await getCurrentWeather();
      const { temp_min, temp_max } = data.main;

      const hojeCard = document.querySelector('.grid-item.d1');
      if (!hojeCard) return;

      const maxEl = hojeCard.querySelector('.max');
      const minEl = hojeCard.querySelector('.min');

      if (maxEl) maxEl.textContent = `${Math.round(temp_max)}°`;
      if (minEl) minEl.textContent = `${Math.round(temp_min)}°`;

  } catch (error) {
      console.error("Erro ao obter mínima/máxima de hoje:", error);
  }
}

async function updateFiveDayForecast() {
  try {
    const { list } = await getFiveDayForecast(); // Dados da API /forecast

    const dailyForecasts = {};
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateDay = new Date(date);
      dateDay.setHours(0, 0, 0, 0);

      if (dateDay.getTime() === hoje.getTime()) return; // ignora hoje

      const dateStr = dateDay.toISOString().split('T')[0];

      if (!dailyForecasts[dateStr]) {
        dailyForecasts[dateStr] = {
          temps: [],
          tempsMax: [],
          tempsMin: [],
          pops: [],
          icons: [],
          descriptions: []
        };
      }

      dailyForecasts[dateStr].temps.push(item.main.temp);
      dailyForecasts[dateStr].tempsMax.push(item.main.temp_max);
      dailyForecasts[dateStr].tempsMin.push(item.main.temp_min);
      dailyForecasts[dateStr].icons.push(item.weather[0].icon);
      dailyForecasts[dateStr].descriptions.push(item.weather[0].description);
      if (item.pop !== undefined) dailyForecasts[dateStr].pops.push(item.pop);
    });

    const forecastDates = Object.keys(dailyForecasts).sort().slice(0, 5);

    forecastDates.forEach((dateStr, index) => {
      const dayElement = elements.dailyForecast[index];
      if (!dayElement) return;

      const date = new Date(dateStr);
      const dayOfWeek = diasSemana[date.getDay()];
      const dayLabel = index === 0 ? 'Hoje' : index === 1 ? 'Amanhã' : dayOfWeek;
      const dayMonth = date.getDate();
      const month = date.toLocaleString('pt-BR', { month: 'short' }).toUpperCase();

      const forecast = dailyForecasts[dateStr];
      const avgTemp = Math.round(forecast.temps.reduce((a, b) => a + b, 0) / forecast.temps.length);
      const maxTemp = Math.round(Math.max(...forecast.tempsMax));
      const minTemp = Math.round(Math.min(...forecast.tempsMin));
      const avgPop = forecast.pops.length
        ? Math.round(forecast.pops.reduce((a, b) => a + b, 0) / forecast.pops.length * 100)
        : 0;
      const icon = getMostFrequentIcon(forecast.icons);
      const mostLikelyDesc = getMostFrequentDescription(forecast.descriptions);

      // Preenche elementos do DOM
      setText('.text-0', dayLabel, dayElement);
      setText('.subtitle-m', `${dayMonth} ${month}.`, dayElement);
      setText('.max', `${maxTemp}°`, dayElement);
      setText('.min', `${minTemp}°`, dayElement);
      setText('.pop', `${avgPop}%`, dayElement);

      const climaChanceEl = dayElement.querySelector('.clima5days');
      if (climaChanceEl) {
        climaChanceEl.textContent = mostLikelyDesc.charAt(0).toUpperCase() + mostLikelyDesc.slice(1);
      }

      const iconElement = dayElement.querySelector('.weather-icon');
      if (iconElement) {
        iconElement.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        iconElement.alt = 'Ícone do tempo';
      }
    });

  } catch (error) {
    console.error("Erro ao buscar previsão de 5 dias:", error);
  }
}

function getMostFrequentDescription(descriptions) {
  return descriptions.sort((a, b) =>
    descriptions.filter(v => v === a).length - descriptions.filter(v => v === b).length
  ).pop();
}

function setText(selector, text, parent) {
  const el = parent.querySelector(selector);
  if (el) el.textContent = text;
}

function getMostFrequentIcon(icons) {
  return icons.sort((a, b) =>
      icons.filter(v => v === a).length - icons.filter(v => v === b).length
  ).pop();
}

async function updatePrecipitationToday() {
    try {
        const { list } = await getFiveDayForecast();

        const now = new Date();
        const next24h = list.filter(item => {
            const itemDate = new Date(item.dt * 1000);
            return itemDate > now && itemDate - now <= 24 * 60 * 60 * 1000;
        });

        const pops = next24h.map(item => item.pop || 0);

        if (pops.length > 0) {
            const maxPop = Math.round(Math.max(...pops) * 100);
            const precipitationElement = document.getElementById('precipitação');
            if (precipitationElement) {
                precipitationElement.textContent = `${maxPop}%`;
            }
        } else {
            const precipitationElement = document.getElementById('precipitação');
            if (precipitationElement) {
                precipitationElement.textContent = `0%`;
            }
        }

    } catch (error) {
        console.error("Erro ao buscar precipitação:", error);
    }
}

function updatePeriodBlock(periodName, forecastData) {
  const bloco = Array.from(document.querySelectorAll('.bloco-periodo')).find(div =>
    div.querySelector('h3')?.textContent.includes(periodName)
  );
  if (!bloco) return;

  const temp = Math.round(forecastData.main.temp);
  const description = forecastData.weather[0].description;

  bloco.querySelector('p:nth-child(2)').textContent = `Temperatura: ${temp}°`;
  bloco.querySelector('p:nth-child(3)').textContent = `Clima: ${description.charAt(0).toUpperCase() + description.slice(1)}`;
}

function getNearestForecast(dataList, targetHourLocal) {
  const timezoneOffset = new Date().getTimezoneOffset() * 60; // em segundos
  const now = Date.now();

  return dataList.reduce((closest, forecast) => {
    const localDate = new Date((forecast.dt + timezoneOffset) * 1000);
    const forecastHour = localDate.getHours();

    const diffCurrent = Math.abs(forecastHour - targetHourLocal);
    const diffClosest = closest ? Math.abs(new Date((closest.dt + timezoneOffset) * 1000).getHours() - targetHourLocal) : Infinity;

    return diffCurrent < diffClosest ? forecast : closest;
  }, null);
}

async function updateDayPeriodsForecast() {
  const apiKey = 'ede4f88d03f331dacb8d80f01578d189';
  const city = 'Caxias do Sul';
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=pt_br`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const forecastList = data.list;
    const timezoneOffsetSeconds = data.city.timezone; // deslocamento em segundos em relação ao UTC

    // Horários de interesse (em hora local)
    const targetHours = {
      Manhã: 6,
      Tarde: 15,
      Noite: 21,
    };

    Object.entries(targetHours).forEach(([period, targetHour]) => {
      let bestMatch = null;
      let smallestDiff = Infinity;

      for (const forecast of forecastList) {
        // Ajusta timestamp da previsão para horário local da cidade
        const localTime = new Date((forecast.dt + timezoneOffsetSeconds) * 1000);
        const hour = localTime.getHours();

        const diff = Math.abs(hour - targetHour);
        if (diff < smallestDiff) {
          smallestDiff = diff;
          bestMatch = forecast;
        }
      }

      if (bestMatch) {
        const bloco = Array.from(document.querySelectorAll('.bloco-periodo')).find(div =>
          div.querySelector('h3')?.textContent.includes(period)
        );
        if (bloco) {
          const temp = Math.round(bestMatch.main.temp);
          const description = bestMatch.weather[0].description;

          bloco.querySelector('p:nth-child(2)').textContent = `Temperatura: ${temp}°`;
          bloco.querySelector('p:nth-child(3)').textContent = `Clima: ${description.charAt(0).toUpperCase() + description.slice(1)}`;
        }
      }
    });

  } catch (error) {
    console.error('Erro ao obter previsão:', error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateDay();
  updateTime();
  setInterval(updateTime, 1000);
  setInterval(updateFavoritePlacesTime, 1000);
  updateCurrentWeather();
  updateFiveDayForecast();
  updateForecastDays();
  updatePrecipitationToday();
  updateCurrentWeather(); 
  updateCurrentDayTemps();
  updateDayPeriodsForecast();
});