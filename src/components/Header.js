import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack, TextField , OutlinedInput , InputAdornment } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';

const Header = ({onData , children, hasHiddenAuthButtons }) => {
  let userName = localStorage.getItem("username");
  let [logout, setLogout] = useState(hasHiddenAuthButtons);
  let [srdata,setSrdata] = useState("");
  const history = useHistory();
  console.log(children);
  console.log(hasHiddenAuthButtons);

  function backbutton() {
    history.push("/");
  }
  function onlogin() {
    history.push("/login");
  }

  function onregister() {
    history.push("/register");
  }
  let content;
  

  function logoutfunc() {
    console.log("logout");
    localStorage.clear();
    setLogout(false);
    history.push("/");
    // window.location.reload();
  }

  console.log(srdata);

  function onSearch(e) {
    setSrdata(e.target.value);
    onData(e.target.value);
  }

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}
      {/* <OutlinedInput
            onChange={onSearch}
            id="outlined-adornment-weight"
            style={{ display: children == "product" ? "" : "none" }}
            value={srdata}
            // className="search-desktop"
            endAdornment={<SearchIcon color="primary" position="end"></SearchIcon>}
            aria-describedby="outlined-weight-helper-text"
            placeholder="Search for items/categories"
            sx={{ width: '35ch', height:"4ch" }}
          /> */}
     



      {/* {logout ? (
        <div style={{ display: "flex" }}>
          <div>
            <Avatar
              src="/public/avatar.png"
              alt={localStorage.getItem("username")}
            />
          </div>
          <Button spacing={2} variant="text">
            {localStorage.getItem("username")}
          </Button>
          <Button onClick={logoutfunc} spacing={2} variant="contained">
            LOGOUT
          </Button>
        </div>
      ) : (
        content
      )} */}

      {hasHiddenAuthButtons ? (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={backbutton}
        >
          Back to explore
        </Button>
      ) : userName ? (
        <div style={{ display: "flex" }}>
          <div>
            <Avatar
              src="/public/avatar.png"
              alt={localStorage.getItem("username")}
            />
          </div>
          <Button spacing={2} variant="text">
            {localStorage.getItem("username")}
          </Button>
          <Button onClick={logoutfunc} spacing={2} variant="contained">
            LOGOUT
          </Button>
        </div>
      ) : (
        <div>
          <Button spacing={2} onClick={onlogin} variant="text">
            LOGIN
          </Button>
          <Button onClick={onregister} variant="contained">
            REGISTER
          </Button>
        </div>
      )}
      {/* {hasHiddenAuthButtons ? (
        <div style={{ display: "flex" }}>
          <div>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </div>
          <Button spacing={2} variant="text">
            testUser
          </Button>
          <Button spacing={2} variant="text">
            Logout
          </Button>
        </div>
      ) : (
        <div>
          <Button spacing={2} variant="text">
            Login
          </Button>
          <Button variant="contained">Register</Button>
        </div>
      )} */}
      {/* Normal */}
      {/* <div>
        <Button spacing={2} variant="text">
          Login
        </Button>
        <Button variant="contained">Register</Button>
      </div> */}
      {/* Normal ends  */}

      {/* <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
        >
          Back to explore
        </Button> */}
    </Box>
  );
};

export default Header;
