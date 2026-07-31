// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function Register() {
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     latitude: '',
//     longitude: '',
//   });

//   const [role, setRole] = useState('requester');

//   // 🌍 Auto-fetch location on page load
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setFormData((prev) => ({
//             ...prev,
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           }));
//         },
//         (error) => {
//           console.error("Error getting location: ", error);
//           alert("Please allow location access to continue.");
//         }
//       );
//     } else {
//       alert("Geolocation is not supported by this browser.");
//     }
//   }, []);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/api/register', {
//         ...formData,
//         role: role,
//       });
//       alert(`${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully!`);
//       console.log(response.data);
//     } catch (error) {
//       console.error(error);
//       alert('Registration failed.');
//     }
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Registration</h2>

//       {/* Role Switch Buttons */}
//       <div style={{ marginBottom: '20px' }}>
//         <button
//           onClick={() => setRole('requester')}
//           style={{
//             marginRight: '10px',
//             padding: '10px',
//             backgroundColor: role === 'requester' ? '#d6bbfc' : '#f0f0f0',
//           }}
//         >
//           Register as Requester
//         </button>
//         <button
//           onClick={() => setRole('responder')}
//           style={{
//             padding: '10px',
//             backgroundColor: role === 'responder' ? '#d6bbfc' : '#f0f0f0',
//           }}
//         >
//           Register as Responder
//         </button>
//       </div>

//       {/* Common Registration Form */}
//       <form onSubmit={handleSubmit}>
//         <input
//           name="name"
//           placeholder="Name"
//           onChange={handleChange}
//           value={formData.name}
//           required
//         />
//         <input
//           name="phone"
//           placeholder="Phone Number"
//           onChange={handleChange}
//           value={formData.phone}
//           required
//         />
//         <input
//           name="latitude"
//           placeholder="Latitude"
//           value={formData.latitude}
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="longitude"
//           placeholder="Longitude"
//           value={formData.longitude}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit">Register</button>
//       </form>
//     </div>
//   );
// }

// export default Register;










// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import api from "../api/api";

