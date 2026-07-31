// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// function RequesterDashboard() {
//   const navigate = useNavigate();

//   // ✅ READ USER PROPERLY
//   const storedUser = localStorage.getItem('user');
//   const user = storedUser ? JSON.parse(storedUser) : null;

//   if (!user) {
//     return <h2>Please login again</h2>;
//   }

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>Welcome {user.name}</h2>
//       <p>You are logged in as a Requester</p>

//       <button
//         style={{ padding: '1rem', marginTop: '1rem' }}
//         onClick={() => navigate('/help')}
//       >
//         Create Help Request
//       </button>
//     </div>
//   );
// }

// export default RequesterDashboard;










// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import api from "../api/api";

// function RequesterDashboard() {
//   const navigate = useNavigate();

//   const storedUser = localStorage.getItem("user");

//   let user = null;

//   try {
//     user = storedUser ? JSON.parse(storedUser) : null;
//   } catch (error) {
//     console.error(
//       "Invalid user data in localStorage:",
//       error
//     );
//   }

//   const [myRequests, setMyRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [verifyingId, setVerifyingId] = useState(null);

//   useEffect(() => {
//     if (!user?.phone) {
//       setLoading(false);
//       return;
//     }

//     const fetchMyRequests = async () => {
//       try {
//         const response = await api.get(
//           "/help-requests/my",
//           {
//             params: {
//               phone: user.phone
//             }
//           }
//         );

//         setMyRequests(
//           response.data?.requests || []
//         );
//       } catch (error) {
//         console.error(
//           "Failed to fetch requests:",
//           error.response?.data || error.message
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMyRequests();

//     const intervalId = setInterval(
//       fetchMyRequests,
//       5000
//     );

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [user?.phone]);

//   const verifyCompletion = async requestId => {
//     try {
//       setVerifyingId(requestId);

//       await api.post(
//         "/help-requests/verify",
//         {
//           requestId
//         }
//       );

//       setMyRequests(previousRequests =>
//         previousRequests.filter(
//           request => request._id !== requestId
//         )
//       );

//       alert(
//         "Request verified and completed successfully"
//       );
//     } catch (error) {
//       console.error(
//         "Verification failed:",
//         error.response?.data || error.message
//       );

//       alert(
//         error.response?.data?.message ||
//           "Verification failed. Please try again."
//       );
//     } finally {
//       setVerifyingId(null);
//     }
//   };

//   const trackResponder = request => {
//     const coordinates =
//       request?.responder?.location?.coordinates;

//     if (
//       !Array.isArray(coordinates) ||
//       coordinates.length < 2
//     ) {
//       alert(
//         "Responder location is not available yet"
//       );
//       return;
//     }

//     const [longitude, latitude] = coordinates;

//     window.open(
//       `https://www.google.com/maps?q=${latitude},${longitude}`,
//       "_blank",
//       "noopener,noreferrer"
//     );
//   };

//   if (!user) {
//     return (
//       <div style={{ padding: "2rem" }}>
//         <h2>Please login again</h2>

//         <button
//           onClick={() => navigate("/login")}
//         >
//           Go to Login
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>Welcome {user.name}</h2>

//       <p>You are acting as a Requester</p>

//       <button onClick={() => navigate("/help")}>
//         Create Help Request
//       </button>

//       <hr />

//       <h3>My Help Requests</h3>

//       {loading && <p>Loading requests...</p>}

//       {!loading && myRequests.length === 0 && (
//         <p>No active requests.</p>
//       )}

//       {myRequests.map(request => (
//         <div
//           key={request._id}
//           style={{
//             marginBottom: "20px",
//             padding: "15px",
//             border: "1px solid #ccc",
//             borderRadius: "8px"
//           }}
//         >
//           <p>
//             <b>Type:</b> {request.helpType}
//           </p>

//           {request.description && (
//             <p>
//               <b>Description:</b>{" "}
//               {request.description}
//             </p>
//           )}

//           <p>
//             <b>Status:</b> {request.status}
//           </p>

//           {request.status === "pending" && (
//             <p style={{ color: "#555" }}>
//               Waiting for a responder to accept your
//               request.
//             </p>
//           )}

//           {request.status === "fulfilled" &&
//             request.responder && (
//               <>
//                 <p style={{ color: "green" }}>
//                   Accepted by{" "}
//                   {request.responder.name}
//                 </p>

//                 <p>
//                   Responder Phone:{" "}
//                   {request.responder.phone ||
//                     "Not available"}
//                 </p>

//                 <button
//                   onClick={() =>
//                     trackResponder(request)
//                   }
//                 >
//                   Track Responder
//                 </button>
//               </>
//             )}

//           {request.status ===
//             "waiting_verification" && (
//             <>
//               <p style={{ color: "orange" }}>
//                 The responder marked this help request
//                 as completed. Please verify it.
//               </p>

