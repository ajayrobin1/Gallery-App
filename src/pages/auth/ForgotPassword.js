import React, { useRef, useState } from "react"
import { useAuth } from "../../AuthContext"
import { Link } from "react-router-dom"
import { Box, Container, Typography,Button, TextField, Alert, Paper } from '@mui/material';


export default function ForgotPassword() {
  const emailRef = useRef()
  const { resetPassword } = useAuth()
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setMessage("")
      setError("")
      setLoading(true)
      await resetPassword(emailRef.current.value)
      setMessage("Check your inbox for further instructions")
      console.log(message)
    } catch {
      setError("Failed to reset password")
    }

    setLoading(false)
  }

  return (
    <>
          <Container component="main" maxWidth="xs"  sx={{pt:3}}>
        <Paper sx={{ p:3, mb: 1 }} >
          <Typography omponent="h2" align="center" variant="h5">
          Password Reset
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <form className="form" onSubmit={handleSubmit}>
            <Box component="main" maxWidth="sm">

            <TextField id="outlined-basic" 
              required 
              fullWidth
              label="Email" 
              variant="outlined"
              inputRef={emailRef} 
              type="email"
              sx={{ mt:1, mb: 1 }}
              />

  
            <Button
            variant="contained"
            sx={{ mt:1, mb: 1 }}
            fullWidth
            disabled={loading} 
            type="submit">
              Send Request
            </Button>
            </Box>
          </form>
<Typography align="center">
        <div>

        <Link to="/login">Login</Link>
          </div>
          <div>
          Need an account? <Link to="/signup">Sign Up</Link>

          </div>

</Typography>

        </Paper>
      </Container>
    
    </>
  )
}
