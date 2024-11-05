import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  CardActionArea,
} from "@mui/material";
import React, { useState } from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  const { name, cost, rating, image, _id } = product;
  //const [value, setValue] = useState(2);
  console.log(product);
  return (
    <Card className="card" sx={{ maxWidth: 385 }}>
      <CardActionArea>
        <CardMedia component="img" height="240" image={image} alt={name} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            ${cost}
          </Typography>
          <Rating name="read-only" value={rating} readOnly />
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          size=""
          fullWidth
          color="primary"
          variant="contained"
          value={_id}
          onClick={handleAddToCart}
        >
          <AddShoppingCartOutlined /> ADD TO CART
        </Button>
      </CardActions>
    </Card>

    // <Card className="card">
    //   <CardActionArea>
    //     <CardMedia
    //       component="img"
    //       height="300"
    //       image={product.image}
    //       alt="green iguana"
    //     />
    //     <CardContent>
    //       <Typography gutterBottom variant="h5" component="div">
    //         {product.name}
    //       </Typography>
    //       <Typography variant="body2" color="text.secondary">
    //         {product.cost}
    //       </Typography>
    //       <Typography variant="body2" color="text.secondary">
    //         <Rating
    //           name="simple-controlled"
    //           value={value}
    //           onChange={(event, newValue) => {
    //             setValue(newValue);
    //           }}
    //         />
    //       </Typography>
    //       <Typography gutterBottom variant="h5" component="div">
    //         <Button role="button" aria-label="Add to Cart" value={product._id}  fullWidth variant="contained" size="large">
    //         ADD TO CART
    //         </Button>
    //       </Typography>
    //     </CardContent>
    //   </CardActionArea>
    // </Card>
  );
};

export default ProductCard;
