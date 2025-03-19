import { useState } from "react";
import { registerUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [userData, setUserData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(userData);
      alert("Registratie succesvol! Je kunt nu inloggen.");
      navigate("/login");
    } catch (error) {
      alert("Fout bij registreren: " + (error.response?.data?.message || "Onbekende fout"));
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Registreren</h2>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Naam" className="w-full p-2 border rounded mb-2" 
            onChange={(e) => setUserData({ ...userData, name: e.target.value })} />
          <input type="email" placeholder="E-mail" className="w-full p-2 border rounded mb-2"
            onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
          <input type="password" placeholder="Wachtwoord" className="w-full p-2 border rounded mb-2"
            onChange={(e) => setUserData({ ...userData, password: e.target.value })} />
          <button className="w-full bg-green-500 text-white p-2 rounded">Registreren</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
