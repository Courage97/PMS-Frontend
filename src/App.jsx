import { BrowserRouter, Routes, Route,  } from "react-router-dom";
import { useState } from "react";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
// import Logout from"./Pages/Logout";
import NotFound from "./Pages/NotFound";
import ProtectedRoute from "./Component/ProtectedRoute";
import Dashboard from "./Component/Dashboard/Dashboard";
import TeamList from "./Component/Dashboard/TeamList";
import CreateTeam from "./Component/Dashboard/CreateTeam";
import ManageUser from "./Component/Dashboard/ManageUser";
import TaskForm from "./Component/Task Management/TaskForm";
import TaskList from "./Component/Task Management/TaskList";
import Data from "./Component/Dashboard/Data";

// const Logout = () => {
//   localStorage.clear();
//   return <Navigate to="/login" />;
// };

// Logout();

const App = () => {
  const [tasks, setTasks] = useState([]);  // state to hold tasks
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/teamlist" element={<TeamList />} />
        <Route path="/createteam" element={<CreateTeam />} />
        <Route path="/manage-users" element={<ManageUser />} />
        <Route path="/taskform" element={<TaskForm setTasks={setTasks} onClose={() => console.log("Form closed")} />} />
        <Route path="/tasks" element={<TaskList tasks={tasks} setTasks={setTasks} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/data" element={<Data />} />
        {/* <Route path="/logout" element={<Logout />} /> */}
      </Routes>
    </BrowserRouter>
    
  );
};

export default App;
