import { createContext, useContext, useState } from "react";
import axiosInstance from "../api/axiosinstance";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem("admin");

    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });

  // Admin Login
  const loginAdmin = async (email, password) => {
    try {
      const response = await axiosInstance.get("/admins", {
        params: {
          email,
          password,
        },
      });

      if (response.data.length === 0) {
        throw new Error("Invalid email or password");
      }

      const loggedAdmin = response.data[0];

      setAdmin(loggedAdmin);

      localStorage.setItem("admin", JSON.stringify(loggedAdmin));

      return loggedAdmin;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Admin login failed"
      );
    }
  };

  // Admin Logout
  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        loginAdmin,
        logoutAdmin,
        isAdminLoggedIn: !!admin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

// Custom Hook
export const useAdminAuth = () => {
  return useContext(AdminAuthContext);
};