//               {request.responder && (
//                 <>
//                   <p>
//                     Responder:{" "}
//                     {request.responder.name}
//                   </p>

//                   <button
//                     onClick={() =>
//                       trackResponder(request)
//                     }
//                     style={{
//                       marginRight: "10px"
//                     }}
//                   >
//                     Track Responder
//                   </button>
//                 </>
//               )}

//               <button
//                 onClick={() =>
//                   verifyCompletion(request._id)
//                 }
//                 disabled={
//                   verifyingId === request._id
//                 }
//                 style={{
//                   backgroundColor:
//                     verifyingId === request._id
//                       ? "gray"
//                       : "green",
//                   color: "white",
//                   padding: "8px 12px",
//                   border: "none",
//                   borderRadius: "5px",
//                   cursor:
//                     verifyingId === request._id
//                       ? "not-allowed"
//                       : "pointer"
//                 }}
//               >
//                 {verifyingId === request._id
//                   ? "Verifying..."
//                   : "Verify Completion"}
//               </button>
//             </>
//           )}

//           <hr />
//         </div>
//       ))}
//     </div>
//   );
// }

// export default RequesterDashboard;










import React, {
  useCallback,
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import api from "../api/api";
import "./RequesterDashboard.css";

const statusDetails = {
  pending: {
    label: "Waiting for responder",
    description:
      "Nearby responders can currently view and accept this request."
  },

  fulfilled: {
    label: "Responder assigned",
    description:
      "A responder accepted your request and may be travelling to your location."
  },

  waiting_verification: {
    label: "Verification required",
    description:
      "The responder marked the help as completed. Verify only after receiving the requested help."
  }
};

function RequesterDashboard() {
  const navigate = useNavigate();

  const storedUser =
    localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    console.error(
      "Invalid stored user:",
      error
    );
  }

  const [myRequests, setMyRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [verifyingId, setVerifyingId] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const fetchMyRequests =
    useCallback(async (showRefresh = false) => {
      if (!user?.phone) {
        setLoading(false);
        return;
      }

      try {
        if (showRefresh) {
          setRefreshing(true);
        }

        const response = await api.get(
          "/help-requests/my",
          {
            params: {
              phone: user.phone
            }
          }
        );

        setMyRequests(
          response.data?.requests || []
        );

        setMessage("");
      } catch (error) {
        console.error(
          "Failed to fetch requester requests:",
          error.response?.data ||
            error.message
        );

        setMessage(
          error.response?.data?.message ||
            "Unable to load your active requests."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }, [user?.phone]);

  useEffect(() => {
    fetchMyRequests();

    const intervalId = setInterval(
      fetchMyRequests,
      5000
    );

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchMyRequests]);

  const verifyCompletion = async requestId => {
    if (verifyingId) {
      return;
    }

    const confirmed = window.confirm(
      "Did you receive the requested help?\n\nVerify only when the assistance was actually completed."
    );

    if (!confirmed) {
      return;
    }

    try {
      setVerifyingId(requestId);

      await api.post(
        "/help-requests/verify",
        {
          requestId
        }
      );

      setMyRequests(previousRequests =>
        previousRequests.filter(
          request =>
            request._id !== requestId
        )
      );

      alert(
        "Request verified and completed successfully."
      );
    } catch (error) {
      console.error(
        "Verification failed:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Verification failed. Please try again."
      );
    } finally {
      setVerifyingId(null);
    }
  };

  const trackResponder = request => {
    const coordinates =
      request?.responder?.location
        ?.coordinates;

    if (
      !Array.isArray(coordinates) ||
      coordinates.length < 2
    ) {
      alert(
        "Responder location is not available yet."
      );

      return;
    }

    const [longitude, latitude] =
      coordinates;

    window.open(
      `https://www.google.com/maps?q=${latitude},${longitude}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const formatCreatedTime = value => {
    if (!value) {
      return "Time unavailable";
    }

    return new Date(value).toLocaleString();
  };

  if (!user) {
    return (
      <main className="requester-login-state">
        <div>
          <span className="requester-state-icon">
            !
          </span>

          <h2>Please login again</h2>

          <p>
            Your login information is missing or
            expired.
          </p>

          <button
            onClick={() =>
              navigate("/login")
            }
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="requester-page">
      <section className="requester-hero">
        <div>
          <span className="requester-label">
            Requester Dashboard
          </span>

          <h1>
            Welcome back, {user.name}
          </h1>

          <p>
            Create help requests, track assigned
            responders and verify completed
            assistance.
          </p>
        </div>

        <div className="requester-hero-actions">
          <button
            className="requester-notification-button"
            onClick={() =>
              navigate("/notifications")
            }
          >
            Notifications
          </button>

          <button
            className="create-request-button"
            onClick={() =>
              navigate("/help")
            }
          >
            + Create Help Request
          </button>
        </div>
      </section>

      <section className="requester-summary-grid">
        <article>
          <span>Active requests</span>
          <strong>
            {myRequests.length}
          </strong>
        </article>

        <article>
          <span>Waiting</span>
          <strong>
            {
              myRequests.filter(
                request =>
                  request.status ===
                  "pending"
              ).length
            }
          </strong>
        </article>

        <article>
          <span>Responder assigned</span>
          <strong>
            {
              myRequests.filter(
                request =>
                  request.status ===
                  "fulfilled"
              ).length
            }
          </strong>
        </article>

        <article>
          <span>Needs verification</span>
          <strong>
            {
              myRequests.filter(
                request =>
                  request.status ===
                  "waiting_verification"
              ).length
            }
          </strong>
        </article>
      </section>

      <section className="requester-content">
        <div className="requester-content-heading">
          <div>
            <h2>My active requests</h2>

            <p>
              Completed requests automatically
              disappear after verification.
            </p>
          </div>

          <button
            className="requester-refresh-button"
            disabled={refreshing}
            onClick={() =>
              fetchMyRequests(true)
            }
          >
            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>

        {message && (
          <div className="requester-error">
            {message}
          </div>
        )}

        {loading ? (
          <div className="requester-loading-state">
            <div className="requester-loader" />

            <p>
              Loading your requests...
            </p>
          </div>
        ) : myRequests.length === 0 ? (
          <div className="requester-empty-state">
            <div className="requester-empty-icon">
              +
            </div>

            <h2>No active requests</h2>

            <p>
              You currently have no pending or
              accepted help requests.
            </p>

            <button
              onClick={() =>
                navigate("/help")
              }
            >
              Create your first request
            </button>
          </div>
        ) : (
          <div className="requester-request-grid">
            {myRequests.map(request => {
              const currentStatus =
                statusDetails[
                  request.status
                ] || {
                  label: request.status,
                  description:
                    "Request status updated."
                };

              return (
                <article
                  className="requester-request-card"
                  key={request._id}
                >
                  <header className="request-card-header">
                    <div>
                      <span className="request-type-label">
                        Help request
                      </span>

                      <h3>
                        {request.helpType ||
                          "General assistance"}
                      </h3>
                    </div>

                    <span
                      className={
                        `request-status request-status-${request.status}`
                      }
                    >
                      {currentStatus.label}
                    </span>
                  </header>

                  {request.description && (
                    <p className="request-description">
                      {request.description}
                    </p>
                  )}

                  <div className="request-meta-grid">
                    <div>
                      <span>Created</span>

                      <strong>
                        {formatCreatedTime(
                          request.createdAt
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Request ID</span>

                      <strong>
                        {request._id
                          ?.slice(-6)
                          ?.toUpperCase()}
                      </strong>
                    </div>
                  </div>

                  <div
                    className={
                      `request-status-information status-information-${request.status}`
                    }
                  >
                    <span>
                      {request.status ===
                      "pending"
                        ? "⌛"
                        : request.status ===
                            "fulfilled"
                          ? "✓"
                          : "!"}
                    </span>

                    <p>
                      {
                        currentStatus.description
                      }
                    </p>
                  </div>

                  {request.status ===
                    "fulfilled" &&
                    request.responder && (
                      <section className="responder-information-card">
                        <div className="responder-avatar">
                          {request.responder.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "R"}
                        </div>

                        <div>
                          <span>
                            Assigned responder
                          </span>

                          <strong>
                            {
                              request.responder
                                .name
                            }
                          </strong>

                          <small>
                            {
                              request.responder
                                .phone ||
                              "Phone unavailable"
                            }
                          </small>
                        </div>
                      </section>
                    )}

                  {request.status ===
                    "waiting_verification" &&
                    request.responder && (
                      <section className="responder-information-card">
                        <div className="responder-avatar">
                          {request.responder.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "R"}
                        </div>

                        <div>
                          <span>
                            Help completed by
                          </span>

                          <strong>
                            {
                              request.responder
                                .name
                            }
                          </strong>

                          <small>
                            Verify after receiving
                            assistance.
                          </small>
                        </div>
                      </section>
                    )}

                  <footer className="request-card-actions">
                    {(request.status ===
                      "fulfilled" ||
                      request.status ===
                        "waiting_verification") &&
                      request.responder && (
                        <button
                          className="track-responder-button"
                          onClick={() =>
                            trackResponder(
                              request
                            )
                          }
                        >
                          Open Responder Location
                        </button>
                      )}

                    {request.status ===
                      "waiting_verification" && (
                      <button
                        className="verify-request-button"
                        disabled={
                          verifyingId ===
                          request._id
                        }
                        onClick={() =>
                          verifyCompletion(
                            request._id
                          )
                        }
                      >
                        {verifyingId ===
                        request._id
                          ? "Verifying..."
                          : "Verify Completion"}
                      </button>
                    )}
                  </footer>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default RequesterDashboard;