import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WeatherPage from "./pages/WeatherPage";
import RecordsPage from "./pages/RecordsPage";

export default function App() {
  const [tab, setTab] = useState("weather");

  return (
    <div>
      <Header tab={tab} setTab={setTab} />
      {tab === "weather" ? <WeatherPage /> : <RecordsPage />}
      <Footer />
    </div>
  );
}
