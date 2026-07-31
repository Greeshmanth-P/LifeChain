// // src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import RoleSelection from './pages/RoleSelection';
// import Register from './pages/Register';
// import RequesterRegister from './pages/RequesterRegister';
// import ResponderRegister from './pages/ResponderRegister';
// import HelpRequest from './pages/HelpRequest';
// import Notifications from './pages/Notifications';
// import Home from './pages/Home';

// function App() {
//   return (
//     <Router>
//       <div style={{ padding: '10px', backgroundColor: '#f5f5f5' }}>
//         <nav style={{ marginBottom: '20px' }}>
//           <Link to="/" style={{ marginRight: '20px' }}>Home</Link>
//           <Link to="/register/requester" style={{ marginRight: '20px' }}>Register</Link>
//           <Link to="/help" style={{ marginRight: '20px' }}>Help Request</Link>
//           <Link to="/notifications">Notifications</Link>
//         </nav>

//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/" element={<RoleSelection />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/register/requester" element={<RequesterRegister />} />
//           <Route path="/register/responder" element={<ResponderRegister />} />
//           <Route path="/help" element={<HelpRequest />} />
//           <Route path="/notifications" element={<Notifications />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
// src/App.js
// frontend/src/App.js
// src/App.js
// src/App.js

// import React from 'react';
// import { Routes, Route, Link } from 'react-router-dom';

// import RoleSelection from './pages/RoleSelection';
// import RequesterRegister from './pages/RequesterRegister';
// import ResponderRegister from './pages/ResponderRegister';
// import HelpRequest from './pages/HelpRequest';
// import Notifications from './pages/Notifications';
// import Home from './pages/Home';
// import Login from './pages/Login';

// function App() {
//   return (
//     <div style={{ padding: '10px', backgroundColor: '#f5f5f5' }}>
//       <nav style={{ marginBottom: '20px' }}>
//         <Link to="/" style={{ marginRight: '20px' }}>Register</Link>
//         <Link to="/home" style={{ marginRight: '20px' }}>Home</Link>
//         <Link to="/help" style={{ marginRight: '20px' }}>Help Request</Link>
//         <Link to="/login" style={{ marginRight: '20px' }}>Login</Link>
//         <Link to="/notifications">Notifications</Link>
//       </nav>

//       <Routes>
//         <Route path="/" element={<RoleSelection />} />
//         <Route path="/home" element={<Home />} />
//         <Route path="/register/requester" element={<RequesterRegister />} />
//         <Route path="/register/responder" element={<ResponderRegister />} />
//         <Route path="/help" element={<HelpRequest />} />
//         <Route path="/notifications" element={<Notifications />} />
//         <Route path="/login" element={<Login />} />

//         {/* NEW */}
//         <Route path="/select-role" element={<RoleSelection />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;
// src/App.js

// import React from 'react';
// import { Routes, Route, Link } from 'react-router-dom';

// import RoleSelection from './pages/RoleSelection';
// import RequesterRegister from './pages/RequesterRegister';
// import ResponderRegister from './pages/ResponderRegister';
// import Home from './pages/Home';
// import Login from './pages/Login';

// function App() {
//   return (
//     <div style={{ padding: '10px', backgroundColor: '#f5f5f5' }}>
//       <nav style={{ marginBottom: '20px' }}>
//         <Link to="/" style={{ marginRight: '20px' }}>Register</Link>
//         <Link to="/home" style={{ marginRight: '20px' }}>Home</Link>
//         <Link to="/login">Login</Link>
//       </nav>

//       <Routes>
//         <Route path="/" element={<RoleSelection />} />
//         <Route path="/home" element={<Home />} />
//         <Route path="/register/requester" element={<RequesterRegister />} />
//         <Route path="/register/responder" element={<ResponderRegister />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/select-role" element={<RoleSelection />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;

// import React from 'react';
// import { Routes, Route, Link } from 'react-router-dom';
// import RoleSelection from './pages/SelectRole';
// import RequesterRegister from './pages/RequesterRegister';
// import ResponderRegister from './pages/ResponderRegister';
// import HelpRequest from './pages/HelpRequest';
// import Notifications from './pages/Notifications';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import SelectRole from './pages/SelectRole';
// import RequesterDashboard from './pages/RequesterDashboard';
// import ResponderDashboard from './pages/ResponderDashboard';

// function App() {
//   return (
//     <div style={{ padding: '10px', backgroundColor: '#f5f5f5' }}>
//       <nav style={{ marginBottom: '20px' }}>
//         <Link to="/" style={{ marginRight: '20px' }}>Register</Link>
//         <Link to="/login" style={{ marginRight: '20px' }}>Login</Link>
//       </nav>

