import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components'
import { useAuth } from "../../AuthContext"
import { 
  query, 
  orderBy,
  startAt,
  doc,
  collection,
  // limit,
  updateDoc, 
  onSnapshot,
} from "firebase/firestore"; 
import {db} from "../../firebase"
// import { useNavigate } from 'react-router-dom';
import Axios from "axios";
import {Alert, Fade,Switch, Skeleton, Card, CardMedia, Box, Autocomplete, 
  Container ,CssBaseline, TextField, Button,
  FormControlLabel, Typography } from '@mui/material';
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


const EditImage = (props) => {
  //Load tags
  // const navigate = useNavigate();
  const [title, setTitle] = useState(null);
  const [imgUrl, setImgUrl] = useState("https://i.imgur.com/UqxQPsC.png");
  const [selectTags, setSelectTags] = useState([]);
  const [nsfw, setNsfw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const [tagList, setTagList] = useState([]);
  const { id } = useParams();
  const [keyword, setKeyword] = useState('');

  const navigate = useNavigate();

  useEffect(  () => { 
    setLoading(true)
    const q = query(collection(db, "tags")
    ,orderBy("name")
    ,startAt(keyword)
    ,startAt(keyword.toUpperCase())
    // ,limit(4)
    );
    onSnapshot(q, (querySnapshot)  => {
      setTagList(querySnapshot.docs.map(doc =>({
        id: doc.id,
        name: doc.data().name
      })))
        })
        setLoading(false)
        // console.log(tagList)
      },[keyword])


  useEffect(  () => { 
    setLoading(true)
    onSnapshot(doc(db, "files", id), (doc) => {
      if(doc.data()){
        setTitle(doc.data().title)
        setNsfw(doc.data().nsfw)
        setImgUrl(doc.data().imgUrl)
        setSelectTags(doc.data().tags)
        setLoading(false);
      } else {
        console.log("File not found")
      }
  });
      },[id])

  const [alertVisibility, setAlertVisibility] = useState(false);
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  async function handleFileSubmit(e){
    e.preventDefault()
    setLoading(true)
    const file = e.target.files[0]
       if (!file) return;
       const formData = new FormData ();
       formData.append("file", file);
       formData.append("upload_preset", "art-gallery");
       Axios.post(
        "https://api.cloudinary.com/v1_1/dfoaqeavf/image/upload",
        formData
      )
       .then((response) => {
         console.log(response);
         setLoading(false)
         setImgUrl(response.data.secure_url);
       })
       .catch((error) => {
         console.log(error);
       });
};

function nsfwToggle(){
  setNsfw(!nsfw);
}

function handleSelectChange(event, newvalue){
  setSelectTags(newvalue);
  console.log(newvalue)
  };

async function handleSubmit(e){
    console.log("Click")
    e.preventDefault()
    if(imgUrl && currentUser){
    try {
      const docRef =await updateDoc(doc(db, 'files', id), {
        title: title,
        tags: selectTags,
        usatedBy: currentUser.uid,
        updatedOn: new Date(),
        imgUrl: imgUrl,
        nsfw: nsfw,
      });
  
      console.log("Document updated with ID: ", docRef.id);
      navigate('/dashboard')
      setAlertVisibility(true)
      setMessage("File updated")
    } catch (e) {
      console.error("Error adding document: ", e);
      navigate('/dashboard')
      setAlertVisibility(true)
      setError("Failed to uploaded")
    }
  }
    setTitle('');
    setImgUrl('');
    setTitle('');
    setTagList([]);
    setKeyword('')
    setSelectTags([]);
};

  return (
    <>
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
            Upload File
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
              Upload file
              <VisuallyHiddenInput 
              type="file" required onChange={handleFileSubmit} />
            </Button>
                  <Box align="center">
                  < Card sx={{ mb: 2, width:128, }}>
                    { loading?
                      <Skeleton animation="wave" variant="rounded" fullWidth height={180} />
                        :<CardMedia
                        sx={{width:128}}
                          component="img"
                          image={`${imgUrl}?w=32&fit=crop&auto=format`}
                          alt={title}
                        />}
                    </Card>
                  </Box>


                    <TextField 
                    id="outlined-basic" 
                    onChange={(e) => setTitle(e.target.value)}
                    value={title} 
                    required 
                    fullWidth 
                    variant="outlined" />
         
          <FormControlLabel sx={{ pt: 1, pb:1 }} control={<Switch />} checked={nsfw} onChange={nsfwToggle} label="NSFW" />

          <Autocomplete
              multiple
              disablePortal
              fullWidth
              onChange={handleSelectChange}
              id="combo-box-demo"
              value={selectTags}
              options={tagList? tagList :[]}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => <TextField 
                fullWidth 
                onChange={(e)=>setKeyword(e.target.value)}  
              {...params} label="Tags" />}
            />

          <Button component="label" 
          fullWidth 
          onClick={handleSubmit}
          type="submit" 
          sx={{ mt: 3, mb: 2 }}
          variant="contained">
              Update
            </Button>
         
      </form>
      </Box>
      {/* </Box> */}
    </Container>
</>
  )
};

export default EditImage;
