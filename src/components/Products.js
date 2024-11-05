import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";
import Cart from "./Cart";
import Box from "@mui/material/Box";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import { generateCartItemsFrom } from "./Cart";

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [productNotFound, setProductNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [items, setItems] = useState([]);
  const [cartqty, setCartqty] = useState([]);
  console.log("location");
  console.log(location);
  const { success, token, username, balance } = location.state || {}; // Safely handle the case when state is undefined
  let loginToken = localStorage.getItem('token');
  // Fetch  the  cart Products
  console.log("config.endpoint");
  console.log(config.endpoint);

  // Fetch all products initially
  // useEffect(() => {
  //   const fetchAllProducts = async () => {
  //     try {
  //       const response = await axios.get(`${config.endpoint}/products`);
  //       console.log(`${config.endpoint}/products`);
  //       setAllProducts(response.data);
  //       setLoading(false);
  //     } catch (error) {
  //       console.log("Error fetching products:", error);
  //       setLoading(false);
  //     }
  //   };
  //   fetchAllProducts();
  // }, []);

  // useEffect(() => {
  //   const fetchAllProducts = async () => {
  //     try {
  //       const response = await axios.get(`${config.endpoint}/products`);
  //       console.log(`${config.endpoint}/products`);
  //       setAllProducts(response.data);
  //       setLoading(false);
  //     } catch (error) {
  //       console.log("Error fetching products:", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchAllProducts();
  // }, []);

  // useEffect(() => {
  //   const fetchCartDetails = async () => {
  //     if (allProducts.length > 0) {
  //       // Ensure that allProducts is available
  //       let loginToken = localStorage.getItem('token');
  //       const cartData = await fetchCart(loginToken);
  //       const cartDetails = await generateCartItemsFrom(cartData, allProducts);
  //       setItems(cartDetails);
  //       setCartqty(cartData);
  //     }
  //   };

  //   if (!localStorage.getItem('token')) {
  //     return;
  //   } else {
  //     fetchCartDetails();
  //   }
  // }, [allProducts]); // Run this effect only when allProducts is updated

  useEffect(() => {
    const fetchProductsAndCartDetails = async () => {
      setLoading(true); // Start loading

      try {
        // Fetch all products
        const response = await axios.get(`${config.endpoint}/products`);
        console.log(`${config.endpoint}/products`);
        setAllProducts(response.data);
        
        // Fetch cart details if the user is logged in
        const loginToken = localStorage.getItem('token');
        if (loginToken) {
          const cartData = await fetchCart(loginToken);
          const cartDetails = await generateCartItemsFrom(cartData, response.data);
          setItems(cartDetails);
          //setCartQty(cartData);
        }
      } catch (error) {
        console.error("Error fetching products or cart details:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchProductsAndCartDetails();
  }, []); // This effect runs only once when the component mounts


  // Perform search when searchTerm changes
  useEffect(() => {
    if (searchTerm) {
      performSearch(searchTerm);
    } else {
      setSearchResults(allProducts); // Show all products if search term is empty
      setProductNotFound(false);
    }
  }, [searchTerm, allProducts]);

  const performSearch = useCallback(
    async (query) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${config.endpoint}/products/search?value=${query}`
        );
        setSearchResults(response.data);
        setProductNotFound(response.data.length === 0);
        setLoading(false);
      } catch (e) {
        console.log("Product Not Found");
        setSearchResults([]);
        setProductNotFound(true);
        setLoading(false);
      }
    },
    [setSearchResults, setProductNotFound, setLoading]
  );

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleSearch = debounce((value) => {
    setSearchTerm(value);
  }, 500);

  const onSearchChange = (e) => {
    handleSearch(e.target.value);
  };

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  console.log("Token");
  console.log(token);
  // const fetchCart =async (token) => {
  //   console.log("Fetch Cart");
  //   console.log(token);
  //   console.log(`${config.endpoint}/cart`);
  //   if (!token) return;

  //   await axios
  //     .get(`${config.endpoint}/cart`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`, // Replace <token> with your actual token
  //       },
  //     })
  //     .then((response) => {
  //       if (response.data.length == 0) {
  //         console.log("No Product in the Cart");
  //       } else {
  //         console.log("Cart Data:", response.data);
  //         generateCartItemsFrom(response.data,allProducts)
  //         setItems(generateCartItemsFrom(response.data,allProducts));

  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error.response);
  //       console.error("Error fetching cart:", error);
  //     });
  // };

  const fetchCart = async (token) => {
    console.log("Fetch Cart");
    console.log("Token:", token);
    //console.log("Endpoint:", `${config.endpoint}/cart`);
  
    if (!token) return;  // No token, no request
  
    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.data.length === 0) {
        console.log("No Product in the Cart");
        return [];  // Return an empty array if no products in the cart
      } else {
        console.log("Cart Data:", response.data);
        console.log(items);
        return response.data  // Return cart data
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      return null;  // Return null to indicate an error occurred
    }
  };

  // const fetchCart = async (token) => {
  //   console.log("Fetch Cart");
  //   console.log(token);
  //   console.log(`${config.endpoint}/cart`);

  //   if (!token) return;

  //   try {
  //     const response = await axios.get(`${config.endpoint}/cart`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`, // Replace <token> with your actual token
  //       },
  //     });

  //     if (response.data.length === 0) {
  //       console.log("No Product in the Cart");
  //     } else {
  //       console.log("Cart Data:", response.data);
  //       return response.data;
  //     }
  //   } catch (error) {
  //     console.log(error.response);
  //     console.error("Error fetching cart:", error);
  //   }
  // };

  const updateCart = async (token, productId, qty) => {
    alert(productId);
    alert(qty);
    try {
      let res = await axios.post(
        `${config.endpoint}/cart`,
        { productId: productId, qty: qty }, // Updating qty from the frontend
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Handle success
      enqueueSnackbar("Cart quantity updated");
    } catch (e) {
      console.log("Error updating the cart API");
      console.log(e);
    }
  };

  let isItemInCart = (productId, items) => {
    return items.some((item) => {
      if (productId === item._id) {
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item"
        );
        return true; // Return true if the item is found in the cart
      }
      return false;
    });
  };

  let addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    console.log("items of add to cart button click");
    console.log(items);
    // alert(qty);
    // alert(productId);
    // alert(options.preventDuplicate);
    // alert("isItemInCart" , isItemInCart(productId, items));
    if (!localStorage.getItem('token')) {
      enqueueSnackbar("Login to add an item to the Cart");
      return;
    }

    if (options.preventDuplicate===true) {
      console.log({ productId: productId, qty: qty });
      try {
        let res = await axios.post(
          `${config.endpoint}/cart`,
          { productId: productId, qty: qty },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        console.log("Product Quantity Updated in the Cart");
        //const cartData = await fetchCart(localStorage.getItem('token'));
        const cartDetails = await generateCartItemsFrom(res.data, allProducts);
        setItems(cartDetails);
      } catch (e) {
        console.log("Error in the add to cart for fetching the API");
        console.log(e);
      }
    } else {
      if (isItemInCart(productId, items) == false) {
        try {
          let res = await axios.post(
            `${config.endpoint}/cart`,
            { productId: productId, qty: qty },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );
          enqueueSnackbar("Product added to the cart");
          console.log("Product added to the cart");
          console.log(res.data);
        
          const cartDetails = await generateCartItemsFrom(
            res.data,
            allProducts
          );
          setItems(cartDetails);
          //const cartData = await fetchCart(localStorage.getItem('token'));
        } catch (e) {
          console.log("Error in the add to cart for fetching the API");
          console.log(e);
        }
      }
    }
  };

  return (
    <div>
      <Header hasHiddenAuthButtons={false}>
        <TextField
          className="search-desktop"
          size="small"
          onChange={onSearchChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
        />
      </Header>

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        onChange={onSearchChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={success ? 9 : 12}>
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your doorstep
            </p>
          </Box>

          {loading ? (
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <CircularProgress />
              <div>Loading Products</div>
            </Grid>
          ) : productNotFound ? (
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <SentimentVeryDissatisfiedIcon />
              <div>No Products Found</div>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              {" "}
              {/* Add this container for the product cards */}
              {searchResults.map((product) => (
                <Grid item xs={6} md={3} key={product._id}>
                  <ProductCard
                    product={product}
                    handleAddToCart={() => {
                      addToCart(localStorage.getItem('token'), items, product, product._id, 1);
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>

        {localStorage.getItem('token') && (
          <Grid item xs={12} sm={12} md={3}>
            <Cart
              token={localStorage.getItem('token')}
              products={allProducts}
              items={items}
              handleQuantity={addToCart}
              ReadOnly={true}
            />
          </Grid>
        )}
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
