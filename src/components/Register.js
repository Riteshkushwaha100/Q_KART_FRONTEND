import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link   } from "react-router-dom";

const Register = () => {
  console.log(config);
  const history = useHistory();
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [confirmpassword, setConfirmpassword] = useState("");
  let [progress, setProgress] = useState(false);
  let [onregister,setOnregister] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *
   *
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */

  const register = async (formData) => {
    formData.preventDefault();
    console.log(username);
    console.log(password);
    console.log(confirmpassword);
    if (validateInput(username, password, confirmpassword) == true) {
      setProgress(true);
      try {
        let response = await axios.post(`${config.endpoint}/auth/register`, {
          username: username,
          password: password,
        });

        enqueueSnackbar("Registered successfully");
        setProgress(false);
        setOnregister(true);
        history.push("/login");
        
        // Check if response indicates success
      } catch (e) {
        console.log(e.response);
        console.log(e.response.data);
        if (e.response.status > 400 || e.response.status < 500) {
          console.log(e.response.data.message);
          setProgress(false);
          enqueueSnackbar(e.response.data.message);
        } else {
          enqueueSnackbar(
            "Something went wrong. Check that the backend is running, reachable and returns valid JSON"
          );
          setProgress(false);
          console.log(
            "Something went wrong. Check that the backend is running, reachable and returns valid JSON"
          );
        }
      }
    } else {
      console.log("Password and Confirm Password are not same");
      setProgress(false);
      return false;
    }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (username, password, confirmPassword) => {
    if (username.length <= 0) {
      enqueueSnackbar("Username is a required field");
      return false;
    } else {
      if (username.length <= 6) {
        enqueueSnackbar("Username must be at least 6 characters");
        return false;
      } else {
        if (password.length <= 0) {
          enqueueSnackbar("Password is a required field");
          return false;
        } else {
          if (password.length <= 6) {
            enqueueSnackbar("Password must be at least 6 characters");
            return false;
          } else {
            if (password == confirmPassword) {
              return true;
            } else {
              enqueueSnackbar("Passwords do not match");
              return false;
            }
          }
        }
      }
    } // end
  };

  function handleUsername(e) {
    setUsername(e.target.value);
  }

  function handlePassword(e) {
    setPassword(e.target.value);
  }

  function handleConfirmpassword(e) {
    setConfirmpassword(e.target.value);
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      // minHeight="80vh"
      height="fit-content"
    >
      <Header  hasHiddenAuthButtons={true} />
      <Box className="content">
        <Stack  className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            value={username}
            onChange={handleUsername}
            margin="dense"
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            value={password}
            onChange={handlePassword}
            margin="dense"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={confirmpassword}
            onChange={handleConfirmpassword}
            margin="dense"
            fullWidth
          />
          {progress ? (
            <div style={{ textAlign: "center" }}>
              <CircularProgress  />
            </div>
          ) : (
            <Button
              className="button"
              onClick={register}
              type="submit"
              variant="contained"
              margin="dense"
            >
              Register Now
            </Button>
          )}

          <p className="secondary-action">
            Already have an account?{" "}
            <Link to="/login" style={{ textDecoration: 'none' }} >Login here </Link>
            {/* <a className="link" href="#">
              Login here
            </a> */}
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
