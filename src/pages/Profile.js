import * as React from 'react';
import Avatar from '@mui/material/Avatar';
// import Stack from '@mui/material/Stack';
import { Box, Container, CssBaseline, Typography } from '@mui/material';
import { useAuth } from '../AuthContext';
import GalleryComp from '../components/GalleryComp';
import { styled } from '@mui/material';


const Item = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.secondary,
}));

export default function Profile() {
  const { currentUser } = useAuth()
  return (
    <Container maxWidth="md" align="center" sx={{mt:2}}>
      <CssBaseline/>
    <Item maxWidth="xl">
    <Box align="center">
          <Avatar
          src={currentUser.photoURL}
          aria-label="recipe" />
          <Box sx={{mt:1}}>
          <Typography fontSize={'small'}>{currentUser.displayName}</Typography>
          </Box>
    </Box>
    </Item>
      <Item align="center" maxWidth="xl">
        <GalleryComp content="collection"/>
      </Item>
    </Container>
  );
}