// components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useGetUserProfileQuery } from "state/api";

const ProtectedRoute = ({ children }) => {
  const {
    data: userProfileData,
    error: userProfileError,
    isLoading: isUserProfileLoading,
  } = useGetUserProfileQuery();

  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!isUserProfileLoading) {
      setAuthChecked(true);
    }
  }, [isUserProfileLoading]);

  if (isUserProfileLoading || !authChecked) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (userProfileError || !userProfileData?.user) {
    window.location.href = process.env.REACT_APP_FRONTEND_URL;
    // correct cross-origin redirect
    return null;
  }

  return children;
};

export default ProtectedRoute;
