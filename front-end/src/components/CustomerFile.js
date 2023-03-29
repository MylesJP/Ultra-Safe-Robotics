import { MdDelete, MdModeEdit } from "react-icons/md";

export default function CustomerFile({
  customer,
  onDeleteCustomer,
  setCustomerForEdit,
  handleShowEdit,
}) {
  return (
    <>
      <tr>
        <td>{customer["customer_id"]}</td>
        <td>{customer["f_name"]}</td>
        <td>{customer["l_name"]}</td>
        <td>{customer["email"]}</td>
        <td>{customer["phone"]}</td>
        <td>{customer["address"]}</td>
        <td>
          <MdModeEdit
            size="1.4rem"
            id="edit-button"
            title="Edit"
            onClick={() => {
              setCustomerForEdit(customer);
              handleShowEdit();
            }}
          />
        </td>
        <td>
          <MdDelete
            size="1.4rem"
            id="delete-button"
            title="Delete"
            onClick={() => onDeleteCustomer(customer["customer_id"])}
          />
        </td>
      </tr>
    </>
  );
}
