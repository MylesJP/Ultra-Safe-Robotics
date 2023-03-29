import { MdDelete, MdModeEdit } from "react-icons/md";
import moment from "moment";

function RobotFile({ robot, onDeleteRobot, setRobotToEdit, handleShowEdit }) {
  const robotName = `Robot_${String(robot["robot_id"]).padStart(3, "0")}`;
  const formattedCost = robot["cost"].toLocaleString("en-us");
  const formattedDate = moment(robot["manufactured_date"]).format("MM/DD/YYYY");
  const status = robot["status"] === 1 ? "Active" : "Deactivated";
  return (
    <>
      <tr>
        <td>{robotName}</td>
        <td>${formattedCost}</td>
        <td>{formattedDate}</td>
        <td>{robot["software_packages"]}</td>
        <td>{status}</td>
        <td>
          <MdModeEdit
            size="1.4rem"
            id="edit-button"
            title="Edit"
            onClick={() => {
              setRobotToEdit(robot);
              handleShowEdit();
            }}
          />
        </td>
        <td>
          <MdDelete
            title="Delete"
            size="1.4rem"
            id="delete-button"
            onClick={() => onDeleteRobot(robot["robot_id"])}
          />
        </td>
      </tr>
    </>
  );
}

export default RobotFile;
