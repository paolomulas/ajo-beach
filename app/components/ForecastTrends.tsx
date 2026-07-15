import { CoastIcon } from "@/app/components/CoastIcon";
import type { RankedSpot } from "@/lib/engine";

function windName(degrees: number) {
  const names = ["Tramontana · N", "Grecale · NE", "Levante · E", "Scirocco · SE", "Ostro · S", "Libeccio · SW", "Ponente · W", "Maestrale · NW"];
  return names[Math.round(degrees / 45) % 8];
}

export function ForecastTrends({ spot }: { spot: RankedSpot }) {
  const points = spot.hourly.slice(0, 7);
  const maxWind = Math.max(12, ...points.map((point) => point.gusts));
  const line = (key: "windSpeed" | "gusts") => points.map((point, index) => `${20 + index * 63},${100 - point[key] / maxWind * 70}`).join(" ");

  return (
    <section className="forecast-trends" aria-label="Hourly cloud and wind forecast">
      <article className="cloud-trend trend-card">
        <div className="trend-heading"><span className="trend-icon"><CoastIcon name="cloud"/></span><div><small>NEXT HOURS</small><h3>Cloud cover</h3></div><b>{spot.cloudCover}% now</b></div>
        <div className="cloud-bars">{points.map((point) => <div key={point.time}><span>{point.cloudCover}%</span><i style={{ height: `${Math.max(5, point.cloudCover)}%` }}/><small>{point.time}</small></div>)}</div>
      </article>
      <article className="wind-trend trend-card">
        <div className="trend-heading"><span className="trend-icon wind"><CoastIcon name="wind"/></span><div><small>ON THIS BEACH</small><h3>{windName(spot.windDirection)}</h3></div><b>{spot.windSpeed} kt · gusts {spot.gusts}</b></div>
        <div className="wind-visual">
          <div className="wind-compass"><span>N</span><span>E</span><span>S</span><span>W</span><i style={{ transform: `rotate(${spot.windDirection}deg)` }}><b>↑</b></i><small>{spot.windDirection}°</small></div>
          <div className="wind-chart"><svg viewBox="0 0 420 116" preserveAspectRatio="none" role="img" aria-label="Wind and gust trend"><path d="M20 100H398"/><polyline className="gust-line" points={line("gusts")}/><polyline className="wind-line" points={line("windSpeed")}/>{points.map((point, index) => <circle key={point.time} cx={20 + index * 63} cy={100 - point.windSpeed / maxWind * 70} r="3.5"/>)}</svg><div>{points.map((point) => <span key={point.time}><b>{point.windSpeed} kt</b><small>{point.time}</small></span>)}</div><p><i/> Wind <i/> Gusts · arrows show direction changes</p></div>
        </div>
      </article>
    </section>
  );
}
