import { useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser({ email, password });
      navigate("/profile");
    } catch (error) {
      alert("Fout bij inloggen: " + (error.response?.data?.message || "Onbekende fout"));
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Inloggen</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="E-mail" className="w-full p-2 border rounded mb-2"
            onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Wachtwoord" className="w-full p-2 border rounded mb-2"
            onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full bg-blue-500 text-white p-2 rounded">Inloggen</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
