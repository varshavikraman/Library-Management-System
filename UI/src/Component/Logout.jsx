import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Logged-out successful");

        navigate("/", { replace: true });
      } else {
        toast.error("Failed to sign out");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return <p>Logging out...</p>;
};

export default Logout;
