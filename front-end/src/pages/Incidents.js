import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import IncidentFile from "../components/IncidentFile";

export default function Incidents() {
  const [allIncidents, setAllIncidents] = useState([]);
  const [newIncidentRobotID, setnewIncidentRobotID] = useState("");
  const [newIncidentDesc, setnewIncidentDesc] = useState("");
  const [selectData, setselectData] = useState([]);
  const [selectedRobot, setselectedRobot] = useState("");


  // Display all incidents
  const getData = async function () {
    const output = await axios.get("https://ultrasafe-robots.onrender.com/incidents");
    setAllIncidents(output["data"]);
  };

  // Add an incident
  const makeNewIncident = async (e) => {
    e.preventDefault();
    const objectData = {
      robot_id: newIncidentRobotID,
      description: newIncidentDesc,
    };
    await axios.post("https://ultrasafe-robots.onrender.com/incidents", objectData);
    getData();
    clearInput();
  };

  // Populates the dropdown on component mount
  useEffect(() => {
    axios
      .get("https://ultrasafe-robots.onrender.com/robots")
      .then((response) => setselectData(response.data))
      .catch((error) => console.log(error));
  }, []);

  // Clear input fields after submit
  const clearInput = async () => {
    setnewIncidentRobotID("");
    setnewIncidentDesc("");
  };

  // Populate table on page load
  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h1>Incidents</h1>
      <p>Add and view incidents.</p>

      <table className="main_table">
        <thead>
          <tr>
            <th>Incident ID</th>
            <th>Robot ID</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {allIncidents.map((incident, i) => {
            return <IncidentFile key={i} incident={incident} />;
          })}
        </tbody>
      </table>

      <form>
        <fieldset>
        <legend>Add Incident</legend>
          <label htmlFor="robot_id">Robot ID</label>
          <select
            onChange={(e) => {
              setnewIncidentRobotID(e.target.value);
              console.log(e.target.value);
            }}
            value={selectedRobot.robot_id}
          >
            <option value="">Select a Robot</option>
            {selectData.map((robot) => (
              <option key={robot.robot_id} value={robot.robot_id}>
                {robot.robot_id}
              </option>
            ))}
          </select>

          <label htmlFor="incident_desc">Description</label>
          <input
            type="text"
            name="incident_desc"
            onChange={(e) => setnewIncidentDesc(e.target.value)}
            value={newIncidentDesc}
          />

          <button type="submit" onClick={makeNewIncident}>
            Add Incident
          </button>
        </fieldset>
      </form>
    </div>
  );
}
