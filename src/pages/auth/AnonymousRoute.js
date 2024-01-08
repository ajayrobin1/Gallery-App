import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../../AuthContext"

  const AnonymousRoute = ({ children }) => {

  const { currentUser } = useAuth();
  
  return currentUser ? <Navigate to="/" /> : children;
  };

  export default AnonymousRoute;