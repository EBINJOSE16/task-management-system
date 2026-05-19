import { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userLogin } from "../redux/userslice.js";
import instance from "../services/axios.js";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  const emailref = useRef(null);
  const [validated, setValidated] = useState(false);

  const [logindata, setlogindata] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    emailref.current?.focus();
  }, []);

  const handleChange = (e) => {
    setlogindata({
      ...logindata,
      [e.target.name]: e.target.value,
    });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const { data } = await instance.post("/login", logindata);

      dispatch(
        userLogin({
          user: data.user,
          token: data.token,
        })
      );
      console.log("LOGIN RESPONSE:", data);

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      toast.success(data.message);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  if (isAuthenticated) return <Navigate to="/dashboard" />;

  return (
    <Container
      className="d-flex justify-content-center align-items-center mt-4"
      style={{ minHeight: "80vh" }}
    >
      <Row className="w-100 justify-content-center">
        <Col md={5} lg={4}>
          <div className="p-4 shadow rounded bg-white mb-4 mt-4">
            <h3 className="text-center mb-4">Login</h3>

            <Form noValidate validated={validated} onSubmit={handlesubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  ref={emailref}
                  value={logindata.email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  placeholder="xxxxxx"
                  required
                  value={logindata.password}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button type="submit" className="w-100">
                Login
              </Button>
            </Form>

            <div className="text-center mt-3">
              <small>
                Don’t have an account? <Link to="/register">Register</Link>
              </small>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;