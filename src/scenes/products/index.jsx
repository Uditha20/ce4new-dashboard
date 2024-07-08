import React, { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
  Modal,
} from "@mui/material";
import Header from "components/Header";
import { useGetProductsQuery } from "state/api";
import AddProductForm from './AddProductForm';

const Product = ({
  _id,
  name,
  description,
  price,
  rating,
  category,
  supply,
  stat,
  mainImage,
  additionalImages,
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const baseUrl = process.env.REACT_APP_BASE_URL; // Replace with your actual base URL if different

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent>
        <Typography
          sx={{ fontSize: 14 }}
          color={theme.palette.secondary[700]}
          gutterBottom
        >
          {category}
        </Typography>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
          ${Number(price).toFixed(2)}
        </Typography>
        <Rating value={rating} readOnly />
        <Typography variant="body2">{description}</Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="primary"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          See More
        </Button>
        <Button variant="contained" size="small" onClick={handleOpenModal}>
          View Images
        </Button>
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
        sx={{
          color: theme.palette.neutral[300],
        }}
      >
        {/* <CardContent>
          <Typography>id: {_id}</Typography>
          <Typography>Supply Left: {supply}</Typography>
          <Typography>
            Yearly Sales This Year: {stat.yearlySalesTotal}
          </Typography>
          <Typography>
            Yearly Units Sold This Year: {stat.yearlyTotalSoldUnits}
          </Typography>
        </CardContent> */}
      </Collapse>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Images
          </Typography>
          {mainImage && (
            <img
              src={`${baseUrl}/${mainImage}`}
              alt="Main"
              style={{ width: "100%", marginBottom: "1rem" }}
            />
          )}
          <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
            {additionalImages.map((image, index) => (
              <img
                key={index}
                src={`${baseUrl}/${image}`}
                alt={`Additional ${index + 1}`}
                style={{ width: "calc(33.333% - 1rem)", cursor: "pointer" }}
                onClick={() => {
                  const img = new Image();
                  img.src = `${baseUrl}/${image}`;
                  const w = window.open("");
                  w.document.write(img.outerHTML);
                }}
              />
            ))}
          </Box>
        </Box>
      </Modal>
    </Card>
  );
};

const Products = () => {
  const { data, isLoading } = useGetProductsQuery();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const handleOpenAddProduct = () => setIsAddProductOpen(true);
  const handleCloseAddProduct = () => setIsAddProductOpen(false);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="PRODUCTS" subtitle="See your list of products." />
      <Button variant="contained" onClick={handleOpenAddProduct}>
        Add Product
      </Button>
      <AddProductForm open={isAddProductOpen} handleClose={handleCloseAddProduct} />
      {data || !isLoading ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {data.map(
            ({
              _id,
              name,
              description,
              price,
              rating,
              category,
              supply,
              stat,
              mainImage,
              additionalImages,
            }) => (
              <Product
                key={_id}
                _id={_id}
                name={name}
                description={description}
                price={price}
                rating={rating}
                category={category}
                supply={supply}
                stat={stat}
                mainImage={mainImage}
                additionalImages={additionalImages}
              />
            )
          )}
        </Box>
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
};

export default Products;
