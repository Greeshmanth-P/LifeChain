import React, { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    users: {
      total: 0,
      requesters: 0,
      responders: 0,
      admins: 0
    },
    requests: {
      total: 0,
      pending: 0,
      fulfilled: 0,
      waitingVerification: 0,
      completed: 0
    }
  });

  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);

  const [activeSection, setActiveSection] = useState("overview");

  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");

  const [requestSearch, setRequestSearch] = useState("");
  const [requestStatusFilter, setRequestStatusFilter] = useState("all");

  const [editingUserId, setEditingUserId] = useState(null);
  const [editingRequestId, setEditingRequestId] = useState(null);

  const [userForm, setUserForm] = useState({
    name: "",
    phone: "",
    role: []
  });

  const [requestForm, setRequestForm] = useState({
    helpType: "",
    description: "",
    status: "",
    responderId: ""
  });

  const [loading, setLoading] = useState(true);

  const isAdmin =
    loggedInUser &&
    Array.isArray(loggedInUser.role) &&
    loggedInUser.role.includes("admin");

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = async () => {
    try {
      setLoading(true);

      const [statsResponse, usersResponse, requestsResponse] =
        await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/users"),
          api.get("/admin/requests")
        ]);

      setStats(statsResponse.data);
      setUsers(usersResponse.data);
      setRequests(requestsResponse.data);
    } catch (error) {
      console.error("Admin data loading error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load admin dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshStatistics = async () => {
    try {
      const response = await api.get("/admin/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Statistics refresh failed:", error);
    }
  };

  const startEditingUser = user => {
    setEditingUserId(user._id);

    setUserForm({
      name: user.name || "",
      phone: user.phone || "",
      role: Array.isArray(user.role) ? user.role : []
    });
  };

  const cancelEditingUser = () => {
    setEditingUserId(null);

    setUserForm({
      name: "",
      phone: "",
      role: []
    });
  };

  const handleRoleChange = roleName => {
    setUserForm(previousForm => {
      const roleAlreadySelected = previousForm.role.includes(roleName);

      return {
        ...previousForm,
        role: roleAlreadySelected
          ? previousForm.role.filter(role => role !== roleName)
          : [...previousForm.role, roleName]
      };
    });
  };

  const saveUserChanges = async userId => {
    try {
      if (!userForm.name.trim()) {
        alert("User name is required");
        return;
      }

      if (!userForm.phone.trim()) {
        alert("Phone number is required");
        return;
      }

      if (userForm.role.length === 0) {
        alert("Select at least one role");
        return;
      }

      const response = await api.put(
        `/admin/users/${userId}`,
        userForm
      );

      setUsers(previousUsers =>
        previousUsers.map(user =>
          user._id === userId ? response.data.user : user
        )
      );

      cancelEditingUser();
      await refreshStatistics();

      alert("User updated successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update user"
      );
    }
  };

  const deleteUser = async user => {
    const deletingCurrentAdmin =
      loggedInUser &&
      (user._id === loggedInUser._id ||
        user.phone === loggedInUser.phone);

    if (deletingCurrentAdmin) {
      alert("You cannot delete your own admin account");
      return;
    }

    const confirmed = window.confirm(
      `Delete user "${user.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/admin/users/${user._id}`);

      setUsers(previousUsers =>
        previousUsers.filter(item => item._id !== user._id)
      );

      await refreshStatistics();

      alert("User deleted successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  const startEditingRequest = request => {
    setEditingRequestId(request._id);

    setRequestForm({
      helpType: request.helpType || "",
      description: request.description || "",
      status: request.status || "pending",
      responderId: request.responder?._id || ""
    });
  };

  const cancelEditingRequest = () => {
    setEditingRequestId(null);

    setRequestForm({
      helpType: "",
      description: "",
      status: "",
      responderId: ""
    });
  };

  const saveRequestChanges = async requestId => {
    try {
      if (!requestForm.helpType.trim()) {
        alert("Help type is required");
        return;
      }

      const payload = {
        helpType: requestForm.helpType,
        description: requestForm.description,
        status: requestForm.status
      };

      if (requestForm.status === "pending") {
        payload.responderId = null;
      } else if (requestForm.responderId) {
        payload.responderId = requestForm.responderId;
      }

      const response = await api.put(
        `/admin/requests/${requestId}`,
        payload
      );

      setRequests(previousRequests =>
        previousRequests.map(request =>
          request._id === requestId
            ? response.data.request
            : request
        )
      );

      cancelEditingRequest();
      await refreshStatistics();

      alert("Help request updated successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update help request"
      );
    }
  };

  const resetRequestToPending = async request => {
    const confirmed = window.confirm(
      `Reset "${request.helpType}" to pending?\n\nThe assigned responder will be removed.`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await api.put(
        `/admin/requests/${request._id}`,
        {
          status: "pending"
        }
      );

      setRequests(previousRequests =>
        previousRequests.map(item =>
          item._id === request._id
            ? response.data.request
            : item
        )
      );

      await refreshStatistics();

      alert("Request reset to pending");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to reset request"
      );
    }
  };

  const forceCompleteRequest = async request => {
    if (!request.responder) {
      alert(
        "Assign a responder before force-completing this request"
      );
      return;
    }

    const confirmed = window.confirm(
      `Force-complete "${request.helpType}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await api.put(
        `/admin/requests/${request._id}`,
        {
          status: "completed"
        }
      );

      setRequests(previousRequests =>
        previousRequests.map(item =>
          item._id === request._id
            ? response.data.request
            : item
        )
      );

      await refreshStatistics();

      alert("Request marked as completed");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to complete request"
      );
    }
  };

  const deleteRequest = async request => {
    const confirmed = window.confirm(
      `Delete "${request.helpType}" permanently?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/admin/requests/${request._id}`
      );

      setRequests(previousRequests =>
        previousRequests.filter(
          item => item._id !== request._id
        )
      );

      await refreshStatistics();

      alert("Request deleted successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete request"
      );
    }
  };

  const openLocation = location => {
    const coordinates = location?.coordinates;

    if (!coordinates || coordinates.length !== 2) {
      alert("Location is unavailable");
      return;
    }

    const [longitude, latitude] = coordinates;

    window.open(
      `https://www.google.com/maps?q=${latitude},${longitude}`,
      "_blank"
    );
  };

  const filteredUsers = useMemo(() => {
    const searchValue = userSearch.toLowerCase().trim();

    return users.filter(user => {
      const matchesSearch =
        !searchValue ||
        user.name?.toLowerCase().includes(searchValue) ||
        user.phone?.toLowerCase().includes(searchValue);

      const matchesRole =
        userRoleFilter === "all" ||
        user.role?.includes(userRoleFilter);

      return matchesSearch && matchesRole;
    });
  }, [users, userSearch, userRoleFilter]);

  const filteredRequests = useMemo(() => {
    const searchValue = requestSearch.toLowerCase().trim();

    return requests.filter(request => {
      const matchesSearch =
        !searchValue ||
        request.helpType?.toLowerCase().includes(searchValue) ||
        request.description?.toLowerCase().includes(searchValue) ||
        request.requester?.name
          ?.toLowerCase()
          .includes(searchValue) ||
        request.responder?.name
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        requestStatusFilter === "all" ||
        request.status === requestStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, requestSearch, requestStatusFilter]);

  const responderUsers = users.filter(user =>
    user.role?.includes("responder")
  );

  if (!isAdmin) {
    return (
      <div className="admin-access-denied">
        <h2>Access Denied</h2>
        <p>Only administrators can access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-loading">
        Loading LifeChain Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div>
          <h2>LifeChain</h2>
          <p>Admin Control Panel</p>
        </div>

        <nav>
          <button
            className={
              activeSection === "overview" ? "active" : ""
            }
            onClick={() => setActiveSection("overview")}
          >
            Overview
          </button>

          <button
            className={
              activeSection === "users" ? "active" : ""
            }
            onClick={() => setActiveSection("users")}
          >
            Users
          </button>

          <button
            className={
              activeSection === "requests" ? "active" : ""
            }
            onClick={() => setActiveSection("requests")}
          >
            Help Requests
          </button>
        </nav>

        <div className="admin-profile">
          <strong>{loggedInUser.name}</strong>
          <span>{loggedInUser.phone}</span>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage LifeChain users and help requests.</p>
          </div>

          <button
            className="refresh-button"
            onClick={loadAdminData}
          >
            Refresh Data
          </button>
        </header>

        {activeSection === "overview" && (
          <section>
            <h2 className="section-title">
              Dashboard Overview
            </h2>

            <div className="stats-grid">
              <StatCard
                title="Total Users"
                value={stats.users.total}
              />

              <StatCard
                title="Requesters"
                value={stats.users.requesters}
              />

              <StatCard
                title="Responders"
                value={stats.users.responders}
              />

              <StatCard
                title="Admins"
                value={stats.users.admins}
              />

              <StatCard
                title="Total Requests"
                value={stats.requests.total}
              />

              <StatCard
                title="Pending"
                value={stats.requests.pending}
              />

              <StatCard
                title="Accepted"
                value={stats.requests.fulfilled}
              />

              <StatCard
                title="Waiting Verification"
                value={stats.requests.waitingVerification}
              />

              <StatCard
                title="Completed"
                value={stats.requests.completed}
              />
            </div>

            <div className="overview-panels">
              <div className="overview-panel">
                <h3>Recent Users</h3>

                {users.slice(0, 5).map(user => (
                  <div
                    className="recent-item"
                    key={user._id}
                  >
                    <div>
                      <strong>{user.name}</strong>
                      <p>{user.phone}</p>
                    </div>

                    <span>
                      {user.role?.join(", ")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="overview-panel">
                <h3>Recent Requests</h3>

                {requests.slice(0, 5).map(request => (
                  <div
                    className="recent-item"
                    key={request._id}
                  >
                    <div>
                      <strong>{request.helpType}</strong>
                      <p>
                        {request.requester?.name ||
                          "Unknown requester"}
                      </p>
                    </div>

                    <StatusBadge status={request.status} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeSection === "users" && (
          <section>
            <div className="section-heading">
              <div>
                <h2>User Management</h2>
                <p>
                  View, edit roles, update details and delete
                  users.
                </p>
              </div>

              <span>
                Showing {filteredUsers.length} users
              </span>
            </div>

            <div className="filter-bar">
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={userSearch}
                onChange={event =>
                  setUserSearch(event.target.value)
                }
              />

              <select
                value={userRoleFilter}
                onChange={event =>
                  setUserRoleFilter(event.target.value)
                }
              >
                <option value="all">All Roles</option>
                <option value="requester">Requester</option>
                <option value="responder">Responder</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Roles</th>
                    <th>Skills</th>
                    <th>Joined</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map(user => (
                    <React.Fragment key={user._id}>
                      <tr>
                        <td>{user.name}</td>
                        <td>{user.phone}</td>

                        <td>
                          <div className="role-list">
                            {user.role?.map(role => (
                              <span
                                className="role-badge"
                                key={role}
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td>
                          {user.skills?.length
                            ? user.skills.join(", ")
                            : "No skills"}
                        </td>

                        <td>
                          {user.createdAt
                            ? new Date(
                                user.createdAt
                              ).toLocaleDateString()
                            : "Unavailable"}
                        </td>

                        <td>
                          <button
                            className="small-button"
                            onClick={() =>
                              openLocation(user.location)
                            }
                          >
                            Open Map
                          </button>
                        </td>

                        <td>
                          <div className="action-buttons">
                            <button
                              className="edit-button"
                              onClick={() =>
                                startEditingUser(user)
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="delete-button"
                              onClick={() =>
                                deleteUser(user)
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>

                      {editingUserId === user._id && (
                        <tr className="edit-row">
                          <td colSpan="7">
                            <div className="edit-panel">
                              <h3>Edit User</h3>

                              <div className="form-grid">
                                <label>
                                  Name
                                  <input
                                    value={userForm.name}
                                    onChange={event =>
                                      setUserForm({
                                        ...userForm,
                                        name: event.target.value
                                      })
                                    }
                                  />
                                </label>

                                <label>
                                  Phone
                                  <input
                                    value={userForm.phone}
                                    onChange={event =>
                                      setUserForm({
                                        ...userForm,
                                        phone: event.target.value
                                      })
                                    }
                                  />
                                </label>
                              </div>

                              <div className="role-checkboxes">
                                <label>
                                  <input
                                    type="checkbox"
                                    checked={userForm.role.includes(
                                      "requester"
                                    )}
                                    onChange={() =>
                                      handleRoleChange(
                                        "requester"
                                      )
                                    }
                                  />
                                  Requester
                                </label>

                                <label>
                                  <input
                                    type="checkbox"
                                    checked={userForm.role.includes(
                                      "responder"
                                    )}
                                    onChange={() =>
                                      handleRoleChange(
                                        "responder"
                                      )
                                    }
                                  />
                                  Responder
                                </label>

                                <label>
                                  <input
                                    type="checkbox"
                                    checked={userForm.role.includes(
                                      "admin"
                                    )}
                                    onChange={() =>
                                      handleRoleChange("admin")
                                    }
                                  />
                                  Admin
                                </label>
                              </div>

                              <div className="edit-actions">
                                <button
                                  className="save-button"
                                  onClick={() =>
                                    saveUserChanges(user._id)
                                  }
                                >
                                  Save Changes
                                </button>

                                <button
                                  className="cancel-button"
                                  onClick={cancelEditingUser}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="7" className="empty-message">
                        No matching users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "requests" && (
          <section>
            <div className="section-heading">
              <div>
                <h2>Help Request Management</h2>
                <p>
                  Edit, reassign, reset, complete or delete
                  requests.
                </p>
              </div>

              <span>
                Showing {filteredRequests.length} requests
              </span>
            </div>

            <div className="filter-bar">
              <input
                type="text"
                placeholder="Search requests..."
                value={requestSearch}
                onChange={event =>
                  setRequestSearch(event.target.value)
                }
              />

              <select
                value={requestStatusFilter}
                onChange={event =>
                  setRequestStatusFilter(event.target.value)
                }
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="fulfilled">Accepted</option>
                <option value="waiting_verification">
                  Waiting Verification
                </option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Help Type</th>
                    <th>Requester</th>
                    <th>Responder</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRequests.map(request => (
                    <React.Fragment key={request._id}>
                      <tr>
                        <td>
                          <strong>{request.helpType}</strong>
                          <p className="description-text">
                            {request.description ||
                              "No description"}
                          </p>
                        </td>

                        <td>
                          {request.requester?.name ||
                            "Deleted user"}
                          <p className="description-text">
                            {request.requester?.phone || ""}
                          </p>
                        </td>

                        <td>
                          {request.responder?.name ||
                            "Not assigned"}
                          <p className="description-text">
                            {request.responder?.phone || ""}
                          </p>
                        </td>

                        <td>
                          <StatusBadge
                            status={request.status}
                          />
                        </td>

                        <td>
                          {request.createdAt
                            ? new Date(
                                request.createdAt
                              ).toLocaleString()
                            : "Unavailable"}
                        </td>

                        <td>
                          <button
                            className="small-button"
                            onClick={() =>
                              openLocation(request.location)
                            }
                          >
                            Open Map
                          </button>
                        </td>

                        <td>
                          <div className="action-buttons">
                            <button
                              className="edit-button"
                              onClick={() =>
                                startEditingRequest(request)
                              }
                            >
                              Edit
                            </button>

                            {request.status !== "pending" && (
                              <button
                                className="reset-button"
                                onClick={() =>
                                  resetRequestToPending(
                                    request
                                  )
                                }
                              >
                                Reset
                              </button>
                            )}

                            {request.status !== "completed" && (
                              <button
                                className="complete-button"
                                onClick={() =>
                                  forceCompleteRequest(
                                    request
                                  )
                                }
                              >
                                Complete
                              </button>
                            )}

                            <button
                              className="delete-button"
                              onClick={() =>
                                deleteRequest(request)
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>

                      {editingRequestId ===
                        request._id && (
                        <tr className="edit-row">
                          <td colSpan="7">
                            <div className="edit-panel">
                              <h3>Edit Help Request</h3>

                              <div className="form-grid">
                                <label>
                                  Help Type
                                  <input
                                    value={
                                      requestForm.helpType
                                    }
                                    onChange={event =>
                                      setRequestForm({
                                        ...requestForm,
                                        helpType:
                                          event.target.value
                                      })
                                    }
                                  />
                                </label>

                                <label>
                                  Status
                                  <select
                                    value={
                                      requestForm.status
                                    }
                                    onChange={event =>
                                      setRequestForm({
                                        ...requestForm,
                                        status:
                                          event.target.value,
                                        responderId:
                                          event.target.value ===
                                          "pending"
                                            ? ""
                                            : requestForm.responderId
                                      })
                                    }
                                  >
                                    <option value="pending">
                                      Pending
                                    </option>
                                    <option value="fulfilled">
                                      Accepted
                                    </option>
                                    <option value="waiting_verification">
                                      Waiting Verification
                                    </option>
                                    <option value="completed">
                                      Completed
                                    </option>
                                  </select>
                                </label>

                                <label>
                                  Assigned Responder
                                  <select
                                    value={
                                      requestForm.responderId
                                    }
                                    disabled={
                                      requestForm.status ===
                                      "pending"
                                    }
                                    onChange={event =>
                                      setRequestForm({
                                        ...requestForm,
                                        responderId:
                                          event.target.value
                                      })
                                    }
                                  >
                                    <option value="">
                                      Select responder
                                    </option>

                                    {responderUsers.map(
                                      responder => (
                                        <option
                                          key={responder._id}
                                          value={responder._id}
                                        >
                                          {responder.name} -{" "}
                                          {responder.phone}
                                        </option>
                                      )
                                    )}
                                  </select>
                                </label>
                              </div>

                              <label className="full-width-field">
                                Description
                                <textarea
                                  rows="4"
                                  value={
                                    requestForm.description
                                  }
                                  onChange={event =>
                                    setRequestForm({
                                      ...requestForm,
                                      description:
                                        event.target.value
                                    })
                                  }
                                />
                              </label>

                              <div className="edit-actions">
                                <button
                                  className="save-button"
                                  onClick={() =>
                                    saveRequestChanges(
                                      request._id
                                    )
                                  }
                                >
                                  Save Changes
                                </button>

                                <button
                                  className="cancel-button"
                                  onClick={
                                    cancelEditingRequest
                                  }
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}

                  {filteredRequests.length === 0 && (
                    <tr>
                      <td colSpan="7" className="empty-message">
                        No matching requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
  );
}

function StatusBadge({ status }) {
  const labels = {
    pending: "Pending",
    fulfilled: "Accepted",
    waiting_verification: "Waiting Verification",
    completed: "Completed"
  };

  return (
    <span className={`status-badge status-${status}`}>
      {labels[status] || status}
    </span>
  );
}

export default AdminDashboard;