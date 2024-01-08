import React from 'react';
import {CssBaseline, useTheme } from '@mui/material';
import Stack from '@mui/material/Stack';
import {useMediaQuery } from '@material-ui/core'
import {useState} from "react";
import Skeleton from '@mui/material/Skeleton';
import {collection, 
  query, 
  getDocs
 } from "firebase/firestore";
import {db} from "../firebase";
import { useNavigate } from 'react-router-dom';

const Carousel = () => {
  const [carouselList, setCarouselList] = useState([]);
  const navigate = useNavigate();
  const handleOpen = (e) => {
    navigate(`/story?id=${e.target.id}`)
  }
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('sm'))


// useEffect(()=> {
  async function getData(){
    const q = query(collection(db, "carousel"));
    const querySnapshot = await getDocs(q);
    setCarouselList(querySnapshot.docs.map(doc =>({
      id: doc.id,
      title: doc.data().title,
      imgUrl: doc.data().imgUrlList[0],
  })))
  }
  getData();
// }, [])

  return( 
      <>
      <CssBaseline/>
      <Stack maxWidth="md" direction={"row"} spacing={2} alignItems={'stretch'} justifyContent={'center'}>
      {(carouselList.length !== 0)?
       <>
       {carouselList.splice(-4).map((carousel) => (
         <Stack item> 
             <img
                 srcSet={`${carousel.imgUrl}?w=92&h=164&fit=crop&auto=format&dpr=2 2x`}
                 src={`${carousel.imgUrl}?w=92&h=164&fit=crop&auto=format`}
                 alt={carousel.title}
                 style={{
                   borderRadius:'5px',
                   height: matchDownMd? '15vh': '40vh',
                   width: 'auto'
                 }}
                 id={carousel.id}
                 onClick={handleOpen}
                 />
         </Stack>
           ))
         }
         </>
      :
      <>
      { Array.from({ length: 4 }, (_, i) =>
      <Stack item> 
        <Skeleton animation="wave"  variant="rounded"  
        sx={{
     
                   borderRadius:'5px',
                   height: matchDownMd? '15vh': '40vh',
                   width: matchDownMd? '8.44vh': '22.5vh'
                 }}/>
      </Stack>)
      }
    </>

      }
      </Stack>
      </>
  )
  };

  export default Carousel;