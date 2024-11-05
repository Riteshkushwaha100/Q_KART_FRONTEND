import React from "react";
import ReactDOM from "react-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Products from "./components/Products";
import ipConfig from "./ipConfig.json";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import Product from "./components/Products";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";

export const config = {
  endpoint: `https://q-kart-frontend-efwl.onrender.com/api/v1`,
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          {/* <Link to="/">Product</Link>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>  */}
        </div>
        <Switch>
          <Route exact path="/">
          <Products/>
          </Route>
          <Route path="/register">
          <Register />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/checkout">
            <Checkout/>
          </Route>
          <Route path="/thanks">
            <Thanks />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
