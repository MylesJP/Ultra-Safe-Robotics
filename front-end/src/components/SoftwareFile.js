import { MdDelete, MdModeEdit } from "react-icons/md";

export default function SoftwareFile({
  software,
  onDeleteSoftware,
  setSoftwareForEdit,
  handleShowEdit,
}) {
  const formattedCost = software["cost"].toLocaleString("en-us");
  return (
    <>
      <tr>
        <td>{software["software_id"]}</td>
        <td>${formattedCost}</td>
        <td>{software["description"]}</td>
        <td>
          <MdModeEdit
            size="1.4rem"
            id="edit-button"
            title="Edit"
            onClick={() => {
              setSoftwareForEdit(software);
              handleShowEdit();
            }}
          />
        </td>
        <td>
        <MdDelete
            title="Delete"
            size="1.4rem"
            id="delete-button" onClick={() => onDeleteSoftware(software["software_id"])}/>
        </td>
      </tr>
    </>
  );
}
