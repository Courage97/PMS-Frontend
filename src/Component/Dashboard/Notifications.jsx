import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState({ task: null, team: null, user: null });
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      setError("No authentication token found.");
      return;
    }

    let eventSource = new EventSource(
      `http://127.0.0.1:8000/notifications/stream/?token=${token}`
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.error) {
          setError(`SSE Error: ${data.error}`);
          return;
        }

        // Get the latest notifications
        const latestTask = data.tasks.length > 0 ? data.tasks[data.tasks.length - 1] : null;
        const latestTeam = data.teams.length > 0 ? data.teams[data.teams.length - 1] : null;
        const latestUser = data.users.length > 0 ? data.users[data.users.length - 1] : null;

        // Check if new notifications exist
        const isNewTask = latestTask && latestTask.id !== notifications.task?.id;
        const isNewTeam = latestTeam && latestTeam.id !== notifications.team?.id;
        const isNewUser = latestUser && latestUser.id !== notifications.user?.id;

        // Update unreadCount only if there's a new notification
        if (isNewTask || isNewTeam || isNewUser) {
          setUnreadCount((prev) => prev + 1);
        }

        // Update notifications state
        setNotifications({ task: latestTask, team: latestTeam, user: latestUser });

      } catch (error) {
        setError(error.data?.message?.response || "Failed to process incoming notifications.");
      }
    };

    eventSource.onerror = () => {
      setError("SSE connection failed. Reconnecting...");
      eventSource.close();

      // Reconnect after a delay
      setTimeout(() => {
        eventSource = new EventSource(
          `http://127.0.0.1:8000/notifications/stream/?token=${token}`
        );
      }, 5000); // Reconnect after 5 seconds
    };

    return () => {
      eventSource.close();
    };
  }, [token, notifications]); // Add `notifications` to the dependency array

  const resetUnreadCount = () => {
    setUnreadCount(0);
  };

  return (
    <div className="relative bg-white p-4 shadow-md rounded-lg w-full max-w-md mx-auto">
      <h3 className="text-lg font-semibold flex items-center">
        🔔 Notifications
        {unreadCount > 0 && (
          <span className="ml-2 bg-red-500 text-white px-2 py-1 text-xs rounded-full">
            {unreadCount}
          </span>
        )}
      </h3>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="mt-3 space-y-3">
        {!notifications.task && !notifications.team && !notifications.user ? (
          <p className="text-gray-500 text-sm">No new notifications</p>
        ) : (
          <>
            {notifications.task && (
              <Link to="/tasks" className="block bg-gray-100 p-3 rounded-md hover:bg-gray-200">
                📌 <strong>{notifications.task.title}</strong>
                <p className="text-xs text-gray-600">{notifications.task.description}</p>
              </Link>
            )}
            {notifications.team && (
              <Link to="/teamlist" className="block bg-gray-100 p-3 rounded-md hover:bg-gray-200">
                👥 <strong>{notifications.team.name}</strong>
                <p className="text-xs text-gray-600">{notifications.team.description}</p>
              </Link>
            )}
            {notifications.user && (
              <div className="bg-gray-100 p-3 rounded-md">
                🆕 <strong>{notifications.user.email}</strong>
                <p className="text-xs text-gray-600">Role: {notifications.user.role}</p>
              </div>
            )}
          </>
        )}
      </div>

      <button
        onClick={resetUnreadCount}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Mark as Read
      </button>
    </div>
  );
};

export default Notifications;