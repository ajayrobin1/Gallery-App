import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';

export default function CircularIndeterminate() {
  return (
    <Container fullWidth sx={{p:10}} align="center">
            <Box 
            sx={{ display: 'block', p:5, align: 'center' }}
            fullWidth align="center"
            >
                <CircularProgress />
            </Box>

    </Container>

  );
}