import React from 'react';
import Img404 from '../static/Img404.png'
import { Container } from '@mui/material';


const NoPage = () => {
    return <>
    <Container maxwidth="sm" align="center" sx={{p:8}}>
        <img src={Img404} width={300} alt='no page found'/>
    </Container>
    </>
  };
  
  export default NoPage;