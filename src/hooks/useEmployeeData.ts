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
        if (!teamData) throw new Error("No team members found.");
        console.log("teamData", teamData);

        const members = [];

        Object.entries(teamData).forEach(([teamId, team]) => {
          const userDetailsMap = team.userDetails || {};
          const attendanceMap = team.attendance || {};

          Object.entries(userDetailsMap).forEach(([detailId, userDetails]) => {
            const attendance = Object.entries(attendanceMap).flatMap(
              ([date, record]) => {
                // Handle case where record might be nested under another ID
                if (typeof record === "object" && !record.checkIn) {
                  return Object.values(record).map((r) => ({
                    date,
                    checkIn: r.checkIn || "--",
                    checkOut: r.checkOut || "--",
                    workDuration: r.workDuration || "00:00:00",
                    status: r.status || "Absent",
                    reason: r.reason || "",
                  }));
                }

                return [
                  {
                    date,
                    checkIn: record.checkIn || "--",
                    checkOut: record.checkOut || "--",
                    workDuration: record.workDuration || "00:00:00",
                    status: record.status || "Absent",
                    reason: record.reason || "",
                  },
                ];
              }
            );

            members.push({
              teamId,
              detailId,
              userDetails: { ...userDetails, role: "Employee" },
              attendance: attendance.reverse(),
            });
          });
        });

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

  return { teamMembers, loading, error };
};
