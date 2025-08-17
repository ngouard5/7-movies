
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Index from "./pages/Index";
import Game from "./pages/Game";
import HowToPlay from "./pages/HowToPlay";
import Results from "./pages/Results";
import PreGame from "./pages/PreGame";
import Countdown from "./pages/Countdown";
import Stats from "./pages/Stats";
import NotFound from "./pages/NotFound";
import { Toaster } from "./components/ui/toaster";
import { LanguageProvider } from "./contexts/LanguageContext";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="w-full min-h-screen">
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/game" element={<Game />} />
            <Route path="/how-to-play" element={<HowToPlay />} />
            <Route path="/pre-game" element={<PreGame />} />
            <Route path="/results" element={<Results />} />
            <Route path="/countdown" element={<Countdown />} />
            <Route path="/admin/stats" element={<Stats />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
