import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import InvoiceFile from "../components/InvoiceFile";
import DOMPurify from 'dompurify'

export default function Invoices() {
  const [allInvoices, setAllInvoices] = useState([]);
  const [newInvoicePayTerms, setnewInvoicePayTerms] = useState("");
  const [newInvoiceCustomerID, setnewInvoiceCustomerID] = useState("");
  const [newInvoiceTotalAmount, setnewInvoiceTotalAmount] = useState("");
  const [newInvoiceDate, setnewInvoiceDate] = useState("");
  const [selectData, setselectData] = useState([]);
  const [selectedCustomer, setselectedCustomer] = useState("");

  // Display all invoices
  const getData = async function () {
    const output = await axios.get("https://ultrasafe-robots.onrender.com/invoices");
    setAllInvoices(output["data"]);
  };

  // Add an invoice
  const makeNewInvoice = async (e) => {
    e.preventDefault();
    const objectData = {
      payment_terms: newInvoicePayTerms,
      customer_id: newInvoiceCustomerID,
      total_amount: newInvoiceTotalAmount,
      invoice_date: newInvoiceDate,
    };
    console.log(objectData);
    await axios.post("https://ultrasafe-robots.onrender.com/invoices", objectData);
    getData();
    clearInput();
  };

  // Clear input fields after submit
  const clearInput = async () => {
    setnewInvoicePayTerms("");
    setnewInvoiceCustomerID("");
    setnewInvoiceTotalAmount("");
    setnewInvoiceDate("");
  };

  // Populates table and dropdown on component mount
  useEffect(() => {
    getData();
    axios
      .get("https://ultrasafe-robots.onrender.com/invoices/customers")
      .then((response) => setselectData(response.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <h1>Invoices</h1>
      <p>Add and view invoices.</p>

      <table className="main_table">
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Payment Terms</th>
            <th>Customer ID</th>
            <th>Total Amount</th>
            <th>Invoice Date</th>
          </tr>
        </thead>
        <tbody>
          {allInvoices.map((invoice, i) => {
            return <InvoiceFile key={i} invoice={invoice} />;
          })}
        </tbody>
      </table>

      <form>
        <fieldset>
        <legend>Add Invoice</legend>
          <label htmlFor="pay_terms">Payment Terms</label>
          <select
            value={newInvoicePayTerms}
            onChange={(e) => setnewInvoicePayTerms(e.target.value)}
          >
            <option>Payment Terms</option>
            <option>NET10</option>
            <option>NET30</option>
            <option>NET90</option>
            <option>PIA</option>
          </select>

          <label htmlFor="cust_id">Customer</label>
          <select
            onChange={(e) => {
              setnewInvoiceCustomerID(e.target.value);
              console.log(e.target.value);
            }}
            value={selectedCustomer.customer_id}
          >
            <option value="">Select a Customer</option>
            {selectData.map((customer) => (
              <option key={customer.customer_id} value={customer.customer_id}>
                {customer.customer_id} {customer.full_name}
              </option>
            ))}
          </select>

          <label htmlFor="total_amount">Total Amount</label>
          <input
            type="number"
            name="total_amount"
            onChange={(e) => setnewInvoiceTotalAmount(e.target.value)}
            value={newInvoiceTotalAmount}
          />

          <label htmlFor="invoice_date">Invoice Date</label>
          <input
            type="date"
            name="invoice_date"
            onChange={(e) => setnewInvoiceDate(e.target.value)}
            value={newInvoiceDate}
          />

          <button type="submit" onClick={makeNewInvoice}>
            Add Invoice
          </button>
        </fieldset>
      </form>
    </div>
  );
}
