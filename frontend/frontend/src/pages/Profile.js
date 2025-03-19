import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../api/authApi";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserProfile()
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {user ? (
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">Profiel</h2>
          <p><strong>Naam:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button
            className="mt-4 bg-red-500 text-white p-2 rounded"
            onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}
          >
            Uitloggen
          </button>
        </div>
      ) : (
        <p>Laden...</p>
      )}
    </div>
  );
};

export default Profile;
