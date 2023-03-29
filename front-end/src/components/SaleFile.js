export default function SaleFile({ sale }) {
  return (
    <>
      <tr>
        <td>{sale["sales_id"]}</td>
        <td>{sale["invoice_id"]}</td>
        <td>{sale["robot_id"]}</td>
        <td>{sale["software_id"]}</td>
      </tr>
    </>
  );
}
