-- SELECT Robots.robot_id, Robots.cost, Robots.manufactured_date, GROUP_CONCAT(Software_Features.description SEPARATOR', ') AS software_packages, Robots.status
--     FROM Robots
--     LEFT OUTER JOIN Robot_Has_Software_Features ON Robots.robot_id = Robot_Has_Software_Features.robot_id
--     LEFT OUTER JOIN Software_Features ON Robot_Has_Software_Features.software_id = Software_Features.software_id
--     GROUP BY (Robots.robot_id)
--     ORDER BY Robots.robot_id;

-- SELECT * FROM Robot_Has_Software_Features WHERE robot_id=5;
DELETE FROM Robot_Has_Software_Features WHERE robot_id=5 AND software_id=2;

-- SELECT software_id FROM Robot_Has_Software_Features WHERE robot_id=58;