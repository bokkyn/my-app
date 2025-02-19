import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "./styles.css";
import { Toaster } from "@/components/ui/sonner";
import OProjektu from "./pages/OProjektu";
import Tenable from "./pages/Tenable";
import Sidebar from "./components/Sidebar"; // Import the Sidebar component

const App = () => (
  <Router>
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto w-full md:ml-64 bg-white">
        <Routes>
          <Route path="/o-projektu" element={<OProjektu />} />
          <Route path="/" element={<Tenable />} />
          <Route path="/vjezba" element={<Vjezba />} />
        </Routes>
        <Toaster />
      </div>
    </div>
  </Router>
);

export default App;
