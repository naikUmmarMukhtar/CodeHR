// @ts-nocheck
import { useEffect, useState } from "react";
import { getFromFirebase } from "../api/firebaseAPI";

export const useEmployeesData = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const teamData = await getFromFirebase("/teammembers/");
        const adminData = await getFromFirebase("/admins/");

        if (!teamData && !adminData)
          throw new Error("No team members or admins found.");

        const members = [];

        if (teamData) {
          Object.entries(teamData).forEach(([teamId, team]) => {
            const userDetailsMap = team.userDetails || {};
            const attendanceMap = team.attendance || {};

            Object.entries(userDetailsMap).forEach(
              ([detailId, userDetails]) => {
                const attendance = Object.entries(attendanceMap).map(
                  ([date, record]) => ({
                    date,
                    checkIn: record.checkIn || "--",
                    checkOut: record.checkOut || "--",
                    workDuration: record.workDuration || "00:00:00",
                    status: record.status || "Absent",
                    reason: record.reason || "",
                  })
                );

                members.push({
                  teamId,
                  detailId,
                  userDetails: { ...userDetails, role: "Employee" },
                  attendance: attendance.reverse(),
                });
              }
            );
          });
        }

        setTeamMembers(members);
      } catch (err) {
        console.error("Error fetching members:", err);
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  return {
    teamMembers,
    loading,
    error,
  };
};
