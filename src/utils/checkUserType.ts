// @ts-nocheck

import { getFromFirebase } from "../api/firebaseAPI";

// 🔹 Check if email belongs to an Admin
export const checkIfAdmin = async (email: string) => {
  console.log(email, "email");

  const admins = await getFromFirebase("/admins");
  console.log(admins, "admins data");
  return (
    admins &&
    Object.values(admins).some(
      (admin: any) => admin?.email?.toLowerCase() === email?.toLowerCase()
    )
  );
};

// 🔹 Check if email belongs to an Employee
export const checkIfEmployee = async (email: string) => {
  const employees = await getFromFirebase("/teammembers");
  console.log(employees, "employees data");

  return (
    employees &&
    Object.values(employees).some((emp: any) => {
      // handle nested userDetails object
      const details = emp?.userDetails
        ? Object.values(emp.userDetails)[0]
        : null;

      return details?.email?.toLowerCase() === email?.toLowerCase();
    })
  );
};
