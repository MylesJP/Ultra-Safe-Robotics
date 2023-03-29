import React from 'react'

export default function IncidentFile({incident}) {
    return (
        <>
          <tr>
            <td>{incident["incident_id"]}</td>
            <td>{incident["robot_id"]}</td>
            <td>{incident["description"]}</td>
          </tr>
        </>
      );
}
