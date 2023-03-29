import React, { useState, useEffect } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import validator from "validator";

export default function EditCustomer({ customerForEdit, getData, handleShowEdit }) {
  const [editCustomerFName, setEditCustomerFName] = useState(customerForEdit["f_name"]);
  const [editCustomerLName, setEditCustomerLName] = useState(customerForEdit["l_name"]);
  const [editCustomerEmail, setEditCustomerEmail] = useState(customerForEdit["email"]);
  const [editCustomerPhone, setEditCustomerPhone] = useState(customerForEdit["phone"]);
  const [editCustomerAddress, setEditCustomerAddress] = useState(
    customerForEdit["address"]
  );

  // Edit a customer
  const onEditCustomer = async (e) => {
    e.preventDefault();
    if (editCustomerFName.length == 0){
      alert("First name required.")
      return
    }
    if (editCustomerLName.length == 0){
      alert("Last name required.")
      return
    }
    if (!validator.isEmail(editCustomerEmail)) {
      alert("Invalid email.");
      return;
    }
    if (editCustomerAddress.length == 0){
      alert("Address required.")
      return
    }
    const customer_id = customerForEdit["customer_id"];
    const objectData = {
      f_name: editCustomerFName,
      l_name: editCustomerLName,
      email: editCustomerEmail,
      phone: editCustomerPhone,
      address: editCustomerAddress,
    };
    await axios.put(
      `https://ultrasafe-robots.onrender.com/customers/${customer_id}`,
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
          <legend>Edit Customer</legend>
          <label htmlFor="customer_fname">First Name</label>
          <input
            required
            type="text"
            name="customer_fname"
            defaultValue={customerForEdit.f_name}
            onChange={(e) => setEditCustomerFName(DOMPurify.sanitize(e.target.value))}
          />

          <label htmlFor="customer_lname">Last Name</label>
          <input
            required
            type="text"
            name="customer_lname"
            defaultValue={customerForEdit.l_name}
            onChange={(e) => setEditCustomerLName(DOMPurify.sanitize(e.target.value))}
          />

          <label htmlFor="customer_email">Email</label>
          <input
            required
            type="text"
            name="customer_email"
            defaultValue={customerForEdit.email}
            onChange={(e) => setEditCustomerEmail(DOMPurify.sanitize(e.target.value))}
          />

          <label htmlFor="customer_phone">Phone</label>
          <input
            type="number"
            name="customer_phone"
            defaultValue={customerForEdit.phone}
            onChange={(e) => setEditCustomerPhone(DOMPurify.sanitize(e.target.value))}
          />

          <label htmlFor="customer_address">Address</label>
          <input
            required
            type="text"
            name="customer_address"
            defaultValue={customerForEdit.address}
            onChange={(e) => setEditCustomerAddress(DOMPurify.sanitize(e.target.value))}
          />

          <button type="submit" onClick={onEditCustomer}>
            Save
          </button>
          <button onClick={handleShowEdit}>Cancel</button>
        </fieldset>
      </form>
    </div>
  );
}
