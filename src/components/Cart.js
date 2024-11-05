import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";
import axios from "axios";
import { config } from "../App";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

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

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */

export const generateCartItemsFrom = async (cartData, productsData) => {
  console.log("generateCartItemsFrom");
  console.log("cartData", cartData);
  console.log("productsData", productsData);
  let itemsData = [];
  if (!cartData || cartData.length == 0) {
    return [];
  } else {
    cartData.forEach((cartItem) => {
      const product = productsData.find(
        (productItem) => productItem._id === cartItem.productId
      );

      // If the product is found, add it to the itemsData along with the qty from cartData
      if (product) {
        // Add the quantity to the product and push it to itemsData
        itemsData.push({ ...product, qty: cartItem.qty });
      }
    });

    console.log("itemsData", itemsData);
    return itemsData;
  }

  // Loop through cartData and match with productsData
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items) => {
  let totalCost = 0;
  if (items.length == 0) {
    return 0;
  } else {
    items.forEach((item) => {
      let eachItem = item.cost * item.qty;
      totalCost = totalCost + eachItem;
    });
  }
  localStorage.setItem("carttotalvalue", totalCost);
  return "$" + totalCost;
};

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */
const ItemQuantity = ({ value, handleAdd, handleDelete, readOnly }) => {
  console.log("readOnly");
  console.log(readOnly);

  if (readOnly === true) {
    return (
      <Stack direction="row" alignItems="center">
        <IconButton
          size="small"
          color="primary"
          onClick={handleDelete}
        >
          <RemoveOutlined />
        </IconButton>
        <Box padding="0.5rem" data-testid="item-qty">
          {value}
        </Box>
        <IconButton
          size="small"
          color="primary"
          onClick={handleAdd}
        >
          <AddOutlined />
        </IconButton>
      </Stack>
    );
  } else {
    return (
      <Stack direction="row" alignItems="center">
        <IconButton size="small" color="primary">
         {/* <RemoveOutlined /> */}
        </IconButton>
        <Box padding="0.5rem" data-testid="item-qty">
         Qty:{value} 
        </Box>
        <IconButton size="small" color="primary">
          {/* <AddOutlined /> */}
        </IconButton>
      </Stack>
    );
  }

  // return (
  //   <Stack direction="row" alignItems="center">
  //     <IconButton
  //       size="small"
  //       color="primary"
  //       onClick={() => (readOnly ? handleDelete() : console.log("Do Nothing"))}
  //     >
  //       <RemoveOutlined />
  //     </IconButton>
  //     <Box padding="0.5rem" data-testid="item-qty">
  //       {value}
  //     </Box>
  //     <IconButton
  //       size="small"
  //       color="primary"
  //       onClick={() => (readOnly ? handleAdd() : console.log("Do Nothing"))}
  //     >
  //       <AddOutlined />
  //     </IconButton>
  //   </Stack>
  // );
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 */

const Cart = ({ token, products, items = [], handleQuantity, ReadOnly }) => {
  // const [readOnly,setReadOnly] = useState("false");
  // setReadOnly(ReadOnly);
  const history = useHistory();
  console.log("In the Cart Component");
  console.log(products);
  console.log(items);

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        {items.map((item) => (
          <Box
            key={item._id}
            display="flex"
            alignItems="flex-start"
            padding="1rem"
          >
            <Box className="image-container">
              <img
                // Item image
                src={item.image}
                // Item name as alt text
                alt={item.name}
                width="100%"
                height="100%"
              />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="6rem"
              paddingX="1rem"
            >
              <div>{item.name}</div>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                {/* {ReadOnly && (
                  <ItemQuantity
                    readOnly={true}
                    value={item.qty}
                    handleAdd={async () => {
                      await handleQuantity(
                        localStorage.getItem("token"),
                        items,
                        products,
                        item._id,
                        ++item.qty,
                        { preventDuplicate: true }
                      );
                    }}
                    handleDelete={async () => {
                      await handleQuantity(
                        localStorage.getItem("token"),
                        items,
                        products,
                        item._id,
                        --item.qty,
                        { preventDuplicate: true }
                      );
                    }}
                  />
                )} */}

                {ReadOnly ? (
                  <ItemQuantity
                    readOnly={true}
                    value={item.qty}
                    handleAdd={async () => {
                      await handleQuantity(
                        localStorage.getItem("token"),
                        items,
                        products,
                        item._id,
                        ++item.qty,
                        { preventDuplicate: true }
                      );
                    }}
                    handleDelete={async () => {
                      await handleQuantity(
                        localStorage.getItem("token"),
                        items,
                        products,
                        item._id,
                        --item.qty,
                        { preventDuplicate: true }
                      );
                    }}
                  />
                ) : (
                  <ItemQuantity
                    readOnly={false}
                    value={item.qty}
                    handleAdd={async () => {
                      await handleQuantity(
                        localStorage.getItem("token"),
                        items,
                        products,
                        item._id,
                        ++item.qty,
                        { preventDuplicate: true }
                      );
                    }}
                    handleDelete={async () => {
                      await handleQuantity(
                        localStorage.getItem("token"),
                        items,
                        products,
                        item._id,
                        --item.qty,
                        { preventDuplicate: true }
                      );
                    }}
                  />
                )}

                {/* <ItemQuantity
                  readOnly={ReadOnly ? true : false}
                  value={item.qty}
                  handleAdd={async () => {
                    await handleQuantity(
                      localStorage.getItem("token"),
                      items,
                      products,
                      item._id,
                      ++item.qty,
                      { preventDuplicate: true }
                    );
                  }}
                  handleDelete={async () => {
                    await handleQuantity(
                      localStorage.getItem("token"),
                      items,
                      products,
                      item._id,
                      --item.qty,
                      { preventDuplicate: true }
                    );
                  }}
                /> */}

                <Box padding="0.5rem" fontWeight="700">
                  {`$${item.cost}`}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}

        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            {getTotalCartValue(items)}
          </Box>
        </Box>

        <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            aria-label="Checkout" // Adding accessible label for testing and screen readers
            onClick={() => {
              history.push("/checkout");
            }}
          >
            Checkout
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Cart;
