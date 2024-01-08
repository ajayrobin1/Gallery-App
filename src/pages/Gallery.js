import React from 'react';
import GalleryComp from '../components/GalleryComp';
import {Tabs, Container, Tab, Typography, Box} from '@mui/material';
import PropTypes from 'prop-types';
import ExploreTags from '../components/ExploreTags'
import { Link } from 'react-router-dom'

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Gallery = () => {
  let search = window.location.search;
  let params = new URLSearchParams(search);
  let foo = Number(params.get('tab'));

  const [value, setValue] = React.useState(foo);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
        <Container maxWidth="md" disableGutters>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={value} onChange={handleChange} variant="fullWidth"  aria-label="basic tabs example">
        <Tab label="Popular"
                  component={Link}
                  to="/browse?tab=0"
         {...a11yProps(0)} />
        <Tab label="Latest" 
          component={Link}
          to="/browse?tab=1"
        {...a11yProps(1)} />
        <Tab label="Browse"
          component={Link}
          to="/browse?tab=2"
        {...a11yProps(2)} />
      </Tabs>
    </Box>
    <CustomTabPanel value={value} index={0}>
      <GalleryComp content="popular"/>
    </CustomTabPanel>
    <CustomTabPanel value={value} index={1}>
    <GalleryComp content="latest"/>
    </CustomTabPanel>
    <CustomTabPanel value={value} index={2}>
    <ExploreTags/>
    </CustomTabPanel>
    </Container>
    </>
  );
};

export default Gallery;
