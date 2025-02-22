import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../index.css';

// Define the shape of a task
interface Task {
  id: string;
  title: string;
  description: string;
  is_complete: boolean;
}

const TaskDashboard: React.FC = () => {
  const url = process.env.REACT_APP_BACKEND_TASKS_URL || "";
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalEdit, setIsModalEdit] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<Task>({
    id: "",
    title: "",
    description: "",
    is_complete: false,
  });

  const navigate = useNavigate();

  // Fetch tasks from the backend
  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get<Task[]>(url, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [url]);

  // Check if the user is logged in (token exists in localStorage)
  const isLoggedIn = localStorage.getItem("token");
  useEffect(() => {
    if (!isLoggedIn) {
      alert("Login to get into the application.");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchTasks();
    }
  }, [isLoggedIn, fetchTasks]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Handle navigation away from the dashboard
    const handlePopState = () => {
      localStorage.removeItem("token");
      navigate("/login");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  // To open modal for adding a new task
  const createTaskBtn = () => {
    setCurrentTask({
      id: "",
      title: "",
      description: "",
      is_complete: false,
    });
    setIsModalOpen(true);
    setIsModalEdit(false);
  };

  // To open modal for editing a task
  const editTaskBtn = (task: Task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
    setIsModalEdit(true);
  };

  // To close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setIsModalEdit(false);
  };

  // To handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentTask({ ...currentTask, [name]: value });
  };

  // To handle form submission (POST or PUT request)
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const method = isModalEdit ? "PUT" : "POST";
    const upd_url = isModalEdit ? `${url}/${currentTask.id}` : url;
    try {
      const response = await axios({
        method,
        url: upd_url,
        data: currentTask,
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });

      if (isModalEdit) {
        setTasks(tasks.map((task) => (task.id === currentTask.id ? response.data : task)));
      } else {
        setTasks([...tasks, response.data]);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  // To delete a task
  const deleteTaskBtn = async (id: string) => {
    try {
      await axios.delete(`${url}/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Toggle task completion status
  const toggleComplete = async (task: Task) => {
    try {
      const updatedTask = { ...task, is_complete: !task.is_complete };
      await axios.put(`${url}/${task.id}`, updatedTask, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar currentPage="dashboard" />
      <div className="content">
        <div className="tasks-container">
          <div className="heading">
            <h2>Tasks</h2>
            <input
              type="button"
              className="btn btn-primary"
              value="Add New Task"
              onClick={createTaskBtn}
            />
          </div>

          {/* Pop-up modal for Add/Edit Task */}
          {isModalOpen && (
            <div
              className="modal"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
              }}
            >
              <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "5px" }}>
                <span onClick={closeModal} style={{ float: "right", cursor: "pointer" }}>
                  &times;
                </span>{" "}
                <br />
                <form onSubmit={submitHandler} className="form-task-dashboard" autoComplete="off">
                  <div className="form-group-task-dashboard">
                    <label>Title</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Title"
                      value={currentTask.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group-task-dashboard">
                    <label>Description</label>
                    <textarea
                      name="description"
                      placeholder="Description"
                      value={currentTask.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  {isModalEdit && (
                    <div className="form-group-task-dashboard">
                      <label>Status</label>
                      <select
                        name="is_complete"
                        value={currentTask.is_complete ? "true" : "false"}
                        onChange={handleInputChange}
                      >
                        <option value="false">Pending</option>
                        <option value="true">Completed</option>
                      </select>
                    </div>
                  )}
                  <div className="form-group-task-dashboard">
                    <input
                      type="submit"
                      className="btn btn-primary"
                      value={isModalEdit ? "Update Task" : "Add Task"}
                    />
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Task List */}
          {tasks.length === 0 ? (
            <p className="no-tasks-message">
              <div>
                Start adding tasks...
              </div>
            </p>
          ) : (
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className={`table-row ${task.is_complete ? "completed" : "pending"}`}>
                    <td>
                      <input
                        type="checkbox"
                        checked={task.is_complete}
                        onChange={() => toggleComplete(task)}
                      />
                    </td>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>
                      <button className="btn btn-warning" onClick={() => editTaskBtn(task)}>
                        Edit
                      </button>
                      &nbsp;
                      <button className="btn btn-danger" onClick={() => deleteTaskBtn(task.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TaskDashboard;