//       <Routes>
//         <Route path="/" element={<RoleSelection />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/select-role" element={<SelectRole />} />

//         <Route path="/register/requester" element={<RequesterRegister />} />
//         <Route path="/register/responder" element={<ResponderRegister />} />

//         <Route path="/dashboard/requester" element={<RequesterDashboard />} />
//         <Route path="/dashboard/responder" element={<ResponderDashboard />} />

//         <Route path="/help" element={<HelpRequest />} />
//         <Route path="/notifications" element={<Notifications />} />
//         <Route path="/home" element={<Home />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;









// import React from "react";
// import { Routes, Route, Link } from "react-router-dom";

// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import SelectRole from "./pages/SelectRole";

// import RequesterRegister from "./pages/RequesterRegister";
// import ResponderRegister from "./pages/ResponderRegister";

// import RequesterDashboard from "./pages/RequesterDashboard";
// import ResponderDashboard from "./pages/ResponderDashboard";

// import HelpRequest from "./pages/HelpRequest";
// import Notifications from "./pages/Notifications";
// import AdminDashboard from "./pages/AdminDashboard";

// function App() {
//   return (
//     <div
//       style={{
//         padding: "10px",
//         backgroundColor: "#f5f5f5",
//       }}
//     >
//       <nav style={{ marginBottom: "20px" }}>
//         <Link
//           to="/"
//           style={{ marginRight: "20px" }}
//         >
//           Home
//         </Link>

//         <Link
//           to="/login"
//           style={{ marginRight: "20px" }}
//         >
//           Login
//         </Link>

//         <Link
//           to="/register"
//           style={{ marginRight: "20px" }}
//         >
//           Register
//         </Link>

//         <Link
//           to="/notifications"
//           style={{ marginLeft: "20px" }}
//         >
//           Notifications
//         </Link>
//       </nav>

//       <Routes>
//         <Route path="/" element={<Home />} />

//         <Route path="/login" element={<Login />} />

//         <Route
//           path="/register"
//           element={<Register />}
//         />

//         <Route
//           path="/select-role"
//           element={<SelectRole />}
//         />

//         {/* Uncomment these routes if you use them later */}
//         {/*
//         <Route
//           path="/register/requester"
//           element={<RequesterRegister />}
//         />

//         <Route
//           path="/register/responder"
//           element={<ResponderRegister />}
//         />
//         */}

//         <Route
//           path="/dashboard/requester"
//           element={<RequesterDashboard />}
//         />

//         <Route
//           path="/dashboard/responder"
//           element={<ResponderDashboard />}
//         />

//         <Route
//           path="/help"
//           element={<HelpRequest />}
//         />

//         <Route
//           path="/notifications"
//           element={<Notifications />}
//         />

//         <Route
//           path="/admin"
//           element={<AdminDashboard />}
//         />
//       </Routes>
//     </div>
//   );
// }

// export default App;





import React from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SelectRole from "./pages/SelectRole";
import RequesterDashboard from "./pages/RequesterDashboard";
import ResponderDashboard from "./pages/ResponderDashboard";
import HelpRequest from "./pages/HelpRequest";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/AdminDashboard";

import "./App.css";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const isAdminPage = location.pathname.startsWith("/admin");

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="app">
      {!isAdminPage && (
        <header className="main-navbar">
          <Link to="/" className="brand-link">
            <span className="brand-logo">LC</span>

            <span>
              <strong>LifeChain</strong>
              <small>Help nearby, faster</small>
            </span>
          </Link>

          <nav className="main-navigation">
            <Link to="/">Home</Link>

            {user && (
              <Link to="/notifications">
                Notifications
              </Link>
            )}

            {!user ? (
              <>
                <Link to="/login">Login</Link>

                <Link
                  to="/register"
                  className="nav-primary-button"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <span className="nav-user-name">
                  Hi, {user.name}
                </span>

                <button
                  type="button"
                  className="nav-logout-button"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </header>
      )}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/select-role"
          element={<SelectRole />}
        />

        <Route
          path="/dashboard/requester"
          element={<RequesterDashboard />}
        />

        <Route
          path="/dashboard/responder"
          element={<ResponderDashboard />}
        />

        <Route
          path="/help"
          element={<HelpRequest />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="*"
          element={
            <div className="page-not-found">
              <h1>404</h1>
              <p>The requested page was not found.</p>

              <Link to="/">
                Return Home
              </Link>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;