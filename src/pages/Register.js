import React, { useState } from "react"; // Import useState
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../components/common/InputField";
import { toast } from "react-toastify";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    email: "",
    phone: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://task-manager-nodejs-nyyo.onrender.com/auth/signup",
        {
          username: values.username,
          email: values.email,
          phone: values.phone,
          password: values.password,
        }
      );

      if (response.status === 201) {
        toast.success("Registration successful!");
        resetForm();
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  // Define the style object
  const containerStyle = {
    backgroundImage: `url('https://www.linuxlinks.com/wp-content/uploads/2019/04/notepad-pen-with-words-from-todo-list-multicolored-background.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
  };

  return (
    <div style={containerStyle} className="flex items-center justify-center">
      <div className="xl:px-20 md:px-10 sm:px-6 px-4 py-12 max-w-screen-lg w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center mt-10"></div>
          <div className="bg-white shadow-lg rounded w-full p-6">
            <p className="text-xl font-bold leading-6 text-gray-800 mb-4">
              Unlock a world of productivity. Sign up and start organizing your
              life.
            </p>
            <p className="text-sm mt-4 font-medium leading-none text-gray-500 mb-5">
              Already have an account?{" "}
              <Link
                to="/login"
                className="hover:text-gray-500 focus:text-gray-500 focus:outline-none focus:underline hover:underline text-sm font-medium leading-none text-gray-800 cursor-pointer"
              >
                Login here
              </Link>
            </p>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <Form>
                <InputField
                  label="Username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                />
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="e.g: john@gmail.com"
                />
                <InputField
                  label="Phone"
                  name="phone"
                  type="text"
                  placeholder="Enter your phone number"
                />
                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  showHide={true}
                />

                <div className="mt-8">
                  <button
                    type="submit"
                    className="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 text-sm font-semibold leading-none text-white focus:outline-none bg-gray-800 border rounded hover:bg-gray-900 py-4 w-full"
                    disabled={loading} // Disable the button when loading
                  >
                    {loading ? <CircularProgress color="#fff" /> : "Sign Up"}
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
