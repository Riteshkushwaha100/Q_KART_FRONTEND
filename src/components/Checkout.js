import { CreditCard, Delete } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { config } from "../App";
import Cart, { getTotalCartValue, generateCartItemsFrom } from "./Cart";
import "./Checkout.css";
import Footer from "./Footer";
import Header from "./Header";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [adrs, setAdrs] = useState("");
  const [adrscss, setAdrscss] = useState("not-selected");
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  console.log("Check");
  useEffect(() => {
    console.log("Get Address");
    console.log(config.endpoint); // Make sure config.endpoint is defined

    async function getAddress() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(`${config.endpoint}/user/addresses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Response Address get:", response.data);
        setAddress(response.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    }

    getAddress();
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    console.log("In CheckOut Component");
    const fetchProductsAndCartDetails = async () => {
      try {
        // Fetch all products
        const response = await axios.get(`${config.endpoint}/products`);
        console.log(`${config.endpoint}/products`);
        console.log("response.data");
        console.log(response.data);
        setProducts(response.data);
        // Fetch cart details if the user is logged in
        const loginToken = localStorage.getItem("token");
        if (loginToken) {
          const cartData = await fetchCart(loginToken);
          console.log("cartData");
          console.log(cartData);
          const cartDetails = await generateCartItemsFrom(
            cartData,
            response.data
          );
          console.log("cartDetails");
          console.log(cartDetails);
          setItems(cartDetails);
        }
      } catch (error) {
        console.error("Error fetching products or cart details:", error);
      } finally {
      }
    };

    fetchProductsAndCartDetails();
  }, []);

  async function addAddress() {
    try {
      const response = await axios.post(
        `${config.endpoint}/user/addresses`,
        {
          address: adrs,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Response:", response.data);
      setAddress(response.data);
      setShowAddressForm(false);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  }

  async function deleteAddress(id) {
    try {
      const response = await axios.delete(
        `${config.endpoint}/user/addresses/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json, text/plain, */*",
          },
        }
      );
      console.log("Response:", response.data);
      setAddress(response.data);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  }

  const fetchCart = async (token) => {
    console.log("Fetch Cart");
    console.log("Token:", token);
    //console.log("Endpoint:", `${config.endpoint}/cart`);
    if (!token) return; // No token, no request
    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.length === 0) {
        console.log("No Product in the Cart");
        return []; // Return an empty array if no products in the cart
      } else {
        console.log("Cart Data:", response.data);
        return response.data; // Return cart data
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      return null; // Return null to indicate an error occurred
    }
  };

  const handleAddAddressClick = () => {
    setShowAddressForm(true); // Display the address form when button is clicked
    setAdrs("");
  };

  const handleAddressChange = (event) => {
    setAdrs(event.target.value); // Update state with the current input value
  };

  function addressCss(id) {
    setSelectedAddressId(id);
    // setAdrscss("selected");
  }

  function validateRequest() {
    let walletbalance =
      localStorage.getItem("balance") - localStorage.getItem("carttotalvalue");
    if (walletbalance <= 0) {
      enqueueSnackbar(
        `You do not have enough balance in your wallet for this purchase`,
        { variant: "warning" }
      );
      return false;
    }
    if (address.length === 0) {
      enqueueSnackbar(`Please add a new address before proceeding.`, {
        variant: "warning",
      });
      return false;
    }
    
    if(!selectedAddressId) {
      enqueueSnackbar(`Please select one shipping address to proceed.`,{variant:"warning"})
      return false;
    }
   
    return true ;

  }
  const performCheckout = async (addressId) => {
    let walletbalance = localStorage.getItem("balance") - localStorage.getItem("carttotalvalue");
    let isValid=validateRequest();
    if(isValid){
      try {
        // TODO: CRIO_TASK_MODULE_CHECKOUT - Add new address to the backend and display the latest list of addresses
        // 
        let url=config.endpoint+'/cart/checkout';
        let res=await axios.post(url, {"addressId":addressId},{headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}});
        // return res.data;
        console.log(res.data);
        if(res.data){
          localStorage.setItem("balance",walletbalance);
          history.push("/thanks");
        }

      } catch (e) {
        if (e.response) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
        } else {
          enqueueSnackbar(
            "Could not add this address. Check that the backend is running, reachable and returns valid JSON.",
            {
              variant: "error",
            }
          );
        }
      }
    }
  };

  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={12} md={9}>
          <Box className="shipping-container" minHeight="100vh">
            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Shipping
            </Typography>

            <Typography color="#3C3C3C" my="1rem">
              Manage all the shipping addresses you want. This way you won't
              have to enter the shipping address manually with every order.
              Select the address you want to get your order delivered.
            </Typography>
            <Divider />
            <Box>
              {address.length === 0 ? (
                <>
                  <Typography
                    color="#3C3C3C"
                    my="1rem"
                    sx={{ marginTop: "10px" }}
                  >
                    No addresses found for this account. Please add one to
                    proceed
                  </Typography>
                </>
              ) : (
                <> {/* Do nothing when address.length is greater than 0 */}</>
              )}

              {address.map((e) => (
                <div key={e._id}>
                  {" "}
                  {/* Outer div for structural purposes */}
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    className={`address-item ${
                      selectedAddressId === e._id ? "selected" : "not-selected"
                    }`}
                    onClick={() => {
                      addressCss(e._id);
                    }}
                  >
                    <div>{e.address}</div>
                    <div>
                      <Button
                        onClick={() => {
                          deleteAddress(e._id);
                        }}
                        variant="text"
                      >
                        <DeleteIcon />
                      </Button>
                      <Button
                        onClick={() => {
                          deleteAddress(e._id);
                        }}
                        variant="text"
                      >
                        DELETE
                      </Button>
                    </div>
                  </Stack>
                </div>
              ))}
              <div className="newAddressViewButtonParent">
                <div>
                  {showAddressForm ? (
                    <div className="addressForm">
                      <TextField
                        fullWidth
                        label="Enter your complete address"
                        id="fullAddress"
                        className="address-item not-selected"
                        value={adrs}
                        onChange={handleAddressChange}
                        placeholder="Enter your complete address"
                      />

                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                          justifyContent: "flex-start",
                          alignItems: "center",
                          marginTop: "25px",
                        }}
                      >
                        <Button
                          onClick={() => {
                            addAddress();
                          }}
                          variant="contained"
                        >
                          Add
                        </Button>
                        <Button
                          onClick={() => {
                            setShowAddressForm(false);
                          }}
                          variant="text"
                        >
                          Cancel
                        </Button>
                      </Stack>
                    </div>
                  ) : (
                    <Button
                      className="newAddressViewButton"
                      onClick={handleAddAddressClick}
                      variant="contained"
                    >
                      Add New Address
                    </Button>
                  )}
                </div>
              </div>
            </Box>
            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Payment
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Payment Method
            </Typography>
            <Divider />
            <Box my="1rem">
              <Typography>Wallet</Typography>
              <Typography>
                Pay ${getTotalCartValue(items)} of available $
                {localStorage.getItem("balance")}
              </Typography>
            </Box>
            <Button
              onClick={() => {
                performCheckout(selectedAddressId);
                // history.push("/thanks");
              }}
              startIcon={<CreditCard />}
              variant="contained"
            >
              PLACE ORDER
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} bgcolor="#E9F5E1">
          <Cart ReadOnly={false} products={products} items={items} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;
