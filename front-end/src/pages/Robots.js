import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import RobotFile from "../components/RobotFile";
import EditRobot from "../components/EditRobot";

export default function Robots() {
  const [allRobots, setAllRobots] = useState([]);
  const [newRobotCost, setNewRobotCost] = useState("");
  const [newRobotDate, setNewRobotDate] = useState(new Date().toISOString().slice(0, 10));
  const [newRobotSoftware, setnewRobotSoftware] = useState([]);
  const [newRobotStatus, setnewRobotStatus] = useState(1);
  const [checkboxData, setcheckboxData] = useState([]);
  const [robotToEdit, setRobotToEdit] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const [checkedStatus, setCheckedStatus] = useState({});

  // Display all robots
  const getData = async function () {
    const output = await axios.get("https://ultrasafe-robots.onrender.com/robots");
    setAllRobots(output["data"]);
  };

  // Add a robot
  const makeNewRobot = async (e) => {
    e.preventDefault();
    if (newRobotCost == 0 || newRobotCost == "") {
      alert("Invalid cost.")
      return
    }
    if (newRobotDate == "") {
      alert("Invalid date.")
      return
    }
    const objectData = {
      cost: newRobotCost,
      manufactured_date: newRobotDate,
      software: newRobotSoftware,
      status: newRobotStatus,
    };
    console.log(objectData);
    await axios
      .post("https://ultrasafe-robots.onrender.com/robots", objectData)
      .catch((error) => {
        console.log(error);
      });
    getData();
    clearInput();
  };

  // Delete a robot
  const onDeleteRobot = async (_id) => {
    try {
      await axios.delete(`https://ultrasafe-robots.onrender.com/robots/${_id}`);
      console.log(`Delete robot_id: ${_id} successful`);
      getData();
    } catch (error) {
      alert("Cannot delete robot involved in sale.");
    }
  };

  // Populates table and checkboxes on component mount
  useEffect(() => {
    getData();
    axios
      .get("https://ultrasafe-robots.onrender.com/software")
      .then((response) => setcheckboxData(response.data))
      .catch((error) => console.log(error));
  }, []);

  // Updates the checkbox after change
  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    const value = event.target.value;
    const newRobotSoftwareCopy = [...newRobotSoftware];
    if (isChecked) {
      newRobotSoftwareCopy.push(value);
    } else {
      const index = newRobotSoftwareCopy.indexOf(event.target.value);
      newRobotSoftwareCopy.splice(index, 1);
    }
    setnewRobotSoftware(newRobotSoftwareCopy);

    setCheckedStatus((prevStatus) => ({
      ...prevStatus,
      [value]: isChecked,
    }));
  };

  // Clear input fields after submit
  const clearInput = async () => {
    setNewRobotCost("");
    setNewRobotDate("");
    setnewRobotSoftware([]);
    setCheckedStatus({});
  };

  const handleShowEdit = () => {
    setShowEdit(!showEdit);
  };

  return (
    <div>
      <h1>Robots</h1>

      <p>Add a robot, delete a robot, or add/remove software features from robots.</p>

      <table className="main_table">
        <thead>
          <tr>
            <th>Robot ID</th>
            <th>Cost</th>
            <th>Manufactured Date</th>
            <th>Software Packages</th>
            <th>Status</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {allRobots.map((robot, i) => {
            return (
              <RobotFile
                key={i}
                robot={robot}
                onDeleteRobot={onDeleteRobot}
                setRobotToEdit={setRobotToEdit}
                handleShowEdit={handleShowEdit}
              />
            );
          })}
        </tbody>
      </table>

      <form className="add_robot_form">
        <fieldset>
          <legend>Add Robot</legend>
          <label htmlFor="robot_cost">Cost</label>
          <input
            type="number"
            name="robot_cost"
            min="0"
            onChange={(e) => setNewRobotCost(e.target.value)}
            value={newRobotCost}
          />
          <label htmlFor="date"> Manufactured Date</label>
          <input
            type="date"
            name="date"
            onChange={(e) => setNewRobotDate(e.target.value)}
            value={newRobotDate}
          />

          <label htmlFor="software_features">Software Packages</label>
          <div className="checkboxes">
            {checkboxData.map((software) => (
              <div key={software.software_id}>
                <input
                  type="checkbox"
                  value={software.software_id}
                  onChange={handleCheckboxChange}
                  checked={checkedStatus[software.software_id] || false}
                />
                {software.description}
              </div>
            ))}
          </div>

          <label htmlFor="status">Status</label>
          <div className="status">
            <select onChange={(e) => setnewRobotStatus(e.target.value)}>
              <option value="1">Active</option>
              <option value="0">Deactivated</option>
            </select>
          </div>

          <button type="submit" onClick={makeNewRobot}>
            Add Robot
          </button>
        </fieldset>
      </form>

      {showEdit && (
        <EditRobot
          robotToEdit={robotToEdit}
          getData={getData}
          handleShowEdit={handleShowEdit}
          checkboxData={checkboxData}
        />
      )}
    </div>
  );
}
