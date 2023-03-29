import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomerFile from "../components/CustomerFile";
import EditCustomer from "../components/EditCustomer";
import SearchBar from "../components/SearchBar";
import DOMPurify from "dompurify";
import validator from "validator";

export default function Customers() {
  const [allCustomers, setAllCustomers] = useState([]);
  const [newCustomerFName, setnewCustomerFName] = useState("");
  const [newCustomerLName, setnewCustomerLName] = useState("");
  const [newCustomerEmail, setnewCustomerEmail] = useState("");
  const [newCustomerPhone, setnewCustomerPhone] = useState("");
  const [newCustomerAddress, setnewCustomerAddress] = useState("");
  const [customerForEdit, setCustomerForEdit] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [showEdit, setShowEdit] = useState(false);

  // Display all customers
  const getData = async function () {
    const output = await axios.get("https://ultrasafe-robots.onrender.com/customers");
    setAllCustomers(output["data"]);
  };

  // Add a customer
  const makeNewCustomer = async (e) => {
    e.preventDefault();
    if (newCustomerFName.length == 0){
      alert("First name required.")
      return
    }
    if (newCustomerLName.length == 0){
      alert("Last name required.")
      return
    }
    if (!validator.isEmail(newCustomerEmail)) {
      alert("Invalid email.");
      return;
    }
    if (newCustomerAddress.length == 0){
      alert("Address required.")
      return
    }
    const objectData = {
      f_name: newCustomerFName,
      l_name: newCustomerLName,
      email: newCustomerEmail,
      phone: newCustomerPhone,
      address: newCustomerAddress,
    };
    await axios.post("https://ultrasafe-robots.onrender.com/customers", objectData);
    getData();
    clearInput();
  };

  // Delete a customer
  const onDeleteCustomer = async (_id) => {
    await axios
      .delete(`https://ultrasafe-robots.onrender.com/customers/${_id}`)
      .then(() => {
        console.log("Delete successful");
      })
      .catch((error) => {
        alert("Cannot delete customer on invoice");
      });
    getData();
  };

  // Search bar management
  const handleInputChange = (event) => {
    setSearchValue(DOMPurify.sanitize(event.target.value));
  };

  const handleSearch = async () => {
    const filtered = await axios.get(
      `https://ultrasafe-robots.onrender.com/customers/search/${searchValue}`
    );
    setAllCustomers(filtered["data"]);
    handleSearchClear();
  };

  const resetSearch = () => {
    getData();
  };

  const handleSearchClear = () => {
    setSearchValue("");
  };

  // Clear input fields after submit
  const clearInput = async () => {
    setnewCustomerFName("");
    setnewCustomerLName("");
    setnewCustomerEmail("");
    setnewCustomerPhone("");
    setnewCustomerAddress("");
  };

  const handleShowEdit = () => {
    setShowEdit(!showEdit);
  };

  // Load table on page load
  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h1>Customers</h1>
      <p>Add, edit, delete, or search for a customer. All fields except Phone are required.</p>

      <SearchBar
        searchValue={searchValue}
        handleInputChange={handleInputChange}
        handleSearch={handleSearch}
        handleSearchClear={handleSearchClear}
        resetSearch={resetSearch}
      />

      <table className="main_table">
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {allCustomers.map((customer, i) => {
            return (
              <CustomerFile
                key={i}
                customer={customer}
                onDeleteCustomer={onDeleteCustomer}
                setCustomerForEdit={setCustomerForEdit}
                handleShowEdit={handleShowEdit}
              />
            );
          })}
        </tbody>
      </table>

      <form>
        <fieldset>
          <legend>Add Customer</legend>
          <label htmlFor="customer_fname">First Name</label>
          <input
            required
            type="text"
            name="customer_fname"
            onChange={(e) => setnewCustomerFName(DOMPurify.sanitize(e.target.value))}
            value={newCustomerFName}
          />

          <label htmlFor="customer_lname">Last Name</label>
          <input
            required
            type="text"
            name="customer_lname"
            onChange={(e) => setnewCustomerLName(DOMPurify.sanitize(e.target.value))}
            value={newCustomerLName}
          />

          <label htmlFor="customer_email">Email</label>
          <input
            required
            type="text"
            name="customer_email"
            onChange={(e) => setnewCustomerEmail(DOMPurify.sanitize(e.target.value))}
            value={newCustomerEmail}
          />

          <label htmlFor="customer_phone">Phone</label>
          <input
            type="number"
            name="customer_phone"
            onChange={(e) => setnewCustomerPhone(DOMPurify.sanitize(e.target.value))}
            value={newCustomerPhone}
          />

          <label htmlFor="customer_address">Address</label>
          <input
            required
            type="text"
            name="customer_address"
            onChange={(e) => setnewCustomerAddress(DOMPurify.sanitize(e.target.value))}
            value={newCustomerAddress}
          />

          <button type="submit" onClick={makeNewCustomer}>
            Add Customer
          </button>
        </fieldset>
      </form>

      {showEdit && (
        <EditCustomer
          customerForEdit={customerForEdit}
          getData={getData}
          handleShowEdit={handleShowEdit}
        />
      )}
    </div>
  );
}
