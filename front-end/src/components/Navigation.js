import React from "react";
import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <div className="App-nav">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/customers">Customers</Link>
        <Link to="/invoices">Invoices</Link>
        <Link to="/sales">Sales</Link>
        <Link to="/software">Software</Link>
        <Link to="/robots">Robots</Link>
        <Link to="/incidents">Incidents</Link>
      </nav>
    </div>
  );
}
