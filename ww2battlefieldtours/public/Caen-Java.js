// Open-Meteo powered weather for Caen
const WMO = {
  0:"Clear sky",1:"Mainly clear",2:"Partly cloudy",3:"Overcast",
  45:"Fog",48:"Depositing rime fog",
  51:"Drizzle: light",53:"Drizzle: moderate",55:"Drizzle: dense",
  61:"Rain: slight",63:"Rain: moderate",65:"Rain: heavy",
  71:"Snow: slight",73:"Snow: moderate",75:"Snow: heavy",
  80:"Rain showers: slight",81:"Rain showers: moderate",82:"Rain showers: violent",
  95:"Thunderstorm",96:"Thunderstorm w/ hail",99:"Thunderstorm w/ heavy hail"
};
const fmt1 = n => (typeof n === "number" && !isNaN(n) ? n.toFixed(1) : "—");

async function loadCaenWeather(){
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude","49.1829");
    url.searchParams.set("longitude","-0.3707");
    url.searchParams.set("timezone","Europe/Paris");
    url.searchParams.set("forecast_days","5");
    url.searchParams.set("current","temperature_2m,weather_code,wind_speed_10m");
    url.searchParams.set("daily","weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum");

    const res = await fetch(url);
    const data = await res.json();

    const cur = data.current;
    const currentEl = document.getElementById("current-weather");
    if (currentEl && cur) {
      currentEl.innerHTML =
        `<div style="font-size:32px;font-weight:700;">${fmt1(cur.temperature_2m)}°C</div>
         <div>${WMO[cur.weather_code] || "—"}</div>
         <div style="color:#9fb1d4">💨 Wind ${fmt1(cur.wind_speed_10m)} km/h</div>`;
    }

    const days = data.daily.time.map((t,i)=>({
      date: new Date(t),
      code: data.daily.weather_code[i],
      tmax: data.daily.temperature_2m_max[i],
      tmin: data.daily.temperature_2m_min[i],
      rain: data.daily.precipitation_sum[i]
    }));

    const fmt = new Intl.DateTimeFormat("en-GB",{weekday:"short",day:"2-digit",month:"short"});

    const forecastEl = document.getElementById("forecast-weather");
    if (forecastEl) {
      forecastEl.innerHTML = days.map(d => `
        <div style="margin:6px 0;padding:10px;border-radius:8px;background:#0f1a2e;color:#e7eefc">
          <strong>${fmt.format(d.date)}</strong><br />
          ${WMO[d.code] || "—"}<br />
          🌡️ ${fmt1(d.tmax)}° / ${fmt1(d.tmin)}°  •  💧 ${fmt1(d.rain)} mm
        </div>`).join("");
    }
  } catch (e) {
    console.error("Weather load failed", e);
  }
}

// Run after DOM ready
document.addEventListener("DOMContentLoaded", loadCaenWeather);
