import React, { useState, useEffect } from "react"
import { useAuth } from "../../AuthContext"
import { Link } from 'react-router-dom';
import {collection, orderBy, query, onSnapshot, doc, deleteDoc, limit, startAfter, getDoc} from "firebase/firestore";
import {db} from "../../firebase"
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Card, CardActions, Container, Button, ImageList, Modal, CardMedia, Box, Typography, Alert, CssBaseline, TextField, Fade } from "@mui/material";
import LoadingScreen from '../../components/LoadingScreen'
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularProgress from '@mui/material/CircularProgress';


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


const ImageIndex = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [message, setMessage] = useState("")
  const [deleteId, setDeleteId] = useState("")
  const theme = useTheme();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("")

  const [fileId, setFileId] = useState(null)

  const [author, setAuthor] = useState("")
  const [loading, setLoading] = useState(false);
  const [alertVisibility, setAlertVisibility] = useState(false);

  const [lastVisible, setLastVisible] = useState();
  const [hasMore, setHasMore] = useState(true);
  
  const matchDownMd = useMediaQuery(theme.breakpoints.down('sm'));
  const { currentUser } = useAuth()
  const handleOpenDelete = () => setOpenDelete(true)
  const handleCloseDelete = () => {
    setError("")
    setOpenDelete(false);
  }

  async function handleDelete(event) {
    setLoading(true)
    handleOpenDelete()
    console.log(author)
    if (currentUser.uid === author){
    await deleteDoc(doc(db, "files", deleteId))
    .then(()=>{
        setMessage("File deleted")
        setLoading(false);
        setDeleteId(null)
        handleCloseDelete();
    }
    )
    .catch(()=>{
      console.error();
      setLoading(false);
      handleCloseDelete();
      setAlertVisibility(true)
      setError("Failed to Delete file");
      setDeleteId(null)
    })
  
} else {
  // handleCloseDelete();
  setLoading(false);
  setAlertVisibility(true)
  setError("Permission Denied")
  }
};

function fetchMoreData(){
  setHasMore(true)
if(hasMore && lastVisible){
  function getNextQuery(){ 
    return query(collection(db, "files")
    ,orderBy("uploadedOn", "desc") 
    ,startAfter(lastVisible)
    ,limit(4))
 }
const q = getNextQuery();
onSnapshot(q, (querySnapshot)  => {
  setLoading(true)
  const newList = querySnapshot.docs.map(doc =>({
    id: doc.id,
    imgUrl: doc.data().imgUrl,
    nsfw: doc.data().nsfw,
    uploadedBy: doc.data().uploadedBy
  }))
  setFiles(files.concat(newList))

  setLoading(false)
  setLastVisible(querySnapshot.docs.at(-1))
  if(querySnapshot.docs<3) {
    setHasMore(false)
  }
})
}
}

    useEffect(  () => { 


        async function getFile(){
        const docRef = doc(db, "files", fileId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const file = {
            id: docSnap.id,
            title: docSnap.data().title,
            imgUrl: docSnap.data().imgUrl,
            nsfw: docSnap.data().nsfw,
            uploadedBy: docSnap.data().uploadedBy
          }
          setFiles([])
          setFiles(oldArray => [...oldArray, file])
          setLoading(false)
    setHasMore(false)

        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      }
      if(fileId) {
        getFile()
      } else {
        const q = query(collection(db, "files"),
        orderBy("uploadedOn", "desc"), 
        limit(8));
        onSnapshot(q, (querySnapshot)  => {
          setLoading(true)
          const newArray = querySnapshot.docs.map(doc =>({
            id: doc.id,
            title: doc.data().title,
            imgUrl: doc.data().imgUrl,
            nsfw: doc.data().nsfw,
            uploadedBy: doc.data().uploadedBy
          }))
          setFiles([])
          setFiles(oldArray => [...oldArray, ...newArray])
          setLastVisible(querySnapshot.docs.at(-1))
          setLoading(false)

      })
    } 
  },[fileId])
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
{loading 
    ?<LoadingScreen/>
    :<Container maxWidth="md">
      <CssBaseline/>
      <Typography className="lead">Hello {currentUser.displayName}..!</Typography>

      <TextField fullWidth placeholder="Search file ID"
      
      onChange={(e)=> 
        
        {setFileId(e.target.value)
        
        console.log(fileId)
        }}
      
      />

      <InfiniteScroll
      className='hideScroll'
      dataLength={files.length} //This is important field to render the next data
      next={fetchMoreData}
      hasMore={hasMore}
      loader={
        <Box sx={{ display: 'flex', justifyContent:'center', py:4, m:4 }}>
          <CircularProgress />
        </Box>
      }
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>You have seen it all</b>
        </p>
      }
      >
    <ImageList
      variant="quilted"
      cols={matchDownMd ? 1 : 4 }
      rowHeight={320}
     >
      {files.map((item) => (
            <Card key={item.id}
            sx={{display:(item.nsfw && (localStorage.getItem('safety')==='hide'))?"none": "block"}} 
            >
              <Link to={`/gallery/${item.id}`}>
              <CardMedia

              component="img"
              alt={item.title}
              sx={{ height: 180 }} 
              image={`${item.imgUrl}?w=164&h=164&fit=crop&auto=format`}
              style={{ 
                filter:(item.nsfw && (localStorage.getItem('safety')==='blur'))? 'blur(10px)': 'none'
              }}
              >
              </CardMedia>
              </Link>
              <CardActions>
                <Button
                color="secondary" 
                component={Link}
                to={`/edit/${item.id}`}
                size="small">
                  Edit
                </Button>
                <Button 
                color="error" 
                size="small"
                id={item.id}
                onClick={(e)=> {
                  setDeleteId(e.target.id);
                  setAuthor(item.uploadedBy);
                  setOpenDelete(true)}}
                  >
                Delete
                </Button>
              </CardActions>
        </Card>
      ))}
    </ImageList>
    </InfiniteScroll>

    </Container>
}
    </>
  );
};
export default ImageIndex;