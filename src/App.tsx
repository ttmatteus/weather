import { useEffect, useState } from 'react';
import type { WeatherInfo } from './models/Weather';
import PhoneShell from './components/PhoneShell';
import Weather from './components/Weather';

function App() {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [error] = useState<string | null>(null);

  // Exemplo: buscar dados fake só para buildar
  useEffect(() => {
    setWeather({
      name: 'Cidade', temp: 20, description: 'Céu limpo', humidity: 50, windSpeed: 10, icon: '01d', feelsLike: 20, tempMax: 25, tempMin: 15, hourly: [], daily: []
    });
  }, []);

  return (
    <PhoneShell>
      <Weather weather={weather} error={error} />
    </PhoneShell>
  );
}

export default App
