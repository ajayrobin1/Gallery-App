import React from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { doc, updateDoc, getDoc, increment, arrayUnion, arrayRemove } from "firebase/firestore";
import {db} from "../firebase"

import {useState, useEffect} from "react"
import {IconButton, Chip, Card, CardMedia, Box, Stack ,CssBaseline, Button, Skeleton } from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import DownloadIcon from '@mui/icons-material/Download';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {red} from '@mui/material/colors';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from "../AuthContext"
import { useMediaQuery } from '@material-ui/core'
import {useTheme } from '@mui/material/styles';
import Modal from '@mui/material/Modal';

// const Item = styled(Box)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
// }));


export default function FullImage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLiked, setUserLiked] = useState(false);
  const theme = useTheme();
  const { id } = useParams();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate();
  const { currentUser } = useAuth()
  const [open, setOpen] = useState(true);

  const handleClose = () =>{
    setOpen(false);
    navigate(-1)
  }
  const [searchParams] = useSearchParams();
  searchParams.get("id")
  
 async function handleLike(){
    if(currentUser) {
      console.log("user liked the post")
      setUserLiked(true)
      await updateDoc(doc(db, 'files', id), {
        likedBy: arrayUnion(currentUser.uid)
      })
    } else {
      navigate('/login')
    }
  }

  async function handleUnLike(){
    if(currentUser) {
      console.log("user unliked the post")
      setUserLiked(false)
      await updateDoc(doc(db, 'files', id), {
        likedBy: arrayRemove(currentUser.uid)
      })
    } 
    else navigate('/login')
  }
  
  async function downloadFile() {
    if(currentUser) {
      await updateDoc(doc(db, 'files', id), {
        downloads: increment(1)
      })
      var FileSaver = require('file-saver');
      FileSaver.saveAs(file.imgUrl, "image.jpg");
    } else {
      navigate('/login')
    }
  }

//   useEffect(() => {
//     const handleContextmenu = e => {
//         e.preventDefault()
//     }
//     document.addEventListener('contextmenu', handleContextmenu)
//     return function cleanup() {
//         document.removeEventListener('contextmenu', handleContextmenu)
//     }
// }, [])

useEffect(() => { 
  async function getFile(){
  const docRef = doc(db, "files", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    setFile(docSnap.data())
    if(currentUser && docSnap.data().likedBy){
      setUserLiked(docSnap.data().likedBy.includes(currentUser.uid)) 
    }
  } else {
    console.log("No such document!");
  }
}

async function updateViews(){
  setLoading(true);
  await updateDoc(doc(db, 'files', id), {
    views: increment(1)
  })}
    setFile(null)
    window.scrollTo(0, 0)
    getFile();
    updateViews();
    setLoading(false);
},[id, currentUser]);

  return (
    <>
    {loading?
<LoadingScreen/>
      :<>
      <CssBaseline/>

           <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            position: 'absolute',
            m:'auto',
            backdropFilter:'blur(5px)'
          }}
        >       
     
      {/* {loading
      ?<LoadingScreen/>
    : */}
<Box align='center' sx={{
p:0,
m:'auto',
bgcolor: theme.palette.mode === 'dark' ? 'none' : '#fff',
width: matchDownMd?'100vw':'70vw',

}}
>
      <Stack
      sx={{
        overflowY:matchDownMd? 'scroll': 'hidden',
        width: matchDownMd?'100vw':'100%',
        height: '100vh',
      }}
      justifyContent={matchDownMd?'center':'space-between'} flexDirection= {matchDownMd? 'col': 'row'}>
        <Stack item>
            {!file  && <Skeleton 
        animation="wave" 
        variant="rounded" 
        sx ={{
          pointerEvents: "none !important",
          height:matchDownMd?'80vh': '100vh'
          }}
        /> }
          
          <Card 
            sx ={{pointerEvents: "none !important",
          }}
          >
            {<CardMedia
            component = "img"
            src={file && file.imgUrl}
            alt={file && file.title}
            sx={{height:matchDownMd?'auto': '100vh'}}   
          />
            }
        </Card>
        </Stack>

        <Stack sx={{ wdith:matchDownMd?'100vw':'30vw' ,
      }}>
  
            <Box 
            
            sx={{
            display:'flex',
            bgcolor: theme.palette.mode === 'dark' ? 'none' : '#fff',

            p:2,
     
            justifyContent:matchDownMd?'space-evenly':'space-between', width:matchDownMd?'100vw':'30vw' }}>

            <Button onClick={downloadFile}
            variant="outlined"
            size="small">
              <DownloadIcon />
              Download
            </Button>

              {userLiked?
            <IconButton variant= "filled" 
        
            onClick={handleUnLike}>
              <FavoriteIcon
              fontSize="medium"
              sx={{ color: red[500] }}
              />
            </IconButton>
              :<IconButton 
         
              variant= "filled" 
              onClick={handleLike}>
              <FavoriteBorderIcon
              fontSize="medium"
              sx={{ color: red[500] }}
              />
            </IconButton>
              } 
            </Box>
            <Stack 
        direction={"row"} 
        flexWrap={'wrap'}
        gap={1}
        
        justifyContent='space-evenly' 
 
        >
              {file && file.tags.map(tag => {
                return(
                <>
                  <Chip icon={<TagIcon fontSize="small" />} 
                  label={tag.name} 
         
                  size="small"
                  color="secondary" 
                  variant={"outlined"}
                  clickable
                  component={Link}
                  to={`../browse?tab=2&q=${tag.name}`}
                  />
                </>
                )
                })}
              </Stack>
            </Stack>
        </Stack>
        </Box>
</Modal>
    </>
}
    </>
  );
}