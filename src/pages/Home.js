import React from 'react';
import Container from '@mui/material/Container';
import { Button, Typography, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useMediaQuery } from '@material-ui/core'
import Carousel from '../components/Carousel';
import {useState, useEffect} from "react";
import LoginIcon from '@mui/icons-material/Login';
import ExploreIcon from '@mui/icons-material/Explore';
import { useAuth } from "../AuthContext"
import {collection, 
  query, 
  onSnapshot, 
  where, 
  limit,
  orderBy
 } from "firebase/firestore";
import {db} from "../firebase";
import { Link } from 'react-router-dom';


const Home = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('sm'))
  const { currentUser } = useAuth()

  useEffect(() => { 
    function getQuery(){ 
       return query(collection(db, "files")
       ,where("nsfw","==", false) 
       ,limit(6)
       ,orderBy("views", "desc")
       )
      }
    const q = getQuery();

if(q){
 onSnapshot(q, (querySnapshot)  => {
   setLoading(true)
   setFiles(
    querySnapshot.docs.map(doc =>({
     id: doc.id,
     title: doc.data().title,
     imgUrl: doc.data().imgUrl
   }))
   )
   setLoading(false)
})
}
},[])

    return( 
        <>
        <Container maxWidth="md" disableGutters>
        <Box align="center" sx={{p:1}}>
          <Typography>
            Featured
          </Typography>
        </Box>
          <Carousel/>
        <Container>
        <Typography align = "center" sx={{mt:3}}>
            Popular
        </Typography>
        <ImageList 
        fullWidth 
        cols={matchDownMd?2: 3} 
        row={1} 
        >
        {files.map((file) => (
            <ImageListItem component={Link} to={`/gallery/${file.id}`}>
            <img
                srcSet={`${file.imgUrl}?w=92&h=92&fit=crop&auto=format&dpr=2 2x`}
                src={`${file.imgUrl}?w=92&h=92&fit=crop&auto=format`}
                alt={file.title}
                loading={loading}
                sx={{width: 92}}
            />
            </ImageListItem>
        ))}
        </ImageList>
                <Box align="center" sx={{p:1}}>
                  {
                    currentUser?
                    <Button component={Link} to={'/browse?tab=1'}
                    onClick={()=> window.scrollTo(0, 0) }
                    size="small" variant="outlined">
                    Explore
                    <ExploreIcon sx={{ml:1}}/>
                  </Button>
                    :<Button component={Link} to={'/login'}
                    onClick={()=> window.scrollTo(0, 0) }
                    size="small" variant="outlined">
                    Log in
                    <LoginIcon sx={{ml:1}}/>
                  </Button>
                  }
                </Box>
          </Container>
        </Container>
        </>
    )
  };

export default Home;