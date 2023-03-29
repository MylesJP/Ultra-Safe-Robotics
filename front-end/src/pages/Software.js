import React, { useState, useEffect } from "react";
import axios from "axios";
import SoftwareFile from "../components/SoftwareFile";
import EditSoftware from "../components/EditSoftware";
import DOMPurify from "dompurify";

export default function Software() {
  const [allSoftware, setAllSoftware] = useState([]);
  const [newSoftwareCost, setnewSoftwareCost] = useState("");
  const [newSoftwareDesc, setnewSoftwareDesc] = useState("");
  const [softwareForEdit, setSoftwareForEdit] = useState({});
  const [showEdit, setShowEdit] = useState(""); // Set to false

  // Display all software
  const getData = async function () {
    const output = await axios.get("https://ultrasafe-robots.onrender.com/software");
    setAllSoftware(output["data"]);
  };

  // Add a software feature
  const makeNewSoftware = async (e) => {
    e.preventDefault();
    const objectData = {
      cost: newSoftwareCost,
      description: newSoftwareDesc,
    };
    await axios.post("https://ultrasafe-robots.onrender.com/software", objectData);
    getData();
    clearInput();
  };

  // Delete a software feature
  const onDeleteSoftware = async (_id) => {
    try {
      await axios.delete(`https://ultrasafe-robots.onrender.com/software/${_id}`);
      console.log("Delete successful");
      getData();
    } catch (error) {
      alert("Cannot delete software involved in sale.");
    }
  };

  // Clear input fields after submit
  const clearInput = async () => {
    setnewSoftwareCost("");
    setnewSoftwareDesc("");
  };

  const handleShowEdit = () => {
    setShowEdit(!showEdit);
  };

  // Loads the table on page load
  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h1>Software</h1>
      <p>
        View, add, update, and delete available software packages. Add software packages
        to Robots on the Robots page.
      </p>

      <table className="main_table">
        <thead>
          <tr>
            <th>Software ID</th>
            <th>Cost</th>
            <th>Description</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {allSoftware.map((software, i) => {
            return (
              <SoftwareFile
                key={i}
                software={software}
                onDeleteSoftware={onDeleteSoftware}
                setSoftwareForEdit={setSoftwareForEdit}
                handleShowEdit={handleShowEdit}
              />
            );
          })}
        </tbody>
      </table>

      <form>
        <fieldset>
          <legend>Add Software Feature</legend>
          <label htmlFor="software_cost">Cost</label>
          <input
            type="number"
            name="software_cost"
            onChange={(e) => setnewSoftwareCost(e.target.value)}
            value={newSoftwareCost}
          />

          <label htmlFor="software_desc">Description</label>
          <input
            type="text"
            name="software_desc"
            onChange={(e) => setnewSoftwareDesc(DOMPurify.sanitize(e.target.value))}
            value={newSoftwareDesc}
          />

          <button type="submit" onClick={makeNewSoftware}>
            Add Feature
          </button>
        </fieldset>
      </form>

      {showEdit && (
        <EditSoftware
          softwareForEdit={softwareForEdit}
          getData={getData}
          handleShowEdit={handleShowEdit}
        />
      )}
    </div>
  );
}
