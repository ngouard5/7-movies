
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Index from "./pages/Index";
import Game from "./pages/Game";
import HowToPlay from "./pages/HowToPlay";
import Results from "./pages/Results";
import PreGame from "./pages/PreGame";
import Countdown from "./pages/Countdown";
import NotFound from "./pages/NotFound";
import { Toaster } from "./components/ui/toaster";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="w-full min-h-screen">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/game" element={<Game />} />
            <Route path="/how-to-play" element={<HowToPlay />} />
            <Route path="/pre-game" element={<PreGame />} />
            <Route path="/results" element={<Results />} />
            <Route path="/countdown" element={<Countdown />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
