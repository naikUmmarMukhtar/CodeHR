// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFromFirebase } from "../api/firebaseAPI";
import { useAuth } from "./useAuth";

export const useAdminData = () => {
  const { user, loading: authLoading } = useAuth();
  const [admin, setAdmin] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!user) {
        setLoading(false);
        navigate("/");
        return;
      }

      try {
        const admins = await getFromFirebase("/admins/");
        if (!admins) throw new Error("No admins found.");

        const [adminId, adminData] =
          Object.entries(admins).find(([, a]) => a.email === user.email) || [];

        if (!adminId || !adminData) {
          navigate("/");
          return;
        }

        setAdmin({
          id: adminId,
          username: adminData.username,
          email: adminData.email,
          createdAt: adminData.createdAt,
        });
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user]);

  return {
    admin,
    loading: loading || authLoading,
    error,
  };
};
