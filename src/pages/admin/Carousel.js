import React, { useState } from 'react';
import styled from 'styled-components'
import { useAuth } from "../../AuthContext"
import { 
  collection, 
  addDoc, query, getDocs, doc, deleteDoc 
} from "firebase/firestore"; 
import {db} from "../../firebase"
// import { useNavigate } from 'react-router-dom';
import Axios from "axios";
import {Alert, Modal, Fade, Skeleton, Card, CardMedia, Box, 
  Container ,CssBaseline, TextField, Button, Typography, Stack, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


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

const Carousel = () => {

  const [title, setTitle] = useState(null);
  const [imgUrlList, setImgUrlList] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState("")


  const [alertVisibility, setAlertVisibility] = useState(false);
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const [carouselList, setCarouselList] = useState([]);

  const handleOpenDelete = () => setOpenDelete(true)

  const handleCloseDelete = () => {
    setError("")
    setOpenDelete(false);
  }
// useEffect(()=> {
  async function getData(){
    const q = query(collection(db, "carousel"));
    const querySnapshot = await getDocs(q);
    setCarouselList(querySnapshot.docs.map(doc =>({
      id: doc.id,
      title: doc.data().title,
  })))
  }
  getData();

  async function handleFileSubmit(e){
    e.preventDefault()
    setLoading(true)
    const file = e.target.files[0];
    var formData = new FormData ()
      formData.append("file", file);
      formData.append("upload_preset", "art-gallery");
      Axios.post(
        "https://api.cloudinary.com/v1_1/<>/image/upload",
        formData
        ).then((response) => {
         console.log(response);
         setLoading(false)
         setImgUrlList(
           imgUrlList=> [...imgUrlList, response.data.secure_url]
           );
       })
       .catch((error) => {
         console.log(error);
       });
};

async function handleDelete(event) {
  setLoading(true)
  handleOpenDelete()
  await deleteDoc(doc(db, "carousel", deleteId))
  .then(()=>{
      setMessage("File deleted")
      setLoading(false);
      setDeleteId(null)
      handleCloseDelete();
      console.log(event.target.id)
  }
  )
  .catch(()=>{
    console.error();
    setLoading(false);
    handleCloseDelete();
    setError("Failed to Delete file");
    setDeleteId(null)
  })


};


async function handleSubmit(e){
    console.log("Click")
    e.preventDefault()
    if(imgUrlList && currentUser){
    try {
      const docRef =await addDoc(collection(db, "carousel"), {
        title: title,
        uploadedBy: currentUser.uid,
        uploadedOn: new Date(),
        imgUrlList: imgUrlList,
        views: 0,
      });

      console.log("Document written with ID: ", docRef.id);
      setAlertVisibility(true)
      setMessage("File uploaded")
    } catch (e) {
      console.error("Error adding document: ", e);
      setAlertVisibility(true)
      setError("Failed to uploaded")
    }
  }
    setTitle('');
    setImgUrlList([]);
};

  return (
    <>
        <Modal
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {error && <Alert severity="error">{error}</Alert>}
          <Typography sx={{py:1}} id="modal-modal-title">
            Are you sure? want to delete this file?
          </Typography>
          <Box sx={{py:1}}>
            <Button variant="outlined" disabled={loading} onClick={handleDelete}>Yes</Button>
            <Button color="error"  onClick={handleCloseDelete} >No</Button>
          </Box>

        </Box>
      </Modal>
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
      <Container component="main" maxWidth="sm">
      <Typography component="h2" variant="h5" align="center">
            Upload Carousel
          </Typography>
        <CssBaseline />

  <Box sx={{ px:3 }}>
         <form onSubmit={handleSubmit} > 
         <Button component="label" 
            disabled={loading}
            variant="contained"  
            fullWidth
            sx={{ mt: 3, mb: 2 }}
            startIcon={<CloudUploadIcon />}>
              Upload Carousel (16: 9)
              <VisuallyHiddenInput 
              type="file" required onChange={handleFileSubmit} />
            </Button>
                  <Box component={Stack} align="center" flexDirection={'row'}>
                {imgUrlList && imgUrlList.map((imgUrl)=> (
                      < Card sx={{ mb: 2, width:128, }}>
                      { loading?
                        <Skeleton animation="wave" variant="rounded" fullWidth height={180} />
                          :
                          <CardMedia
                          sx={{width:128, height:228}}
                            component="img"
                            image={`${imgUrl}?w=32&fit=contain&auto=format`}
                            alt={title}
                          />}
                      </Card>

                ))}
                  </Box>

                    <TextField id="outlined-basic" 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              fullWidth
              label="Title" 
              variant="outlined" />
         
          <Button component="label" 
          fullWidth 
       
          onClick={handleSubmit}
          type="submit" 
          sx={{ mt: 3, mb: 2 }}
          variant="contained">
              Submit
            </Button>
         
      </form>
      </Box>
      {/* </Box> */}
      <Stack maxWidth="md" spacing={2} alignItems={'stretch'} justifyContent={'center'}>

      {carouselList && carouselList.splice(-4).map((carousel) => (
         <Stack item> 
         <Paper sx={{p:2}}>
             <Typography>{carousel.title}</Typography>
             <Stack direction={"row"} alignItems={'stretch'} justifyContent={'space-around'}>
             <Stack item> <Typography color="secondary">Edit</Typography></Stack>
             <Stack item>
             <Button color="error"
                id={carousel.id}
                onClick={(e)=> {
                  setDeleteId(e.target.id);
                  setOpenDelete(true)}}
             >
              Delete
             </Button>
             </Stack>
             </Stack>
          </Paper>
         </Stack>
           ))}
           </Stack>
    </Container>
</>
  )
};

export default Carousel;
