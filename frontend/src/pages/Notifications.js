import React, {
  useCallback,
  useEffect,
  useState
} from "react";

import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Notifications.css";

const Notifications = () => {
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
      "Invalid user data:",
      error
    );
  }

  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [unreadCount, setUnreadCount] =
    useState(0);

  const fetchNotifications =
    useCallback(async () => {
      if (!user?.phone) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(
          "/notifications/my",
          {
            params: {
              phone: user.phone
            }
          }
        );

        const receivedNotifications =
          response.data?.notifications || [];

        setNotifications(
          receivedNotifications
        );

        setUnreadCount(
          response.data?.unreadCount || 0
        );

        setMessage("");
      } catch (error) {
        console.error(
          "Notification fetch error:",
          error
        );

        setMessage(
          error.response?.data?.message ||
            "Failed to load notifications"
        );
      } finally {
        setLoading(false);
      }
    }, [user?.phone]);

  useEffect(() => {
    fetchNotifications();

    const intervalId = setInterval(
      fetchNotifications,
      5000
    );

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchNotifications]);

  const openNotification = async notification => {
    try {
      await api.delete(
        `/notifications/${notification._id}`,
        {
          params: {
            phone: user.phone
          }
        }
      );

      setNotifications(previous =>
        previous.filter(
          item =>
            item._id !== notification._id
        )
      );

      if (!notification.seen) {
        setUnreadCount(previous =>
          Math.max(0, previous - 1)
        );
      }

      const requestStatus =
        notification.helpRequest?.status;

      if (
        requestStatus === "pending" ||
        requestStatus === "fulfilled"
      ) {
        navigate("/dashboard/responder");
        return;
      }

      if (
        requestStatus ===
        "waiting_verification"
      ) {
        navigate("/dashboard/requester");
      }
    } catch (error) {
      console.error(
        "Open notification error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to remove notification"
      );
    }
  };

  const clearAllNotifications = async () => {
    const confirmed = window.confirm(
      "Remove all notifications?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        "/notifications/clear/all",
        {
          data: {
            phone: user.phone
          }
        }
      );

      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Clear notifications error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to clear notifications"
      );
    }
  };

  if (!user) {
    return (
      <div className="notification-state">
        <h2>Please login again</h2>

        <button
          onClick={() =>
            navigate("/login")
          }
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <main className="notifications-page">
      <section className="notifications-shell">
        <header className="notifications-header">
          <div>
            <span className="page-label">
              LifeChain Alerts
            </span>

            <h1>Notifications</h1>

            <p>
              Stay updated about nearby help
              requests and request progress.
            </p>

            <p className="notification-hint">
              Click a notification to open it and
              remove it.
            </p>
          </div>

          <div className="notification-actions">
            <span className="unread-pill">
              {unreadCount} unread
            </span>

            {notifications.length > 0 && (
              <button
                className="mark-all-button"
                onClick={
                  clearAllNotifications
                }
              >
                Clear all
              </button>
            )}
          </div>
        </header>

        {loading && (
          <div className="notification-state">
            <div className="notification-loader" />
            <p>Loading notifications...</p>
          </div>
        )}

        {!loading && message && (
          <div className="notification-error">
            {message}
          </div>
        )}

        {!loading &&
          !message &&
          notifications.length === 0 && (
            <div className="notification-state empty">
              <div className="empty-bell">
                🔔
              </div>

              <h2>No notifications yet</h2>

              <p>
                New request updates will appear
                here.
              </p>
            </div>
          )}

        {!loading &&
          !message &&
          notifications.length > 0 && (
            <div className="notification-list">
              {notifications.map(
                notification => (
                  <article
                    key={notification._id}
                    className="notification-card unread"
                    onClick={() =>
                      openNotification(
                        notification
                      )
                    }
                  >
                    <div className="notification-icon">
                      !
                    </div>

                    <div className="notification-content">
                      <div className="notification-top">
                        <h3>
                          {notification
                            .helpRequest
                            ?.helpType ||
                            "LifeChain update"}
                        </h3>

                        <span className="new-badge">
                          Open
                        </span>
                      </div>

                      <p>
                        {notification.message}
                      </p>

                      <time>
                        {notification.createdAt
                          ? new Date(
                              notification.createdAt
                            ).toLocaleString()
                          : ""}
                      </time>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
      </section>
    </main>
  );
};

export default Notifications;