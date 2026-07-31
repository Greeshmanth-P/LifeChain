// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function ResponderDashboard() {
//   const [requests, setRequests] = useState([]);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     const fetchNearbyRequests = async () => {
//       try {
//         const phone = localStorage.getItem('phone');

//         const res = await axios.post(
//           'http://localhost:5000/api/help-requests/nearby',
//           { phone }
//         );

//         setRequests(res.data.requests);
//       } catch (err) {
//         setMessage(err.response?.data?.message || 'Failed to fetch requests');
//       }
//     };

//     fetchNearbyRequests();
//   }, []);

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>Responder Dashboard</h2>

//       {message && <p>{message}</p>}

//       {requests.length === 0 ? (
//         <p>No nearby help requests.</p>
//       ) : (
//         <ul>
//           {requests.map((req) => (
//             <li key={req._id} style={{ marginBottom: '1rem' }}>
//               <b>Type:</b> {req.helpType} <br />
//               <b>Description:</b> {req.description} <br />
//               <b>Requester:</b> {req.requester.name} <br />
//               <b>Phone:</b> {req.requester.phone}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// <button
//   onClick={async () => {
//     try {
//       const phone = localStorage.getItem('phone');

//       await axios.post(
//         'http://localhost:5000/api/help-requests/accept',
//         {
//           requestId: req._id,
//           responderPhone: phone,
//         }
//       );

//       // remove accepted request from UI
//       setRequests((prev) => prev.filter(r => r._id !== req._id));
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to accept request');
//     }
//   }}
// >
//   Accept Request
// </button>

// export default ResponderDashboard;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function ResponderDashboard() {
//   const [requests, setRequests] = useState([]);
//   const [message, setMessage] = useState('');

//   // ✅ READ USER ONCE
//   const storedUser = localStorage.getItem('user');
//   const user = storedUser ? JSON.parse(storedUser) : null;

//   useEffect(() => {
//     const fetchNearbyRequests = async () => {
//       if (!user || !user.phone) {
//         setMessage('User not logged in. Please login again.');
//         return;
//       }

//       try {
//         const res = await axios.post(
//           'http://localhost:5000/api/help-requests/nearby',
//           { phone: user.phone }
//         );

//         setRequests(res.data.requests || []);
//       } catch (err) {
//         console.error(err);
//         setMessage(err.response?.data?.message || 'Failed to fetch requests');
//       }
//     };

//     fetchNearbyRequests();
//   }, [user]);

//   const acceptRequest = async (requestId) => {
//     try {
//       await axios.post(
//         'http://localhost:5000/api/help-requests/accept',
//         {
//           requestId,
//           responderPhone: user.phone,
//         }
//       );

//       setRequests(prev => prev.filter(r => r._id !== requestId));
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to accept request');
//     }
//   };

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>Responder Dashboard</h2>

//       {message && <p>{message}</p>}

//       {requests.length === 0 ? (
//         <p>No nearby help requests.</p>
//       ) : (
//         <ul>
//           {requests.map(req => (
//             <li key={req._id} style={{ marginBottom: '1rem' }}>
//               <b>Type:</b> {req.helpType}<br />
//               <b>Description:</b> {req.description}<br />
//               <b>Requester:</b> {req.requester?.name}<br />
//               <b>Phone:</b> {req.requester?.phone}<br /><br />

//               <button onClick={() => acceptRequest(req._id)}>
//                 Accept Request
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default ResponderDashboard;














// import React, {
//   useCallback,
//   useEffect,
//   useRef,
//   useState
// } from "react";

// import api from "../api/api";

// const ResponderDashboard = () => {
//   const storedUser = localStorage.getItem("user");

//   let user = null;

//   try {
//     user = storedUser ? JSON.parse(storedUser) : null;
//   } catch (error) {
//     console.error("Invalid user data in localStorage:", error);
//   }

//   const [requests, setRequests] = useState([]);
//   const [message, setMessage] = useState("");
//   const [myLocation, setMyLocation] = useState(null);
//   const [acceptingId, setAcceptingId] = useState(null);
//   const [completingId, setCompletingId] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const updatingDashboard = useRef(false);

//   // ==========================================
//   // CHECK WHETHER REQUEST BELONGS TO THIS USER
//   // ==========================================
//   const isAssignedToCurrentResponder = useCallback(
//     (request) => {
//       if (!user) {
//         return false;
//       }

