// import React, {
//   useEffect,
//   useState
// } from "react";

// import api from "../api/api";

// const HelpRequest = () => {
//   const [helpType, setHelpType] = useState("");
//   const [description, setDescription] =
//     useState("");
//   const [latitude, setLatitude] =
//     useState(null);
//   const [longitude, setLongitude] =
//     useState(null);
//   const [message, setMessage] =
//     useState("");
//   const [submitting, setSubmitting] =
//     useState(false);
//   const [locationLoading, setLocationLoading] =
//     useState(true);

//   const storedUser = localStorage.getItem("user");

//   let user = null;

//   try {
//     user = storedUser
//       ? JSON.parse(storedUser)
//       : null;
//   } catch (error) {
//     console.error(
//       "Invalid user data in localStorage:",
//       error
//     );
//   }

//   const phone = user?.phone;

//   useEffect(() => {
//     if (!navigator.geolocation) {
//       setMessage(
//         "Geolocation is not supported by this browser"
//       );
//       setLocationLoading(false);
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       position => {
//         setLatitude(position.coords.latitude);
//         setLongitude(position.coords.longitude);
//         setLocationLoading(false);
//       },
//       error => {
//         console.error(
//           "Location access error:",
//           error
//         );

//         setMessage(
//           "Unable to detect location. Please allow location access."
//         );

//         setLocationLoading(false);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 0
//       }
//     );
//   }, []);

//   const submitHelpRequest = async event => {
//     event.preventDefault();

//     const cleanedHelpType = helpType.trim();
//     const cleanedDescription =
//       description.trim();

//     if (!phone) {
//       setMessage(
//         "Login information is missing. Please login again."
//       );
//       return;
//     }

//     if (!cleanedHelpType) {
//       setMessage("Please enter the help type");
//       return;
//     }

//     if (
//       !Number.isFinite(latitude) ||
//       !Number.isFinite(longitude)
//     ) {
//       setMessage(
//         "Your location is not available yet"
//       );
//       return;
//     }

//     try {
//       setSubmitting(true);
//       setMessage("");

//       const response = await api.post(
//         "/help-requests/create",
//         {
//           phone,
//           helpType: cleanedHelpType,
//           description: cleanedDescription,
//           latitude,
//           longitude
//         }
//       );

//       setMessage(
//         response.data?.message ||
//           "Help request created successfully"
//       );

//       setHelpType("");
//       setDescription("");
//     } catch (error) {
//       console.error(
//         "Create request error:",
//         error.response?.data || error.message
//       );

//       setMessage(
//         error.response?.data?.message ||
//           "Failed to create help request"
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>Create Help Request</h2>

//       {locationLoading && (
//         <p>Detecting your location...</p>
//       )}

//       <form onSubmit={submitHelpRequest}>
//         <input
//           value={helpType}
//           onChange={event =>
//             setHelpType(event.target.value)
//           }
//           placeholder="Help type"
//           maxLength={50}
//           required
//         />

//         <br />
//         <br />

//         <textarea
//           value={description}
//           onChange={event =>
//             setDescription(event.target.value)
//           }
//           placeholder="Description"
//           maxLength={500}
//         />

//         <br />
//         <br />

//         <button
//           type="submit"
//           disabled={
//             submitting || locationLoading
//           }
//         >
//           {submitting
//             ? "Submitting..."
//             : "Submit"}
//         </button>
//       </form>

//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default HelpRequest;


















import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import api from "../api/api";
import "./HelpRequest.css";

const helpTypes = [
  "Medical Assistance",
  "Medicine",
  "Food",
  "Water",
  "Transportation",
  "Blood Donation",
  "Shelter",
  "Rescue Support",
  "Other"
];

const HelpRequest = () => {
  const navigate = useNavigate();

  const [helpType, setHelpType] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [latitude, setLatitude] =
    useState(null);

  const [longitude, setLongitude] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [locationLoading, setLocationLoading] =
    useState(true);

  const storedUser =
    localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    console.error(
      "Invalid user data:",
      error
    );
  }

  const phone = user?.phone;

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setMessage(
        "Geolocation is not supported by this browser."
      );

      setMessageType("error");
      setLocationLoading(false);
      return;
    }

    setLocationLoading(true);
    setMessage("");

    navigator.geolocation.getCurrentPosition(
      position => {
        setLatitude(
          position.coords.latitude
        );

        setLongitude(
          position.coords.longitude
        );

        setMessage(
          "Your location was detected successfully."
        );

        setMessageType("success");
        setLocationLoading(false);
      },
      error => {
        console.error(
          "Location error:",
          error
        );

        setMessage(
          "Unable to detect your location. Allow location access and try again."
        );

        setMessageType("error");
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

  const submitHelpRequest = async event => {
    event.preventDefault();

    const cleanedHelpType =
      helpType.trim();

    const cleanedDescription =
      description.trim();

    if (!phone) {
      setMessage(
        "Login information is missing. Please login again."
      );

      setMessageType("error");
      return;
    }

    if (!cleanedHelpType) {
      setMessage(
        "Please select the type of help you need."
      );

      setMessageType("error");
      return;
    }

    if (
      cleanedDescription.length < 10
    ) {
      setMessage(
        "Please provide at least 10 characters describing what help you need."
      );

      setMessageType("error");
      return;
    }

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      setMessage(
        "Your location is unavailable. Detect your location before submitting."
      );

      setMessageType("error");
      return;
    }

    const confirmed = window.confirm(
      "Submit this help request to nearby responders?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      const response = await api.post(
        "/help-requests/create",
        {
          phone,
          helpType: cleanedHelpType,
          description:
            cleanedDescription,
          latitude,
          longitude
        }
      );

      setMessage(
        response.data?.message ||
          "Help request created successfully."
      );

      setMessageType("success");
      setHelpType("");
      setDescription("");

      setTimeout(() => {
        navigate(
          "/dashboard/requester"
        );
      }, 1200);
    } catch (error) {
      console.error(
        "Create request error:",
        error.response?.data ||
          error.message
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to create help request."
      );

      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <main className="help-login-state">
        <h2>Please login again</h2>

        <button
          onClick={() =>
            navigate("/login")
          }
        >
          Go to Login
        </button>
      </main>
    );
  }

  return (
    <main className="help-request-page">
      <section className="help-request-information">
        <button
          className="help-back-button"
          onClick={() =>
            navigate(
              "/dashboard/requester"
            )
          }
        >
          ← Back to Dashboard
        </button>

        <span className="help-request-label">
          Create Request
        </span>

        <h1>
          Tell nearby responders what help
          you need.
        </h1>

        <p>
          Your request will be shown to
          users within approximately five
          kilometres of your current
          location.
        </p>

        <div className="help-safety-card">
          <strong>
            Important safety notice
          </strong>

          <p>
            LifeChain is a portfolio
            demonstration. For immediate
            danger, contact official
            emergency services.
          </p>
        </div>

        <div className="help-process-list">
          <div>
            <span>1</span>

            <p>
              Submit your help request.
            </p>
          </div>

          <div>
            <span>2</span>

            <p>
              A nearby responder accepts it.
            </p>
          </div>

          <div>
            <span>3</span>

            <p>
              Verify after help is completed.
            </p>
          </div>
        </div>
      </section>

      <section className="help-request-card">
        <header>
          <div className="help-form-icon">
            SOS
          </div>

          <div>
            <h2>New Help Request</h2>

            <p>
              Complete all required details.
            </p>
          </div>
        </header>

        <div
          className={
            locationLoading
              ? "location-status detecting"
              : Number.isFinite(latitude)
                ? "location-status detected"
                : "location-status error"
          }
        >
          <span>
            {locationLoading
              ? "⌛"
              : Number.isFinite(latitude)
                ? "✓"
                : "!"}
          </span>

          <div>
            <strong>
              {locationLoading
                ? "Detecting location"
                : Number.isFinite(latitude)
                  ? "Location detected"
                  : "Location unavailable"}
            </strong>

            <p>
              {locationLoading
                ? "Please allow location access."
                : Number.isFinite(latitude)
                  ? "Nearby responders can now be matched."
                  : "Enable location and try again."}
            </p>
          </div>

          {!locationLoading &&
            !Number.isFinite(
              latitude
            ) && (
              <button
                type="button"
                onClick={detectLocation}
              >
                Retry
              </button>
            )}
        </div>

        <form
          onSubmit={submitHelpRequest}
        >
          <label htmlFor="help-type">
            Type of help
          </label>

          <select
            id="help-type"
            value={helpType}
            onChange={event =>
              setHelpType(
                event.target.value
              )
            }
            required
          >
            <option value="">
              Select help type
            </option>

            {helpTypes.map(type => (
              <option
                key={type}
                value={type}
              >
                {type}
              </option>
            ))}
          </select>

          <label htmlFor="help-description">
            Describe what you need
          </label>

          <textarea
            id="help-description"
            value={description}
            onChange={event =>
              setDescription(
                event.target.value
              )
            }
            placeholder="Example: I need medicine delivered for an elderly person. The pharmacy is approximately one kilometre away."
            maxLength={500}
            rows={6}
            required
          />

          <div className="description-counter">
            <span>
              Minimum 10 characters
            </span>

            <span>
              {description.length}/500
            </span>
          </div>

          {message && (
            <div
              className={
                messageType === "success"
                  ? "help-message success"
                  : "help-message error"
              }
            >
              {message}
            </div>
          )}

          <button
            className="submit-help-button"
            type="submit"
            disabled={
              submitting ||
              locationLoading
            }
          >
            {submitting
              ? "Submitting Request..."
              : locationLoading
                ? "Detecting Location..."
                : "Send Request to Nearby Responders"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default HelpRequest;