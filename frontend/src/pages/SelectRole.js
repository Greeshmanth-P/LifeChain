// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// function RoleSelection() {
//   const navigate = useNavigate();

//   return (
//     <div style={{ textAlign: 'center', padding: '2rem' }}>
//       <h2>Register As:</h2>
//       <button onClick={() => navigate('/register/requester')} style={{ margin: '1rem', padding: '1rem 2rem' }}>
//         I Need Help (Requester)
//       </button>
//       <button onClick={() => navigate('/register/responder')} style={{ margin: '1rem', padding: '1rem 2rem' }}>
//         I Want to Help (Responder)
//       </button>
//     </div>
//   );
// }

// export default RoleSelectio



// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const SelectRole = () => {
//   const navigate = useNavigate();

//   const storedUser = localStorage.getItem('user');
//   const user = storedUser ? JSON.parse(storedUser) : null;

//   if (!user) {
//     return (
//       <div style={{ textAlign: 'center', marginTop: '80px' }}>
//         <h2>User not logged in</h2>
//         <button onClick={() => navigate('/login')}>Go to Login</button>
//       </div>
//     );
//   }

//   return (
//     <div style={{ textAlign: 'center', marginTop: '80px' }}>
//       <h2>Welcome {user.name}</h2>

//       <button
//         style={{ marginRight: '20px' }}
//         onClick={() => navigate('/dashboard/requester')}
//       >
//         Continue as Requester
//       </button>

//       <button onClick={() => navigate('/dashboard/responder')}>
//         Continue as Responder
//       </button>
//     </div>
//   );
// };

// export default SelectRole;


// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const SelectRole = () => {
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem('user'));

//   if (!user) {
//     return (
//       <div style={{ textAlign: 'center', marginTop: '80px' }}>
//         <h2>Please login again</h2>
//         <button onClick={() => navigate('/login')}>Go to Login</button>
//       </div>
//     );
//   }

//   return (
//     <div style={{ textAlign: 'center', marginTop: '80px' }}>
//       <h2>Welcome {user.name}</h2>

//       <button onClick={() => navigate('/dashboard/requester')}>
//         Continue as Requester
//       </button>

//       <br /><br />

//       <button onClick={() => navigate('/dashboard/responder')}>
//         Continue as Responder
//       </button>
//     </div>
//   );
// };

// export default SelectRole;














// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const SelectRole = () => {
//   const navigate = useNavigate();

//   const storedUser = localStorage.getItem('user');
//   const user = storedUser ? JSON.parse(storedUser) : null;

//   if (!user) {
//     return (
//       <div style={{ textAlign: 'center', marginTop: '80px' }}>
//         <h2>Please login again</h2>
//         <button onClick={() => navigate('/login')}>
//           Go to Login
//         </button>
//       </div>
//     );
//   }

//   const handleLogout = () => {
//     localStorage.clear();   // clear session properly
//     navigate('/login');
//   };

//   return (
//     <div style={{ textAlign: 'center', marginTop: '80px' }}>
//       <h2>Welcome {user.name}</h2>

//       {/* ✅ Single Logout Button */}
//       <button
//         onClick={handleLogout}
//         style={{
//           backgroundColor: 'red',
//           color: 'white',
//           marginBottom: '20px',
//           padding: '6px 12px'
//         }}
//       >
//         Logout
//       </button>

//       <br />

//       <button onClick={() => navigate('/dashboard/requester')}>
//         Continue as Requester
//       </button>

//       <br /><br />

//       <button onClick={() => navigate('/dashboard/responder')}>
//         Continue as Responder
//       </button>
//     </div>
//   );
// };

// export default SelectRole;












import React from "react";
import { useNavigate } from "react-router-dom";
import "./SelectRole.css";

const SelectRole = () => {
  const navigate = useNavigate();

  const storedUser =
    localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    user = null;
  }

  if (!user) {
    return (
      <main className="role-login-required">
        <h2>Please login again</h2>

        <button
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </main>
    );
  }

  return (
    <main className="role-page">
      <section className="role-heading">
        <span>Welcome back</span>

        <h1>{user.name}, how are you using LifeChain?</h1>

        <p>
          You can switch between requester and responder
          whenever needed.
        </p>
      </section>

      <section className="role-grid">
        <article className="role-card requester-role">
          <div className="role-icon">?</div>

          <span className="role-label">
            I need assistance
          </span>

          <h2>Continue as Requester</h2>

          <p>
            Create a help request, track the assigned
            responder and verify completion.
          </p>

          <ul>
            <li>Create nearby help requests</li>
            <li>Track request progress</li>
            <li>Receive status notifications</li>
          </ul>

          <button
            onClick={() =>
              navigate("/dashboard/requester")
            }
          >
            Open Requester Dashboard
          </button>
        </article>

        <article className="role-card responder-role">
          <div className="role-icon">✓</div>

          <span className="role-label">
            I am ready to help
          </span>

          <h2>Continue as Responder</h2>

          <p>
            Discover active nearby requests and help
            community members who need support.
          </p>

          <ul>
            <li>See requests within five kilometres</li>
            <li>Navigate to requester locations</li>
            <li>Complete and verify assistance</li>
          </ul>

          <button
            onClick={() =>
              navigate("/dashboard/responder")
            }
          >
            Open Responder Dashboard
          </button>
        </article>
      </section>

      <button
        className="role-notification-link"
        onClick={() =>
          navigate("/notifications")
        }
      >
        View Notifications
      </button>
    </main>
  );
};

export default SelectRole;