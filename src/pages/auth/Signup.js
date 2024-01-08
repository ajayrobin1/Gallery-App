import React, { useRef, useState } from "react"
import { useAuth } from "../../AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { getAuth, signInWithRedirect, updateProfile} from "firebase/auth";
import { Box, Container, Typography,Button, TextField, Alert, Paper } from '@mui/material';
import LoadingScreen from '../../components/LoadingScreen'


export default function Signup() {
  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { signup } = useAuth()
  const { provider } = useAuth()

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function signInWithGoogle(){
    const auth = getAuth();
    signInWithRedirect(auth, provider)
    navigate("/")
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const auth = getAuth();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    try {
      setError("")
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
      await updateProfile(auth.currentUser, {
        displayName: nameRef.current.value
      }).then(() => {
        console.log("profile updated")

      }).catch((error) => {
        console.log(error)
      });
      navigate("/")
    } catch {
      setError("Failed to create an account")
    }

    setLoading(false)
  }

  return (
    <>
      {loading
    ?<LoadingScreen/>
     :<Container component="main" maxWidth="xs"  sx={{pt:3}}>
          <Typography omponent="h2" align="center" variant="h5">
          Sign Up
          </Typography>
        <Paper sx={{ p:3, mt: 2 }} >
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

              <TextField id="outlined-basic" 
  
              required 
              fullWidth
              label="password" 
              variant="outlined"
              inputRef={passwordRef} 
              type="password"
              sx={{ mt:1, mb: 1 }}

              />

              <TextField id="outlined-basic" 
                
                required 
                fullWidth
                label="Confirm password" 
                variant="outlined"
                inputRef={passwordConfirmRef} 
                type="password"
                sx={{ mt:1, mb: 1 }}

                />

  
            <Button
            variant="contained"
            sx={{ mt:1, mb: 1 }}
            fullWidth
            disabled={loading} 
            type="submit">
              Sign Up
            </Button>
            <Typography variant="subtitle1" align="center" gutterBottom>or</Typography>
            <Typography variant="subtitle1" align="center" gutterBottom>Sign in using Google</Typography>
            <Button
            variant="outlined"
            sx={{ mb: 2 }}
            fullWidth
            disabled={loading} 
            onClick={signInWithGoogle}
            type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" id="google"><path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path><path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path><path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path><path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path></svg>
            </Button>


            </Box>
          </form>
<Typography align="center">
        <div>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          <div>
          Already have an account? <Link to="/login">Log In</Link>
          </div>

</Typography>

        </Paper>
      </Container>
}
    </>
  )
}
