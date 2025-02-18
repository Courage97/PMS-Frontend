import { useState } from "react";
import TaskForm from "./TaskForm";  // Adjust the import according to your project structure

const ParentComponent = () => {
  const [tasks, setTasks] = useState([]);  // Define setTasks here

  // Function to close the form
  const handleClose = () => {
    console.log("Form closed.");
  };

  return (
    <div>
      {/* Pass setTasks and handleClose to TaskForm */}
      <TaskForm setTasks={setTasks} onClose={handleClose} existingTask={null} />
      
      <div>
        <h2>Tasks:</h2>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ParentComponent;
