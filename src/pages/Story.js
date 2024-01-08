import React from 'react';
import { useTheme } from '@mui/material';
import { useMediaQuery } from '@material-ui/core'
import {useState} from "react";
import Modal from '@mui/material/Modal';
import Carousel from 'react-material-ui-carousel'
import { useSearchParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import {onSnapshot, doc,

 } from "firebase/firestore";
import {db} from "../firebase";

const Story = () => {
  const [carousel, setCarousel] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const handleClose = () =>{
    setOpen(false);
    navigate('../')
  }
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('sm'))
  const [searchParams] = useSearchParams();
  searchParams.get("id")
  onSnapshot(doc(db, "carousel", searchParams.get("id")), (doc) => {
    if(doc.data()){
      setCarousel(doc.data())
      setLoading(false);
    } else {
      console.log("File not found")
    }
});

    return( 
        <>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            position: 'absolute',
            // transform: 'translate(-50%, -50%)',
            backdropFilter: matchDownMd? 'none': "blur(5px)",
            background:matchDownMd? 'black': 'none',
            m:'auto',
          }}
        >
                  <Carousel
                  autoPlay={true}
                  sx={{
                    m:'auto',
                    width: matchDownMd? '100vw': '56.25vh',
                    height: '100vh',
                }}
                  >

                  {carousel && carousel.imgUrlList.map( (item, i) => (
       
                  <img
                          srcSet={`${item}?w=92&h=164&fit=crop&auto=format&dpr=2 2x`}
                          src={`${item}?w=92&h=164&fit=crop&auto=format`}
                          alt={carousel.title}
                          loading={loading}
                          key={i} 
                          item={item}
                          />
                          
                          
                          ))
                        }
                  
                  </Carousel>        
        </Modal>
        </>
    )
  };


  
  export default Story;