//       const responder = request?.responder;

//       if (!responder) {
//         return false;
//       }

//       // When responder is populated as an object
//       if (typeof responder === "object") {
//         if (
//           responder.phone &&
//           String(responder.phone) === String(user.phone)
//         ) {
//           return true;
//         }

//         if (
//           responder._id &&
//           user._id &&
//           String(responder._id) === String(user._id)
//         ) {
//           return true;
//         }
//       }

//       // When responder is only a MongoDB ID
//       if (
//         typeof responder === "string" &&
//         user._id &&
//         String(responder) === String(user._id)
//       ) {
//         return true;
//       }

//       return false;
//     },
//     [user?._id, user?.phone]
//   );

//   // ==========================================
//   // REMOVE UNWANTED REQUESTS
//   // ==========================================
//   const filterRequestsForCurrentResponder = useCallback(
//     (allRequests) => {
//       if (!Array.isArray(allRequests)) {
//         return [];
//       }

//       return allRequests.filter((request) => {
//         // Every responder can see pending requests
//         if (request.status === "pending") {
//           return true;
//         }

//         // Only the assigned responder can see accepted requests
//         if (
//           request.status === "fulfilled" ||
//           request.status === "waiting_verification"
//         ) {
//           return isAssignedToCurrentResponder(request);
//         }

//         // Hide completed and all other statuses
//         return false;
//       });
//     },
//     [isAssignedToCurrentResponder]
//   );

//   // ==========================================
//   // DISTANCE CALCULATOR
//   // ==========================================
//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const earthRadius = 6371;

//     const latitudeDifference =
//       (lat2 - lat1) * (Math.PI / 180);

//     const longitudeDifference =
//       (lon2 - lon1) * (Math.PI / 180);

//     const value =
//       Math.sin(latitudeDifference / 2) ** 2 +
//       Math.cos(lat1 * (Math.PI / 180)) *
//         Math.cos(lat2 * (Math.PI / 180)) *
//         Math.sin(longitudeDifference / 2) ** 2;

//     const angle =
//       2 *
//       Math.atan2(
//         Math.sqrt(value),
//         Math.sqrt(1 - value)
//       );

//     return (earthRadius * angle).toFixed(2);
//   };

//   // ==========================================
//   // FETCH NEARBY REQUESTS
//   // ==========================================
//   const fetchNearbyRequests = useCallback(
//     async (latitude, longitude) => {
//       const response = await api.post(
//   "/help-requests/nearby",
//   {
//     phone: user.phone,
//     latitude,
//     longitude
//   }
// );

//       const receivedRequests =
//         response.data?.requests || [];

//       const filteredRequests =
//         filterRequestsForCurrentResponder(
//           receivedRequests
//         );

//       setRequests(filteredRequests);
//     },
//     [user?.phone, filterRequestsForCurrentResponder]
//   );

//   // ==========================================
//   // UPDATE LOCATION AND DASHBOARD
//   // ==========================================
//   const updateDashboard = useCallback(() => {
//     if (!user?.phone || updatingDashboard.current) {
//       return;
//     }

//     if (!navigator.geolocation) {
//       setMessage(
//         "Geolocation is not supported by your browser."
//       );

//       setLoading(false);
//       return;
//     }

//     updatingDashboard.current = true;

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         try {
//           const latitude =
//             position.coords.latitude;

//           const longitude =
//             position.coords.longitude;

//           setMyLocation({
//             lat: latitude,
//             lon: longitude
//           });

//           await api.post(
//   "/users/update-location",
//   {
//     phone: user.phone,
//     latitude,
//     longitude
//   }
// );

//           await fetchNearbyRequests(
//             latitude,
//             longitude
//           );

//           setMessage("");
//         } catch (error) {
//           console.error(
//             "Dashboard update error:",
//             error.response?.data || error.message
//           );

//           setMessage(
//             error.response?.data?.message ||
//               "Failed to load nearby requests."
//           );
//         } finally {
//           updatingDashboard.current = false;
//           setLoading(false);
//         }
//       },
//       (locationError) => {
//         console.error(
//           "Location access error:",
//           locationError
//         );

//         if (
//           locationError.code ===
//           locationError.PERMISSION_DENIED
//         ) {
//           setMessage(
//             "Location permission was denied. Please allow location access."
//           );
//         } else {
//           setMessage(
//             "Unable to detect your current location."
//           );
//         }

//         updatingDashboard.current = false;
//         setLoading(false);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 5000
//       }
//     );
//   }, [user?.phone, fetchNearbyRequests]);

//   // ==========================================
//   // AUTO REFRESH
//   // ==========================================
//   useEffect(() => {
//     if (!user?.phone) {
//       setLoading(false);
//       return;
//     }

//     updateDashboard();

//     const intervalId = setInterval(
//       updateDashboard,
//       10000
//     );

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [user?.phone, updateDashboard]);

