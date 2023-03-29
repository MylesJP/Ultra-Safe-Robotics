import React, { useState, useEffect } from "react";
import axios from "axios";

export default function EditRobot({
  robotToEdit,
  getData,
  handleShowEdit,
  checkboxData,
}) {
  const [editRobotCost, setEditRobotCost] = useState(robotToEdit["cost"]);
  const [editRobotDate, setEditRobotDate] = useState(robotToEdit["manufactured_date"].slice(0,10));
  const [editRobotSoftware, setEditRobotSoftware] = useState(
    robotToEdit["software_ids"] ? robotToEdit["software_ids"].split(",") : []
  );
  const [editRobotStatus, setEditRobotStatus] = useState(robotToEdit["status"]);

  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    const value = event.target.value;
    const editRobotSoftwareCopy = [...editRobotSoftware];

    if (isChecked) {
      editRobotSoftwareCopy.push(value);
    } else {
      const index = editRobotSoftwareCopy.indexOf(event.target.value);
      editRobotSoftwareCopy.splice(index, 1);
    }
    setEditRobotSoftware(editRobotSoftwareCopy);
  };

  // Edit a robot
  const onEditRobot = async (e) => {
    e.preventDefault();
    const robot_id = robotToEdit["robot_id"];
    const objectData = {
      cost: editRobotCost,
      manufactured_date: editRobotDate,
      software: editRobotSoftware,
      all_software: checkboxData,
      status: editRobotStatus,
    };
    await axios.put(
      `https://ultrasafe-robots.onrender.com/robots/${robot_id}`,
      objectData
    );
    getData();
    console.log("Edit successful");
    handleShowEdit();
  };

  return (
    <div>
      <form>
        <fieldset>
          <legend>Edit Robot</legend>
          <label htmlFor="robot_cost">Cost</label>
          <input
            type="number"
            name="robot_cost"
            defaultValue={robotToEdit.cost}
            onChange={(e) => setEditRobotCost(e.target.value)}
          />

          <label htmlFor="robot_date">Date</label>
          <input
            type="date"
            name="robot_date"
            defaultValue={robotToEdit.manufactured_date.slice(0,10)}
            onChange={(e) => setEditRobotDate(e.target.value)}
          />

          <label htmlFor="software_features">Software Packages</label>
          <div className="checkboxes">
            {checkboxData.map((software) => {
              return (
                <div key={software.software_id}>
                  <label>
                    <input
                      type="checkbox"
                      value={software.software_id}
                      defaultChecked={editRobotSoftware.includes(
                        software.software_id.toString()
                      )}
                      onChange={handleCheckboxChange}
                    />
                    {software.description}
                  </label>
                </div>
              );
            })}
          </div>

          <label htmlFor="status">Status</label>
          <div className="status">
            <select defaultValue={editRobotStatus} onChange={(e) => setEditRobotStatus(e.target.value)}>
              <option value="1">Active</option>
              <option value="0">Deactivated</option>
            </select>
          </div>

          <button type="submit" onClick={onEditRobot}>
            Save
          </button>
          <button onClick={handleShowEdit}>
            Cancel
          </button>
        </fieldset>
      </form>
    </div>
  );
}
