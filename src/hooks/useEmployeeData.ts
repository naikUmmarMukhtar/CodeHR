// @ts-nocheck
import { useEffect, useState } from "react";
import { getFromFirebase } from "../api/firebaseAPI";

/**
 * Fetches all team members and their attendance.
 */
export const useEmployeesData = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const data = await getFromFirebase("/teammembers/");
        if (!data) throw new Error("No team members found.");

        const members = [];

        Object.entries(data).forEach(([teamId, teamData]) => {
          const userDetailsMap = teamData.userDetails || {};
          const attendanceMap = teamData.attendance || {};

          Object.entries(userDetailsMap).forEach(([detailId, userDetails]) => {
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
              userDetails,
              attendance: attendance.reverse(),
            });
          });
        });

        setTeamMembers(members);
      } catch (err) {
        console.error("Error fetching team members:", err);
        setError(err.message || "Failed to fetch team members.");
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
