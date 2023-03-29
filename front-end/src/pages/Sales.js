import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import SaleFile from "../components/SaleFile";

export default function Sales() {
  const [allSales, setAllSales] = useState([]);
  const [newSaleInvoiceID, setnewSaleInvoiceID] = useState("");
  const [newSaleRobotID, setnewSaleRobotID] = useState("");
  const [newSaleSoftwareID, setnewSaleSoftwareID] = useState("");
  const [selectDataInvoice, setselectDataInvoice] = useState([]);
  const [selectedInvoice, setselectedInvoice] = useState("");
  const [selectDataRobot, setselectDataRobot] = useState([]);
  const [selectedRobot, setselectedRobot] = useState("");
  const [selectDataSoftware, setselectDataSoftware] = useState([]);
  const [selectedSoftware, setselectedSoftware] = useState("");

  // Display all sales
  const getData = async function () {
    const output = await axios.get("https://ultrasafe-robots.onrender.com/sales");
    setAllSales(output["data"]);
  };

  // Add a sale
  const makeNewSale = async (e) => {
    e.preventDefault();
    if (newSaleRobotID === '' && newSaleSoftwareID === ''){
      alert("Please select a Robot ID and/or Software ID.")
      return
    }
    if (newSaleRobotID === '') {
      setnewSaleRobotID("NULL")
    }
    const objectData = {
      invoice_id: newSaleInvoiceID,
      robot_id: newSaleRobotID,
      software_id: newSaleSoftwareID,
    };
    console.log(objectData)
    await axios.post("https://ultrasafe-robots.onrender.com/sales", objectData);
    getData();
    clearInput();
  };

  // Clear input fields after submit
  const clearInput = async () => {
    setnewSaleInvoiceID("");
    setnewSaleRobotID("");
    setnewSaleSoftwareID("");
  };

  // Loads the dropdowns with the available options
  useEffect(() => {
    getData();
    axios
      .get("https://ultrasafe-robots.onrender.com/invoices/")
      .then((response) => setselectDataInvoice(response.data))
      .catch((error) => console.log(error));
    axios
      .get("https://ultrasafe-robots.onrender.com/robots/")
      .then((response) => setselectDataRobot(response.data))
      .catch((error) => console.log(error));
    axios
      .get("https://ultrasafe-robots.onrender.com/software/")
      .then((response) => setselectDataSoftware(response.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <h1>Sales</h1>
      <p>Add and view sales. A sale can include a robot, a software package, or both.</p>

      <table className="main_table">
        <thead>
          <tr>
            <th>Sale ID</th>
            <th>Invoice ID</th>
            <th>Robot ID</th>
            <th>Software ID</th>
          </tr>
        </thead>
        <tbody>
          {allSales.map((sale, i) => {
            return <SaleFile key={i} sale={sale} />;
          })}
        </tbody>
      </table>

      <form>
        <fieldset>
        <legend>Add Sale</legend>
          <label htmlFor="invoice_id">Invoice ID</label>
          <select
            onChange={(e) => {
              setnewSaleInvoiceID(e.target.value);
              console.log(e.target.value);
            }}
            value={selectedInvoice.invoice_id}
          >
            <option value="">Select an Invoice</option>
            {selectDataInvoice.map((invoice) => (
              <option key={invoice.invoice_id} value={invoice.invoice_id}>
                {invoice.invoice_id}
              </option>
            ))}
          </select>

          <label htmlFor="robot_id">Robot ID</label>
          <select
            onChange={(e) => {
              setnewSaleRobotID(e.target.value);
              console.log(e.target.value);
            }}
            value={selectedRobot.robot_id}
          >
            <option value="">Select a Robot</option>
            {selectDataRobot.map((robot) => (
              <option key={robot.robot_id} value={robot.robot_id}>
                {robot.robot_id}
              </option>
            ))}
          </select>

          <label htmlFor="software_id">Software Package</label>
          <select
            onChange={(e) => {
              setnewSaleSoftwareID(e.target.value);
              console.log(e.target.value);
            }}
            value={selectedSoftware.software_id}
          >
            <option value="">Select Software</option>
            {selectDataSoftware.map((software) => (
              <option key={software.software_id} value={software.software_id}>
                {software.description}
              </option>
            ))}
          </select>

          <button type="submit" onClick={makeNewSale}>
            Add Sale
          </button>
        </fieldset>
      </form>
    </div>
  );
}
