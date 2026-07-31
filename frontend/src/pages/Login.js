// frontend/src/pages/Login.js

// src/pages/Login.js

// import React, { useState } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// function Login() {
//   const [phone, setPhone] = useState("");
//   const [message, setMessage] = useState("");

//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     try {
//       const res = await axios.post("http://localhost:5000/api/login", {
//         phone,
//       });

//       const user = res.data.user;

//       // Save user in global auth context
//       login(user);

//       // Redirect to role selection page after login
//       navigate("/select-role");

//     } catch (err) {
//       setMessage(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Enter phone number"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//           required
//         />
//         <button type="submit">Login</button>
//       </form>

//       {message && <p>{message}</p>}
//     </div>
//   );
// }

// export default Login;



// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const [phone, setPhone] = useState('');
//   const navigate = useNavigate();

// const handleLogin = async () => {
//   try {
//     const res = await axios.post(
//       'http://localhost:5000/api/login',
//       { phone }
//     );

//     // ✅ backend returns user directly
//     localStorage.setItem('user', JSON.stringify(res.data));

//     navigate('/select-role');
//   } catch (err) {
//     alert(err.response?.data?.message || 'User not found');
//   }
// };




//   return (
//     <div style={{ textAlign: 'center', marginTop: '80px' }}>
//       <h2>Login</h2>
//       <input
//         placeholder="Phone number"
//         value={phone}
//         onChange={(e) => setPhone(e.target.value)}
//       />
//       <br /><br />
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// };

// export default Login;

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const [phone, setPhone] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const res = await axios.post(
//         'http://localhost:5000/api/login',
//         { phone }
//       );

//       // 🔐 Store ONE clean user object
//       localStorage.setItem('user', JSON.stringify(res.data.user));

//       navigate('/select-role');
//     } catch (err) {
//       alert(err.response?.data?.message || 'User not found');
//     }
//   };

//   return (
//     <div style={{ textAlign: 'center', marginTop: '80px' }}>
//       <h2>Login</h2>
//       <input
//         placeholder="Phone number"
//         value={phone}
//         onChange={(e) => setPhone(e.target.value)}
//       />
//       <br /><br />
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// };

// export default Login;






// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {

//   const [phone, setPhone] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async () => {

//     try {

//       const res = await axios.post(
//         'http://localhost:5000/api/login',
//         { phone }
//       );

//       // ✅ get user correctly
//       const user = res.data;

// localStorage.setItem("user", JSON.stringify(user));

// // 🔥 FIX HERE
// if (user.role.includes("admin")) {
//   navigate("/admin");
// } else {
//   navigate("/select-role");
// }

//     } catch (err) {

//       alert(err.response?.data?.message || 'User not found');

//     }

//   };

//   return (
//     <div style={{ textAlign: 'center', marginTop: '80px' }}>
//       <h2>Login</h2>

//       <input
//         placeholder="Phone number"
//         value={phone}
//         onChange={(e) => setPhone(e.target.value)}
//       />

//       <br /><br />

//       <button onClick={handleLogin}>
//         Login
//       </button>

//     </div>
//   );
// };

// export default Login;





import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/api";
import "./Login.css";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    const cleanedPhone = phone.replace(/\D/g, "");

    if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
      alert("Enter a valid 10-digit Indian mobile number");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/login", {
        phone: cleanedPhone,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (
        Array.isArray(user.role) &&
        user.role.includes("admin")
      ) {
        navigate("/admin");
      } else {
        navigate("/select-role");
      }
    } catch (error) {
      console.error("Login error:", error);

      alert(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">LC</div>

          <div>
            <h1>LifeChain</h1>
            <p>Community help, connected quickly.</p>
          </div>
        </div>

        <div className="login-heading">
          <h2>Welcome back</h2>
          <p>Enter your registered phone number.</p>
        </div>

        <form onSubmit={handleLogin}>
          <label htmlFor="phone">
            Phone number
          </label>

          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            placeholder="Enter 10-digit mobile number"
            value={phone}
            maxLength={10}
            onChange={(event) => {
              const digitsOnly = event.target.value
                .replace(/\D/g, "")
                .slice(0, 10);

              setPhone(digitsOnly);
            }}
            autoComplete="tel"
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-note">
          New to LifeChain? Register from the home page.
        </p>
      </div>
    </div>
  );
};

export default Login;