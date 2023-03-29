import React from "react";

export default function InvoiceFile({ invoice }) {
  return (
    <>
      <tr>
        <td>{invoice["invoice_id"]}</td>
        <td>{invoice["payment_terms"]}</td>
        <td>{invoice["customer_id"]}</td>
        <td>{invoice["total_amount"]}</td>
        <td>{invoice["invoice_date"].slice(0, 10)}</td>
      </tr>
    </>
  );
}
