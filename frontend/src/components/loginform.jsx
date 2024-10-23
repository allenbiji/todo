import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./axios";

const LoginBox = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Both fields are required.");
      return;
    }

    setError("");
    setLoading(true);

    console.log("Username:", username);
    console.log("Password:", password);

    try {
      console.log("reached fronted api");
      const response = await api.post("/auth/login", {
        username,
        password,
      });
      console.log("inside try");
      if (response.status === 200 && response.data.token) {
        localStorage.setItem("token", response.data.token);

        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;

        console.log("Login successful");
        navigate("/mainpage", { state: { userId: username } });
        setUsername("");
        setPassword("");
      } else {
        setError("Authentication failed.");
      }
    } catch (error) {
      setError("An error occurred while trying to log in.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-sm shadow-md w-80"
      >
        <h2 className="text-2xl font-bold text-cyan-400 mb-7 mt-5 text-center">
          Login
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <label htmlFor="username" className="block text-black-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Enter username"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-400 font-medium text-white p-2 mt-6 rounded-md hover:bg-cyan-700 transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default LoginBox;
