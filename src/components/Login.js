import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";
import Register from "./Register";

const Login = () => {
  const history = useHistory();
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [onregister,setOnregister] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    console.log(formData);
    formData.preventDefault();
    console.log(username);
    console.log(password);
    if(validateInput(username,password)==true) {

      try {
        let response = await axios.post(`${config.endpoint}/auth/login`, {
          username: username,
          password: password,
        });
        console.log("Response data when Logged in");
        console.log(response.data);
        if (response.data.success === true) {
          persistLogin(response.data.token,response.data.username,response.data.balance)
          enqueueSnackbar("Logged in successfully");
          setOnregister(true);
          history.push("/",response.data);
        }
        console.log(response);
      } catch (e) {
        console.log(e);
        console.log(e.response);
        if (e.response.status >= 400 || e.response.status < 500) {
          enqueueSnackbar(e.response.data.message);
        } else {
          enqueueSnackbar(
            "Something went wrong. Check that the backend is running, reachable and returns valid JSON."
          );
        }
      }

    }else {
      console.log("Validations Fails");
    }



    
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (username, password) => {
    console.log(username.length, password.length)
    if (username.length==0) {
      enqueueSnackbar("Username is a required field");
      return false;
    } else {
      if (password.length==0) {
        enqueueSnackbar("Password is a required field");
        return false;
      } else {
        return true;
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username",username);
    localStorage.setItem("balance", balance);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header  hasHiddenAuthButtons={true} />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            id="username"
            label="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            variant="outlined"
          />
          <TextField
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            label="password"
            variant="outlined"
          />
          <Button variant="contained" onClick={login} color="success">
            LOGIN TO QKART
          </Button>
          <p className="secondary-action">
            Don't have a account ?{" "}
            <Link to="/register" style={{ textDecoration: 'none' }} >Register now </Link>
            {/* <a className="link" href="#">
              Register now
            </a> */}
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
