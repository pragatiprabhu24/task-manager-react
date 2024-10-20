import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../components/common/InputField";
import { toast } from "react-toastify";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    identifier: "",
    password: "",
  };

  const validationSchema = Yup.object({
    identifier: Yup.string().required("Email or Username is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://task-manager-nodejs-nyyo.onrender.com/auth/login",
        {
          email: values.identifier,
          password: values.password,
        }
      );

      if (response.status === 200) {
        const { token } = response.data;
        toast.success("Login successful!");

        localStorage.setItem("token", token);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-indigo-50 min-h-screen">
      <div className="xl:px-20 md:px-10 sm:px-6 px-4 md:py-12 py-9 2xl:mx-auto 2xl:container md:flex items-center justify-center min-h-screen">
        <div className="bg-white shadow-lg rounded xl:w-1/3 lg:w-5/12 md:w-1/2 w-full lg:px-10 sm:px-6 sm:py-10 px-2 py-6">
          <p className="focus:outline-none text-2xl font-extrabold leading-6 text-gray-800">
            Login to your account
          </p>
          <p className="focus:outline-none text-sm mt-4 font-medium leading-none text-gray-500 mb-5">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="hover:text-gray-500 focus:text-gray-500 focus:outline-none focus:underline hover:underline text-sm font-medium leading-none text-gray-800 cursor-pointer"
            >
              Sign up here
            </Link>
          </p>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <InputField
                label="Email"
                name="identifier"
                type="text"
                placeholder="e.g: john@gmail.com"
              />
              <InputField
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                showHide={true}
              />
              <p className="flex justify-end mt-5 text-indigo-800 underline hover:font-bold cursor-pointer">
                Forgot Password?
              </p>
              <div className="mt-8">
                <button
                  type="submit"
                  className="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 text-sm font-semibold leading-none text-white focus:outline-none bg-gray-800 border rounded hover:bg-gray-900 py-4 w-full"
                  disabled={loading}
                >
                  {loading ? <CircularProgress color="#fff" /> : "Login"}
                </button>
              </div>
            </Form>
          </Formik>
        </div>

        <div className="xl:w-1/3 md:w-1/2 lg:ml-16 ml-8 md:mt-0 mt-6">
          <div className="flex items-start mt-8">
            <div>
              <img
                className="w-24"
                src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in_2-svg7.svg"
                alt="quote"
              />
            </div>
            <p className="sm:text-2xl text-xl leading-7 text-gray-600 pl-2.5">
              Your tasks are waiting. Let’s get organized and achieve more
              today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
