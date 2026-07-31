// import React from 'react';

// const Home = () => {
//   return <h2>Welcome to LifeChain - Home</h2>;
// };

// export default Home;













// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const Home = () => {
//   const navigate = useNavigate();

//   return (
//     <div style={{ textAlign: 'center', marginTop: '80px' }}>
//       <h1>Welcome to LifeChain</h1>
//       <p>Help or Get Help Nearby</p>

//       <button onClick={() => navigate('/login')} style={{ marginRight: '20px' }}>
//         Login
//       </button>

//       <button onClick={() => navigate('/register')}>
//         Register
//       </button>
//     </div>
//   );
// };

// export default Home;







import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-label">
            Community Assistance Platform
          </span>

          <h1>
            Help reaches people faster with{" "}
            <span>LifeChain.</span>
          </h1>

          <p>
            Create a help request, connect with nearby
            responders and follow the request until it is
            safely completed.
          </p>

          <div className="hero-actions">
            <button
              className="hero-primary"
              onClick={() => navigate("/register")}
            >
              Join LifeChain
            </button>

            <button
              className="hero-secondary"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>

          <div className="hero-trust-row">
            <span>✓ Nearby matching</span>
            <span>✓ Location tracking</span>
            <span>✓ Verified completion</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-main-card">
            <div className="visual-card-header">
              <div className="visual-icon">SOS</div>

              <div>
                <strong>Emergency assistance</strong>
                <small>Request available nearby</small>
              </div>

              <span className="live-badge">
                Live
              </span>
            </div>

            <div className="visual-information">
              <div>
                <small>Help type</small>
                <strong>Medicine</strong>
              </div>

              <div>
                <small>Distance</small>
                <strong>1.8 km</strong>
              </div>
            </div>

            <div className="visual-progress">
              <div className="visual-progress-line" />

              <div className="progress-step completed">
                <span>1</span>
                <p>Requested</p>
              </div>

              <div className="progress-step completed">
                <span>2</span>
                <p>Accepted</p>
              </div>

              <div className="progress-step">
                <span>3</span>
                <p>Verified</p>
              </div>
            </div>
          </div>

          <div className="floating-card responder-card">
            <span>✓</span>

            <div>
              <strong>Responder assigned</strong>
              <small>Help is on the way</small>
            </div>
          </div>

          <div className="floating-card location-card">
            <span>⌖</span>

            <div>
              <strong>Live location</strong>
              <small>Accurate nearby matching</small>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading-center">
          <span>How LifeChain works</span>
          <h2>One request. One responder. Clear progress.</h2>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-number">01</div>
            <h3>Create a request</h3>
            <p>
              Explain what help you need and automatically
              share your current location.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-number">02</div>
            <h3>Connect nearby</h3>
            <p>
              Responders within five kilometres can discover
              and accept an active request.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-number">03</div>
            <h3>Verify completion</h3>
            <p>
              The requester confirms that the help was
              completed before closing the request.
            </p>
          </article>
        </div>
      </section>

      <section className="home-disclaimer">
        <strong>Portfolio MVP</strong>

        <p>
          LifeChain is currently a demonstration platform and
          should not replace official emergency services.
        </p>
      </section>
    </main>
  );
};

export default Home;