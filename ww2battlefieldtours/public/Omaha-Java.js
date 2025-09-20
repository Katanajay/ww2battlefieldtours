// Same logic, different coordinates
const WMO = {0:"Clear sky",1:"Mainly clear",2:"Partly cloudy",3:"Overcast",45:"Fog",48:"Depositing rime fog",51:"Drizzle: light",53:"Drizzle: moderate",55:"Drizzle: dense",61:"Rain: slight",63:"Rain: moderate",65:"Rain: heavy",71:"Snow: slight",73:"Snow: moderate",75:"Snow: heavy",80:"Rain showers: slight",81:"Rain showers: moderate",82:"Rain showers: violent",95:"Thunderstorm",96:"Thunderstorm w/ hail",99:"Thunderstorm w/ heavy hail"};
const c = n => (typeof n === "number" && !isNaN(n) ? n.toFixed(1) : "—");

export async function loadWeather(lat,long){ // add more here
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude","49.3767");    // Omaha Beach area
  url.searchParams.set("longitude","-0.8781");
  url.searchParams.set("timezone","Europe/Paris");
  url.searchParams.set("forecast_days","5");
  url.searchParams.set("current","temperature_2m,weather_code,wind_speed_10m");
  url.searchParams.set("daily","weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum");

  const res = await fetch(url);
  const data = await res.json();

  const cur = data.current;
  const curEl = document.getElementById("current-weather");
  if (curEl && cur) {
    curEl.innerHTML = `
      <div style="font-size:32px;font-weight:700;">${c(cur.temperature_2m)}°C</div>
      <div>${WMO[cur.weather_code]||"—"}</div>
      <div style="color:#9fb1d4">💨 Wind ${c(cur.wind_speed_10m)} km/h</div>
    `;
  }

  const days = data.daily.time.map((t,i)=>({
    date:new Date(t),
    code:data.daily.weather_code[i],
    tmax:data.daily.temperature_2m_max[i],
    tmin:data.daily.temperature_2m_min[i],
    rain:data.daily.precipitation_sum[i]
  }));
  const fmt = new Intl.DateTimeFormat("en-GB",{weekday:"short",day:"2-digit",month:"short"});
  const fcEl = document.getElementById("forecast-weather");
  if (fcEl) {
    fcEl.innerHTML = days.map(d => `
      <div style="margin:6px 0;padding:10px;border-radius:8px;background:#0f1a2e;color:#e7eefc">
        <strong>${fmt.format(d.date)}</strong><br>
        ${WMO[d.code]||"—"}<br>
        🌡️ ${c(d.tmax)}° / ${c(d.tmin)}° • 💧 ${c(d.rain)} mm
      </div>`).join("");
  }
}
document.addEventListener("DOMContentLoaded", loadWeather);
document.addEventListener(“DOMContentLoaded”, function() { loadWeather(‘123’, ‘456’)})