//   // ==========================================
//   // ACCEPT REQUEST
//   // ==========================================
//   const acceptRequest = async (requestId) => {
//     if (!user?.phone || acceptingId) {
//       return;
//     }

//     try {
//       setAcceptingId(requestId);

//       const response = await api.post(
//   "/help-requests/accept",
//   {
//     requestId,
//     responderPhone: user.phone
//   }
// );

//       // Immediately change button to Mark Completed
//       setRequests((previousRequests) =>
//         previousRequests.map((request) =>
//           request._id === requestId
//             ? {
//                 ...request,
//                 status: "fulfilled",
//                 responder: {
//                   _id: user._id,
//                   name: user.name,
//                   phone: user.phone
//                 }
//               }
//             : request
//         )
//       );

//       alert(
//         "Request accepted. Help the requester and then mark it completed."
//       );

//       const coordinates =
//         response.data?.requesterLocation
//           ?.coordinates;

//       if (
//         Array.isArray(coordinates) &&
//         coordinates.length >= 2
//       ) {
//         const longitude = coordinates[0];
//         const latitude = coordinates[1];

//         window.open(
//           `https://www.google.com/maps?q=${latitude},${longitude}`,
//           "_blank",
//           "noopener,noreferrer"
//         );
//       }
//     } catch (error) {
//       console.error(
//         "Accept request error:",
//         error.response?.data || error.message
//       );

//       alert(
//         error.response?.data?.message ||
//           "Unable to accept this request."
//       );

//       // Refresh because another responder may have accepted it
//       updateDashboard();
//     } finally {
//       setAcceptingId(null);
//     }
//   };

//   // ==========================================
//   // COMPLETE REQUEST
//   // ==========================================
//   const completeRequest = async (requestId) => {
//     if (!user?.phone || completingId) {
//       return;
//     }

//     try {
//       setCompletingId(requestId);

//       await api.post(
//   "/help-requests/complete",
//   {
//     requestId,
//     responderPhone: user.phone
//   }
// );

//       setRequests((previousRequests) =>
//         previousRequests.map((request) =>
//           request._id === requestId
//             ? {
//                 ...request,
//                 status: "waiting_verification"
//               }
//             : request
//         )
//       );

//       alert(
//         "Help marked completed. Waiting for requester verification."
//       );
//     } catch (error) {
//       console.error(
//         "Complete request error:",
//         error.response?.data || error.message
//       );

//       alert(
//         error.response?.data?.message ||
//           "Failed to complete the request."
//       );
//     } finally {
//       setCompletingId(null);
//     }
//   };

//   // ==========================================
//   // OPEN REQUESTER LOCATION
//   // ==========================================
//   const openGoogleMaps = (request) => {
//     const coordinates =
//       request?.location?.coordinates;

//     if (
//       !Array.isArray(coordinates) ||
//       coordinates.length < 2
//     ) {
//       alert("Requester location is unavailable.");
//       return;
//     }

//     const longitude = coordinates[0];
//     const latitude = coordinates[1];

//     window.open(
//       `https://www.google.com/maps?q=${latitude},${longitude}`,
//       "_blank",
//       "noopener,noreferrer"
//     );
//   };

//   if (!user) {
//     return (
//       <div style={{ padding: "40px" }}>
//         <h2>Please log in again.</h2>
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         padding: "40px",
//         fontFamily: "Arial, sans-serif",
//         background: "#f4f6f8",
//         minHeight: "100vh"
//       }}
//     >
//       <h1 style={{ color: "#2c3e50" }}>
//         Responder Dashboard
//       </h1>

