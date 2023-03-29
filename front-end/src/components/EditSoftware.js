import React, { useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";

export default function EditSoftware({ softwareForEdit, getData, handleShowEdit }) {
  const [editSoftwareCost, seteditSoftwareCost] = useState(softwareForEdit["cost"]);
  const [editSoftwareDesc, seteditSoftwareDesc] = useState(
    softwareForEdit["description"]
  );

  // Edit software
  const onEditSoftware = async (e) => {
    e.preventDefault();
    const software_id = softwareForEdit["software_id"];
    const objectData = {
      cost: editSoftwareCost,
      description: editSoftwareDesc,
    };
    await axios.put(
      `https://ultrasafe-robots.onrender.com/software/${software_id}`,
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
        <legend>Edit Software</legend>
          <label htmlFor="software_cost">Cost</label>
          <input
            type="number"
            name="software_cost"
            defaultValue={softwareForEdit.cost}
            onChange={(e) => seteditSoftwareCost(e.target.value)}
          />

          <label htmlFor="software_desc">Description</label>
          <input
            type="text"
            name="software_desc"
            defaultValue={softwareForEdit.description}
            onChange={(e) => seteditSoftwareDesc(DOMPurify.sanitize(e.target.value))}
          />

          <button type="submit" onClick={onEditSoftware}>Save</button>
          <button onClick={handleShowEdit}>Cancel</button>
        </fieldset>
      </form>
    </div>
  );
}