// const Register = () => {
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleRegister = async (event) => {
//     event.preventDefault();

//     const cleanedName = name.trim();
//     const cleanedPhone = phone.replace(/\D/g, "");

//     if (
//       !/^[\p{L}][\p{L}\s.'-]{1,49}$/u.test(cleanedName)
//     ) {
//       alert(
//         "Enter a valid name using letters only, between 2 and 50 characters"
//       );
//       return;
//     }

//     if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
//       alert("Enter a valid 10-digit Indian mobile number");
//       return;
//     }

//     if (!navigator.geolocation) {
//       alert("Geolocation is not supported by this browser");
//       return;
//     }

//     setLoading(true);

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         try {
//           const response = await api.post(
//             "/users/register",
//             {
//               name: cleanedName,
//               phone: cleanedPhone,
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//             }
//           );

//           alert(
//             response.data.message ||
//               "Registration successful"
//           );

//           navigate("/login");
//         } catch (error) {
//           console.error("Registration error:", error);

//           alert(
//             error.response?.data?.message ||
//               "Registration failed"
//           );
//         } finally {
//           setLoading(false);
//         }
//       },
//       (error) => {
//         console.error("Location error:", error);
//         setLoading(false);

//         if (error.code === error.PERMISSION_DENIED) {
//           alert(
//             "Please allow location access to register"
//           );
//           return;
//         }

//         if (error.code === error.POSITION_UNAVAILABLE) {
//           alert("Location is currently unavailable");
//           return;
//         }

//         if (error.code === error.TIMEOUT) {
//           alert("Location request timed out");
//           return;
//         }

//         alert("Unable to detect your location");
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 0,
//       }
//     );
//   };

//   return (
//     <div
//       style={{
//         textAlign: "center",
//         marginTop: "80px",
//       }}
//     >
//       <h2>Register</h2>

//       <form onSubmit={handleRegister}>
//         <input
//           type="text"
//           placeholder="Enter your name"
//           value={name}
//           maxLength={50}
//           onChange={(event) => {
//             const validCharacters =
//               event.target.value.replace(
//                 /[^\p{L}\s.'-]/gu,
//                 ""
//               );

//             setName(validCharacters);
//           }}
//           autoComplete="name"
//           required
//         />

//         <br />
//         <br />

//         <input
//           type="tel"
//           inputMode="numeric"
//           placeholder="Enter 10-digit mobile number"
//           value={phone}
//           maxLength={10}
//           onChange={(event) => {
//             const digitsOnly = event.target.value
//               .replace(/\D/g, "")
//               .slice(0, 10);

//             setPhone(digitsOnly);
//           }}
//           autoComplete="tel"
//           required
//         />

//         <br />
//         <br />

//         <button
//           type="submit"
//           disabled={loading}
//         >
//           {loading
//             ? "Registering..."
//             : "Register"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Register;















import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/api";
import "./Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async event => {
    event.preventDefault();

    const cleanedName = name.trim();
    const cleanedPhone = phone.replace(/\D/g, "");

    if (
      !/^[\p{L}][\p{L}\s.'-]{1,49}$/u.test(
        cleanedName
      )
    ) {
      alert(
        "Enter a valid name using letters only, between 2 and 50 characters"
      );

      return;
    }

    if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
      alert(
        "Enter a valid 10-digit Indian mobile number"
      );

      return;
    }

    if (!navigator.geolocation) {
      alert(
        "Geolocation is not supported by this browser"
      );

      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async position => {
        try {
          const response = await api.post(
            "/users/register",
            {
              name: cleanedName,
              phone: cleanedPhone,
              latitude:
                position.coords.latitude,
              longitude:
                position.coords.longitude
            }
          );

          alert(
            response.data.message ||
              "Registration successful"
          );

          navigate("/login");
        } catch (error) {
          alert(
            error.response?.data?.message ||
              "Registration failed"
          );
        } finally {
          setLoading(false);
        }
      },
      error => {
        setLoading(false);

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          alert(
            "Please allow location access to register"
          );

          return;
        }

        if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          alert(
            "Location is currently unavailable"
          );

          return;
        }

        if (error.code === error.TIMEOUT) {
          alert("Location request timed out");

          return;
        }

        alert(
          "Unable to detect your location"
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  return (
    <main className="register-page">
      <section className="register-information">
        <span className="register-label">
          Join the LifeChain network
        </span>

        <h1>
          Help others and request help using one
          account.
        </h1>

        <p>
          Your location is used to connect you with
          people and requests within a five-kilometre
          radius.
        </p>

        <div className="registration-benefits">
          <div>
            <span>✓</span>
            <p>Automatic nearby matching</p>
          </div>

          <div>
            <span>✓</span>
            <p>Requester and responder access</p>
          </div>

          <div>
            <span>✓</span>
            <p>Request progress notifications</p>
          </div>
        </div>
      </section>

      <section className="register-card">
        <div className="register-card-heading">
          <span className="register-card-logo">
            LC
          </span>

          <div>
            <h2>Create your account</h2>
            <p>It only takes a moment.</p>
          </div>
        </div>

        <form onSubmit={handleRegister}>
          <label htmlFor="register-name">
            Full name
          </label>

          <input
            id="register-name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            maxLength={50}
            onChange={event => {
              const validCharacters =
                event.target.value.replace(
                  /[^\p{L}\s.'-]/gu,
                  ""
                );

              setName(validCharacters);
            }}
            autoComplete="name"
            required
          />

          <small>
            Letters and spaces only.
          </small>

          <label htmlFor="register-phone">
            Mobile number
          </label>

          <input
            id="register-phone"
            type="tel"
            inputMode="numeric"
            placeholder="10-digit Indian mobile number"
            value={phone}
            maxLength={10}
            onChange={event => {
              const digitsOnly =
                event.target.value
                  .replace(/\D/g, "")
                  .slice(0, 10);

              setPhone(digitsOnly);
            }}
            autoComplete="tel"
            required
          />

          <small>
            Location permission will be requested
            during registration.
          </small>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Detecting location and registering..."
              : "Create Account"}
          </button>
        </form>

        <p className="register-login-link">
          Already registered?{" "}
          <Link to="/login">Login here</Link>
        </p>
      </section>
    </main>
  );
};

export default Register;