//       <h3>Welcome {user.name}</h3>

//       {message && (
//         <p
//           style={{
//             color: "#c0392b",
//             fontWeight: "bold"
//           }}
//         >
//           {message}
//         </p>
//       )}

//       {loading ? (
//         <p>Loading nearby requests...</p>
//       ) : requests.length === 0 ? (
//         <p>No nearby active help requests.</p>
//       ) : (
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns:
//               "repeat(auto-fit, minmax(300px, 1fr))",
//             gap: "20px",
//             marginTop: "20px"
//           }}
//         >
//           {requests.map((request) => {
//             const requesterLatitude =
//               request?.location
//                 ?.coordinates?.[1];

//             const requesterLongitude =
//               request?.location
//                 ?.coordinates?.[0];

//             let distance = "Unavailable";

//             if (
//               myLocation &&
//               Number.isFinite(requesterLatitude) &&
//               Number.isFinite(requesterLongitude)
//             ) {
//               distance = `${calculateDistance(
//                 myLocation.lat,
//                 myLocation.lon,
//                 requesterLatitude,
//                 requesterLongitude
//               )} km`;
//             }

//             return (
//               <div
//                 key={request._id}
//                 style={{
//                   background: "white",
//                   padding: "20px",
//                   borderRadius: "12px",
//                   boxShadow:
//                     "0 5px 15px rgba(0,0,0,0.1)"
//                 }}
//               >
//                 <h3
//                   style={{
//                     color: "#34495e",
//                     marginTop: 0
//                   }}
//                 >
//                   {request.helpType ||
//                     "Help Request"}
//                 </h3>

//                 <p>
//                   <b>Description:</b>{" "}
//                   {request.description ||
//                     "No description"}
//                 </p>

//                 <p>
//                   <b>Requester:</b>{" "}
//                   {request.requester?.name ||
//                     "Unknown"}
//                 </p>

//                 <p>
//                   <b>Phone:</b>{" "}
//                   {request.requester?.phone ||
//                     "Not available"}
//                 </p>

//                 <p>
//                   <b>Distance:</b> {distance}
//                 </p>

//                 <p>
//                   <b>Status:</b>{" "}
//                   {request.status}
//                 </p>

//                 {request.status === "pending" && (
//                   <button
//                     onClick={() =>
//                       acceptRequest(request._id)
//                     }
//                     disabled={
//                       acceptingId === request._id
//                     }
//                     style={{
//                       background:
//                         acceptingId === request._id
//                           ? "#95a5a6"
//                           : "#27ae60",
//                       color: "white",
//                       padding: "10px 15px",
//                       border: "none",
//                       borderRadius: "6px",
//                       cursor:
//                         acceptingId === request._id
//                           ? "not-allowed"
//                           : "pointer"
//                     }}
//                   >
//                     {acceptingId === request._id
//                       ? "Accepting..."
//                       : "Accept Request"}
//                   </button>
//                 )}

//                 {request.status ===
//                   "fulfilled" && (
//                   <>
//                     <p
//                       style={{
//                         color: "#27ae60",
//                         fontWeight: "bold"
//                       }}
//                     >
//                       You accepted this request.
//                     </p>

//                     <button
//                       onClick={() =>
//                         openGoogleMaps(request)
//                       }
//                       style={{
//                         background: "#3498db",
//                         color: "white",
//                         padding: "10px 15px",
//                         border: "none",
//                         borderRadius: "6px",
//                         cursor: "pointer",
//                         marginRight: "10px",
//                         marginBottom: "10px"
//                       }}
//                     >
//                       Open Google Maps
//                     </button>

//                     <button
//                       onClick={() =>
//                         completeRequest(
//                           request._id
//                         )
//                       }
//                       disabled={
//                         completingId ===
//                         request._id
//                       }
//                       style={{
//                         background:
//                           completingId ===
//                           request._id
//                             ? "#95a5a6"
//                             : "#e67e22",
//                         color: "white",
//                         padding: "10px 15px",
//                         border: "none",
//                         borderRadius: "6px",
//                         cursor:
//                           completingId ===
//                           request._id
//                             ? "not-allowed"
//                             : "pointer",
//                         marginBottom: "10px"
//                       }}
//                     >
//                       {completingId ===
//                       request._id
//                         ? "Completing..."
//                         : "Mark Completed"}
//                     </button>
//                   </>
//                 )}

