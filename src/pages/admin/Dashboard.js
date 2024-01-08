import * as React from 'react';
import PropTypes from 'prop-types';
import {Tabs, Tab, Typography, Box} from '@mui/material';

import AddImage from './AddImage';
import ManageTags from './ManageTags';
import ImageIndex from './ImageIndex'
import Carousel from './Carousel'

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

export default function DashBoard() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Add images" {...a11yProps(0)} />
          <Tab label="Edit image" {...a11yProps(1)} />
          <Tab label="Tags" {...a11yProps(2)} />
          <Tab label="Carousel" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <AddImage/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ImageIndex/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ManageTags/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <Carousel/>
      </CustomTabPanel>

    </Box>
  );
}
