import React from "react";
import Logo1 from '../assets/Logo1.png'

export default function Homepage() {
  return (
    <div>
      <p id="homepage-text">
        Ultra-Safe Robotics Co. is a local robotics sales company that sells base robots
        and software upgrade packages that assist with all your day-to-day tasks. This
        database tracks customers, invoices, sales, robots and software sold, and any
        reported incidents involving alleged sentience.
      </p>

      <img src={Logo1} className="logo" alt="robot-logo" />

    </div>
  );
}
