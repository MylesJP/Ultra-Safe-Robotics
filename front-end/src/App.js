import React from "react";
import { Routes, Route } from "react-router-dom";

// Import components
import Navigation from "./components/Navigation";

// Import pages
import Homepage from "./pages/Homepage";
import Customers from "./pages/Customers";
import Invoices from "./pages/Invoices";
import Incidents from "./pages/Incidents";
import Sales from "./pages/Sales";
import Software from "./pages/Software";
import Robots from "./pages/Robots";

function App() {
  return (
    <div className="App">
      <Navigation />
      <header className="App-header">
        <h1>Ultra-Safe Robotics Co.</h1>
        <p>Almost completely incident free!</p>
      </header>
      <main>
          <Routes>
            <Route exact path="/" element={<Homepage/>} />
            <Route path="/customers" element={<Customers/>} />
            <Route path="/invoices" element={<Invoices/>} />
            <Route path="/sales" element={<Sales/>} />
            <Route path="/software" element={<Software/>} />
            <Route path="/robots" element={<Robots/>} />
            <Route path="/incidents" element={<Incidents/>} />
          </Routes>
      </main>
    </div>
  );
}

export default App;
