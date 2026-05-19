import { useEffect, useState } from "react";
import instance from "../services/axios";
import { Button, Container, Form, Table, Modal, Badge } from "react-bootstrap";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("All");

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pending",
    dueDate: "",
  });

 
  const fetchTasks = async () => {
    try {
      const res = await instance.get("/tasks");

      const data = res.data;

      const safeTasks =
        Array.isArray(data)
          ? data
          : Array.isArray(data?.tasks)
          ? data.tasks
          : Array.isArray(data?.data)
          ? data.data
          : [];

      setTasks(safeTasks);
    } catch (err) {
      console.log("GET ERROR:", err.response?.data || err.message);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);


  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const openModal = (task = null) => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "Pending",
        dueDate: task.dueDate ? task.dueDate.substring(0, 10) : "",
      });
      setEditId(task._id);
    } else {
      setForm({
        title: "",
        description: "",
        status: "Pending",
        dueDate: "",
      });
      setEditId(null);
    }
    setShow(true);
  };


  const saveTask = async () => {
    try {
      if (editId) {
        await instance.put(`/tasks/${editId}`, form);
      } else {
        await instance.post("/tasks", form);
      }

      setShow(false);
      fetchTasks(); // refresh UI from backend
    } catch (err) {
      console.log("SAVE ERROR:", err.response?.data || err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await instance.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.log("DELETE ERROR:", err.response?.data || err.message);
    }
  };

 
  const filteredTasks =
    Array.isArray(tasks)
      ? filter === "All"
        ? tasks
        : tasks.filter((t) => t.status === filter)
      : [];


  const badge = (status) =>
    status === "Completed"
      ? "success"
      : status === "In Progress"
      ? "warning"
      : "secondary";

  return (
    <Container className="mt-5 pt-3">

      <div className="d-flex justify-content-between mb-3">
        <h4>Tasks Dashboard</h4>
        <Button onClick={() => openModal()}>
          + Add Task
        </Button>
      </div>

      <div className="mb-3 d-flex align-items-center gap-2">
        <strong>Status:</strong>

        <Form.Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ width: "200px" }}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </Form.Select>
      </div>

      <Table bordered hover responsive className="bg-white shadow-sm">
        <thead className="table-light">
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredTasks.map((t) => (
            <tr key={t._id}>
              <td>{t.title}</td>
              <td>{t.description}</td>

              <td>
                <Badge bg={badge(t.status)}>
                  {t.status}
                </Badge>
              </td>

              <td>{t.dueDate?.substring(0, 10)}</td>

              <td>
                <Button
                  size="sm"
                  variant="outline-primary"
                  className="me-2"
                  onClick={() => openModal(t)}
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => deleteTask(t._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editId ? "Edit Task" : "Add Task"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Control
              className="mb-2"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
            />

            <Form.Control
              className="mb-2"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
            />

            <Form.Select
              className="mb-2"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </Form.Select>

            <Form.Control
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={saveTask}>
            Save Task
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default Dashboard;