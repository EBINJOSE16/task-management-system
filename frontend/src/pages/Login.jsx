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

  const [errors, setErrors] = useState({});

  useEffect(() => {
    emailref.current?.focus();
  }, []);

  const handleChange = (e) => {
    setlogindata({
      ...logindata,
      [e.target.name]: e.target.value,
    });

    // clear error when typing
    setErrors({
      ...errors,
      [e.target.name]: "",
      form: "",
    });
  };

  const validate = async () => {
    let newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!logindata.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(logindata.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!logindata.password) {
      newErrors.password = "Password is required";
    } else if (logindata.password.length < 3) {
      newErrors.password = "Password must be at least 3 characters";
    }
    const user = await User.findOne({ email });



    return newErrors;
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
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

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      toast.success(data.message);
      navigate("/dashboard");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Invalid email or password";

      setErrors({ form: message });
      toast.error(message);
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

            <Form onSubmit={handlesubmit}>

           
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  ref={emailref}
                  value={logindata.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <small className="text-danger">{errors.email}</small>
                )}
              </Form.Group>

            
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  placeholder="xxxxxx"
                  value={logindata.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <small className="text-danger">{errors.password}</small>
                )}
              </Form.Group>

            
              {errors.form && (
                <div className="text-danger text-center mb-2">
                  {errors.form}
                </div>
              )}

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