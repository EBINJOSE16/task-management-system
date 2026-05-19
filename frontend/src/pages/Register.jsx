import { Button, Col, Container, Form, Row } from "react-bootstrap";
import * as formik from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import instance from "../services/axios";

const Register = () => {
  const { Formik } = formik;
  const navigate = useNavigate();

  const schema = yup.object().shape({
    name: yup
      .string()
      .required("please enter your fullname")
      .min(2, "name must be more than two characters"),

    email: yup
      .string()
      .required("enter your email")
      .email("pls type proper one"),

    password: yup
      .string()
      .required("enter your password")
      .min(4, "password must be more than 4 characters")
      .max(10, "password should be below 10 characters"),
  });

  const handleregister = async (values) => {
    try {
      
      const { data } = await instance.post("/api/register",values);
      toast.success(data?.message);
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center mt-4"
      style={{ minHeight: "90vh" }}
    >
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5}>
          <div className="p-4 shadow rounded bg-white mb-5 mt-4">
            <h3 className="text-center mb-4">Register</h3>

            <Formik
              validationSchema={schema}
              onSubmit={handleregister}
              initialValues={{
                name: "",
                email: "",
                password: "",
              }}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                errors,
                touched,
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  
                 
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      name="name"
                      type="text"
                      placeholder="Full Name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.name && !errors.name}
                      isInvalid={touched.name && !!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  
                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.email && !errors.email}
                      isInvalid={touched.email && !!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      name="password"
                      type="password"
                      placeholder="xxxxxxxx"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.password && !errors.password}
                      isInvalid={touched.password && !!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                 
                  <div className="d-grid mb-3">
                    <Button type="submit" variant="primary">
                      Register
                    </Button>
                  </div>

                  <div className="text-center">
                    <small>
                      Already have an account?{" "}
                      <Link to="/login">Login</Link>
                    </small>
                  </div>

                </Form>
              )}
            </Formik>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;