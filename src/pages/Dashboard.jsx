import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (!role) {
      navigate("/");
      return;
    }

    if (role === "user") {
      navigate("/userdashboard");
    } else if (role === "creator") {
      navigate("/creatordashboard");
    }
  }, []);

  return null;
}

export default Dashboard;
