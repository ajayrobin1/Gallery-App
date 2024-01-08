import React,  { useState }  from 'react';
import {Alert, Fade, Box,
  Container ,CssBaseline, TextField, Button,
   Typography } from '@mui/material';
import { 
    collection, 
    addDoc, 
  } from "firebase/firestore"; 
import {db} from "../firebase"

const Feedback = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [messageInupt, setMessageInput] = useState('');
  const [alertVisibility, setAlertVisibility] = useState(false);
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  async function handleSubmit(e){
    console.log("Click")
    e.preventDefault()
    try {
      const docRef =await addDoc(collection(db, "message"), {
        name: name,
        email: email,
        message: messageInupt,
      });
  
      console.log("Message written with ID: ", docRef.id);
      setAlertVisibility(true)
      setMessage("Feedback submitted")

    } catch (e) {
      console.error("Error adding document: ", e);
      setAlertVisibility(true)
      setError("Failed to sumbmit feedback")
    }

    setName('');
    setEmail('');
    setMessageInput('');
};
  return (
    <>
          {error && <Alert severity="error">{error}</Alert>}
          {message && <
            Fade
              in={alertVisibility} //Write the needed condition here to make it appear
              addEndListener={() => {
                setTimeout(() => {
                  setAlertVisibility(false)
                  setMessage(null)
                }, 2000);
              }}
              >
          <Alert severity="success">{message}</Alert>
          </Fade>
          }
    <Container component="main" maxWidth="sm">
    <CssBaseline/>
        <Box sx={{ mt: 1, p:3 }}>
        <form onSubmit={handleSubmit} > 
      <Typography component="h2" align="center" variant="h5"> Feedback </Typography>
        <TextField variant="outlined" label="Name" sx={{ mt: 1, mb: 1 }} 
        onChange={(e) => setName(e.target.value)
        } 
        fullWidth />
        <TextField variant="outlined" label="Email" sx={{ mt: 1, mb: 1 }}
        onChange={(e) => setEmail(e.target.value)}
        
        fullWidth />
        <TextField
         label="Message" sx={{ mt: 1, mb: 1 }} 
         fullWidth
         id="outlined-textarea"
         multiline
         rows={4}
         maxRows={8}
        onChange={(e) => setMessageInput(e.target.value)}

         />

        <Button variant="contained" 
          onClick={handleSubmit}

         type="submit" sx={{ mt: 2, mb: 2 }} fullWidth>Send</Button>
      </form>
      </Box>
    </Container>
    </>
  );
};

export default Feedback;