//                 {request.status ===
//                   "waiting_verification" && (
//                   <>
//                     <p
//                       style={{
//                         color: "#1976d2",
//                         fontWeight: "bold"
//                       }}
//                     >
//                       Waiting for requester
//                       verification.
//                     </p>

//                     <button
//                       onClick={() =>
//                         openGoogleMaps(request)
//                       }
//                       style={{
//                         background: "#3498db",
//                         color: "white",
//                         padding: "10px 15px",
//                         border: "none",
//                         borderRadius: "6px",
//                         cursor: "pointer"
//                       }}
//                     >
//                       Open Google Maps
//                     </button>
//                   </>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResponderDashboard;












import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";

import { useNavigate } from "react-router-dom";

import api from "../api/api";
import "./ResponderDashboard.css";

const ResponderDashboard = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    console.error(
      "Invalid user data in localStorage:",
      error
    );
  }

  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [myLocation, setMyLocation] = useState(null);

  const [acceptingId, setAcceptingId] =
    useState(null);

  const [completingId, setCompletingId] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const updatingDashboard = useRef(false);

  // ==========================================
  // CHECK IF REQUEST IS ASSIGNED TO USER
  // ==========================================

  const isAssignedToCurrentResponder =
    useCallback(
      request => {
        if (!user) {
          return false;
        }

        const responder = request?.responder;

        if (!responder) {
          return false;
        }

        // Responder returned as populated object
        if (typeof responder === "object") {
          if (
            responder.phone &&
            String(responder.phone) ===
              String(user.phone)
          ) {
            return true;
          }

          if (
            responder._id &&
            user.id &&
            String(responder._id) ===
              String(user.id)
          ) {
            return true;
          }

          if (
            responder._id &&
            user._id &&
            String(responder._id) ===
              String(user._id)
          ) {
            return true;
          }
        }

        // Responder returned as MongoDB ID
        if (typeof responder === "string") {
          const currentUserId =
            user.id || user._id;

          if (
            currentUserId &&
            String(responder) ===
              String(currentUserId)
          ) {
            return true;
          }
        }

        return false;
      },
      [
        user?.id,
        user?._id,
        user?.phone
      ]
    );

  // ==========================================
  // FILTER REQUESTS
  // ==========================================

  const filterRequestsForCurrentResponder =
    useCallback(
      allRequests => {
        if (!Array.isArray(allRequests)) {
          return [];
        }

        return allRequests.filter(request => {
          // Pending requests are visible to all
          if (request.status === "pending") {
            return true;
          }

          // Accepted requests are visible only
          // to their assigned responder
          if (
            request.status === "fulfilled" ||
            request.status ===
              "waiting_verification"
          ) {
            return isAssignedToCurrentResponder(
              request
            );
          }

          // Hide completed and other statuses
          return false;
        });
      },
      [isAssignedToCurrentResponder]
    );

  // ==========================================
  // DISTANCE CALCULATOR
  // ==========================================

  const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
  ) => {
    const earthRadius = 6371;

    const latitudeDifference =
      (lat2 - lat1) * (Math.PI / 180);

    const longitudeDifference =
      (lon2 - lon1) * (Math.PI / 180);

    const value =
      Math.sin(latitudeDifference / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(longitudeDifference / 2) ** 2;

    const angle =
      2 *
      Math.atan2(
        Math.sqrt(value),
        Math.sqrt(1 - value)
      );

    return (earthRadius * angle).toFixed(2);
  };

  // ==========================================
  // FETCH NEARBY REQUESTS
  // ==========================================

  const fetchNearbyRequests = useCallback(
    async (latitude, longitude) => {
      const response = await api.post(
        "/help-requests/nearby",
        {
          phone: user.phone,
          latitude,
          longitude
        }
      );

      const receivedRequests =
        response.data?.requests || [];

      const filteredRequests =
        filterRequestsForCurrentResponder(
          receivedRequests
        );

      setRequests(filteredRequests);
    },
    [
      user?.phone,
      filterRequestsForCurrentResponder
    ]
  );

  // ==========================================
  // UPDATE LOCATION AND DASHBOARD
  // ==========================================

  const updateDashboard = useCallback(
    (manualRefresh = false) => {
      if (
        !user?.phone ||
        updatingDashboard.current
      ) {
        return;
      }

      if (!navigator.geolocation) {
        setMessage(
          "Geolocation is not supported by your browser."
        );

        setLoading(false);
        setRefreshing(false);
        return;
      }

      updatingDashboard.current = true;

      if (manualRefresh) {
        setRefreshing(true);
      }

      navigator.geolocation.getCurrentPosition(
        async position => {
          try {
            const latitude =
              position.coords.latitude;

            const longitude =
              position.coords.longitude;

            setMyLocation({
              lat: latitude,
              lon: longitude
            });

            await api.post(
              "/users/update-location",
              {
                phone: user.phone,
                latitude,
                longitude
              }
            );

            await fetchNearbyRequests(
              latitude,
              longitude
            );

            setMessage("");
          } catch (error) {
            console.error(
              "Dashboard update error:",
              error.response?.data ||
                error.message
            );

            setMessage(
              error.response?.data?.message ||
                "Failed to load nearby requests."
            );
          } finally {
            updatingDashboard.current = false;
            setLoading(false);
            setRefreshing(false);
          }
        },

        locationError => {
          console.error(
            "Location access error:",
            locationError
          );

          if (
            locationError.code ===
            locationError.PERMISSION_DENIED
          ) {
            setMessage(
              "Location permission was denied. Allow location access to find nearby requests."
            );
          } else {
            setMessage(
              "Unable to detect your current location."
            );
          }

          updatingDashboard.current = false;
          setLoading(false);
          setRefreshing(false);
        },

        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000
        }
      );
    },
    [
      user?.phone,
      fetchNearbyRequests
    ]
  );

  // ==========================================
  // AUTO REFRESH
  // ==========================================

  useEffect(() => {
    if (!user?.phone) {
      setLoading(false);
      return;
    }

    updateDashboard();

    const intervalId = setInterval(
      updateDashboard,
      10000
    );

    return () => {
      clearInterval(intervalId);
    };
  }, [user?.phone, updateDashboard]);

  // ==========================================
  // ACCEPT REQUEST
  // ==========================================

  const acceptRequest = async requestId => {
    if (!user?.phone || acceptingId) {
      return;
    }

    const confirmed = window.confirm(
      "Accept this help request?\n\nOnly accept if you are ready to assist."
    );

    if (!confirmed) {
      return;
    }

    try {
      setAcceptingId(requestId);

      const response = await api.post(
        "/help-requests/accept",
        {
          requestId,
          responderPhone: user.phone
        }
      );

      // Immediately update UI after acceptance
      setRequests(previousRequests =>
        previousRequests.map(request =>
          request._id === requestId
            ? {
                ...request,
                status: "fulfilled",
                responder: {
                  _id: user.id || user._id,
                  name: user.name,
                  phone: user.phone
                }
              }
            : request
        )
      );

      alert(
        "Request accepted. Help the requester and mark it completed afterward."
      );

      // Exact requester location opens only
      // after successful acceptance
      const coordinates =
        response.data?.requesterLocation
          ?.coordinates;

      if (
        Array.isArray(coordinates) &&
        coordinates.length >= 2
      ) {
        const longitude = coordinates[0];
        const latitude = coordinates[1];

        window.open(
          `https://www.google.com/maps?q=${latitude},${longitude}`,
          "_blank",
          "noopener,noreferrer"
        );
      }
    } catch (error) {
      console.error(
        "Accept request error:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to accept this request."
      );

      // Refresh because another responder
      // may already have accepted it
      updateDashboard();
    } finally {
      setAcceptingId(null);
    }
  };

  // ==========================================
  // COMPLETE REQUEST
  // ==========================================

  const completeRequest = async requestId => {
    if (!user?.phone || completingId) {
      return;
    }

    const confirmed = window.confirm(
      "Mark this help request as completed?\n\nThe requester will need to verify it."
    );

    if (!confirmed) {
      return;
    }

    try {
      setCompletingId(requestId);

      await api.post(
        "/help-requests/complete",
        {
          requestId,
          responderPhone: user.phone
        }
      );

      setRequests(previousRequests =>
        previousRequests.map(request =>
          request._id === requestId
            ? {
                ...request,
                status:
                  "waiting_verification"
              }
            : request
        )
      );

      alert(
        "Help marked completed. Waiting for requester verification."
      );
    } catch (error) {
      console.error(
        "Complete request error:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to complete the request."
      );
    } finally {
      setCompletingId(null);
    }
  };

  // ==========================================
  // OPEN REQUESTER LOCATION
  // ==========================================

  const openGoogleMaps = request => {
    const coordinates =
      request?.location?.coordinates;

    if (
      !Array.isArray(coordinates) ||
      coordinates.length < 2
    ) {
      alert(
        "Requester location is unavailable."
      );

      return;
    }

    const longitude = coordinates[0];
    const latitude = coordinates[1];

    window.open(
      `https://www.google.com/maps?q=${latitude},${longitude}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ==========================================
  // FORMAT CREATED TIME
  // ==========================================

  const formatCreatedTime = value => {
    if (!value) {
      return "Time unavailable";
    }

    return new Date(value).toLocaleString();
  };

  // ==========================================
  // LOGIN CHECK
  // ==========================================

  if (!user) {
    return (
      <main className="responder-login-state">
        <div>
          <span>!</span>

          <h2>Please login again</h2>

          <p>
            Your account information is missing.
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

  const pendingCount = requests.filter(
    request => request.status === "pending"
  ).length;

  const acceptedCount = requests.filter(
    request => request.status === "fulfilled"
  ).length;

  const verificationCount =
    requests.filter(
      request =>
        request.status ===
        "waiting_verification"
    ).length;

  return (
    <main className="responder-page">
      {/* HERO SECTION */}

      <section className="responder-hero">
        <div>
          <span className="responder-page-label">
            Responder Dashboard
          </span>

          <h1>
            Ready to help, {user.name}?
          </h1>

          <p>
            Discover active requests near your
            current location and support community
            members who need assistance.
          </p>
        </div>

        <div className="responder-hero-actions">
          <button
            className="responder-notification-button"
            onClick={() =>
              navigate("/notifications")
            }
          >
            Notifications
          </button>

          <button
            className="responder-refresh-button"
            disabled={refreshing}
            onClick={() =>
              updateDashboard(true)
            }
          >
            {refreshing
              ? "Refreshing..."
              : "Refresh Requests"}
          </button>
        </div>
      </section>

      {/* SUMMARY */}

      <section className="responder-summary-grid">
        <article>
          <span>Visible requests</span>
          <strong>{requests.length}</strong>
        </article>

        <article>
          <span>Available nearby</span>
          <strong>{pendingCount}</strong>
        </article>

        <article>
          <span>Accepted by you</span>
          <strong>{acceptedCount}</strong>
        </article>

        <article>
          <span>Awaiting verification</span>
          <strong>
            {verificationCount}
          </strong>
        </article>
      </section>

      {/* LOCATION INFORMATION */}

      <section className="responder-location-strip">
        <div
          className={
            myLocation
              ? "responder-location-icon active"
              : "responder-location-icon"
          }
        >
          ⌖
        </div>

        <div>
          <strong>
            {myLocation
              ? "Location active"
              : "Detecting location"}
          </strong>

          <p>
            {myLocation
              ? "Showing requests within five kilometres of your current location."
              : "Allow location access to discover nearby requests."}
          </p>
        </div>

        <span>
          Auto-refresh: 10 seconds
        </span>
      </section>

      {/* REQUESTS SECTION */}

      <section className="responder-content">
        <div className="responder-content-heading">
          <div>
            <h2>Nearby active requests</h2>

            <p>
              Accepted requests disappear from
              other responders and remain visible
              only to you.
            </p>
          </div>

          <span className="responder-radius-badge">
            5 km radius
          </span>
        </div>

        {message && (
          <div className="responder-error-message">
            {message}
          </div>
        )}

        {loading ? (
          <div className="responder-loading-state">
            <div className="responder-loader" />

            <p>
              Detecting your location and loading
              nearby requests...
            </p>
          </div>
        ) : requests.length === 0 ? (
          <div className="responder-empty-state">
            <div className="responder-empty-icon">
              ✓
            </div>

            <h2>
              No active requests nearby
            </h2>

            <p>
              There are currently no requests
              within five kilometres that require
              your attention.
            </p>

            <button
              onClick={() =>
                updateDashboard(true)
              }
            >
              Check Again
            </button>
          </div>
        ) : (
          <div className="responder-request-grid">
            {requests.map(request => {
              const requesterLatitude =
                request?.location
                  ?.coordinates?.[1];

              const requesterLongitude =
                request?.location
                  ?.coordinates?.[0];

              let distance = "Unavailable";

              if (
                myLocation &&
                Number.isFinite(
                  requesterLatitude
                ) &&
                Number.isFinite(
                  requesterLongitude
                )
              ) {
                distance =
                  `${calculateDistance(
                    myLocation.lat,
                    myLocation.lon,
                    requesterLatitude,
                    requesterLongitude
                  )} km`;
              }

              return (
                <article
                  key={request._id}
                  className={
                    `responder-request-card responder-card-${request.status}`
                  }
                >
                  <header className="responder-card-header">
                    <div>
                      <span className="responder-request-label">
                        Nearby Request
                      </span>

                      <h3>
                        {request.helpType ||
                          "General Assistance"}
                      </h3>
                    </div>

                    <span
                      className={
                        `responder-status responder-status-${request.status}`
                      }
                    >
                      {request.status === "pending"
                        ? "Available"
                        : request.status ===
                            "fulfilled"
                          ? "Accepted by you"
                          : "Waiting Verification"}
                    </span>
                  </header>

                  <p className="responder-request-description">
                    {request.description ||
                      "No description provided."}
                  </p>

                  <div className="responder-requester-card">
                    <div className="requester-avatar">
                      {request.requester?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>

                    <div>
                      <span>Requester</span>

                      <strong>
                        {request.requester?.name ||
                          "Unknown requester"}
                      </strong>

                      <small>
                        {request.requester?.phone ||
                          "Phone unavailable"}
                      </small>
                    </div>
                  </div>

                  <div className="responder-meta-grid">
                    <div>
                      <span>Distance</span>
                      <strong>{distance}</strong>
                    </div>

                    <div>
                      <span>Created</span>

                      <strong>
                        {formatCreatedTime(
                          request.createdAt
                        )}
                      </strong>
                    </div>
                  </div>

                  {request.status === "pending" && (
                    <div className="responder-request-notice pending">
                      <span>!</span>

                      <p>
                        This request is available.
                        Accept only if you can
                        provide help.
                      </p>
                    </div>
                  )}

                  {request.status === "fulfilled" && (
                    <div className="responder-request-notice accepted">
                      <span>✓</span>

                      <p>
                        You accepted this request.
                        Navigate to the requester
                        and provide assistance.
                      </p>
                    </div>
                  )}

                  {request.status ===
                    "waiting_verification" && (
                    <div className="responder-request-notice verifying">
                      <span>⌛</span>

                      <p>
                        You marked this request
                        completed. Waiting for
                        requester verification.
                      </p>
                    </div>
                  )}

                  <footer className="responder-card-actions">
                    {/* Pending:
                        exact location is hidden */}

                    {request.status === "pending" && (
                      <button
                        className="accept-help-button"
                        disabled={
                          acceptingId ===
                          request._id
                        }
                        onClick={() =>
                          acceptRequest(
                            request._id
                          )
                        }
                      >
                        {acceptingId ===
                        request._id
                          ? "Accepting..."
                          : "Accept Request"}
                      </button>
                    )}

                    {/* Fulfilled:
                        assigned responder can open map */}

                    {request.status ===
                      "fulfilled" && (
                      <>
                        <button
                          className="responder-map-button"
                          onClick={() =>
                            openGoogleMaps(request)
                          }
                        >
                          Open Google Maps
                        </button>

                        <button
                          className="complete-help-button"
                          disabled={
                            completingId ===
                            request._id
                          }
                          onClick={() =>
                            completeRequest(
                              request._id
                            )
                          }
                        >
                          {completingId ===
                          request._id
                            ? "Completing..."
                            : "Mark Completed"}
                        </button>
                      </>
                    )}

                    {request.status ===
                      "waiting_verification" && (
                      <button
                        className="responder-map-button full"
                        onClick={() =>
                          openGoogleMaps(request)
                        }
                      >
                        Open Requester Location
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
};

export default ResponderDashboard;