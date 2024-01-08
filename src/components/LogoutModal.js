import * as React from 'react';
import { useAuth } from "../AuthContext"
import { useState } from "react"
import { Fade, Button, Modal, Box, Typography, Alert } from "@mui/material";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  align: 'center'
};

export default function LogoutModal(props) {
  const [alertVisibility, setAlertVisibility] = useState(false);
  const {logout } = useAuth()
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  async function handleLogout() {
    props.handleClose()
    props.handleCloseUserMenu()
    setError("")
    try {
      await logout()
      // navigate("/")
      setMessage("Logged out")
    } catch {

      console.error()

      // setError("Failed to log out")
    }
  }

  return (
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>

          {error && <Alert severity="error">{error}</Alert>}
          {message && <Fade
              in={alertVisibility} //Write the needed condition here to make it appear
              addEndListener={() => {
                setTimeout(() => {
                  setAlertVisibility(false)
                  setMessage(null)
                }, 2000);
              }}
              >
          <Alert severity="success">{message}</Alert>
          </Fade>}

          <Typography sx={{py:1}} id="modal-modal-title">
            Do you want to logout?
          </Typography>
          <Box sx={{py:1}}>
            <Button variant="outlined" onClick={handleLogout}>Yes</Button>
            <Button color="error"  onClick={props.handleClose} >No</Button>
          </Box>

        </Box>
      </Modal>
  );
}
