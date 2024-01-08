import * as React from 'react';
import { Link } from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';
import CollectionsIcon from '@mui/icons-material/Collections';

import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import {BottomNavigation, Paper} from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';

function BottomNavBar() {
  const [value, setValue] = React.useState(0);

  return (


<Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} 
      elevation={24}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Home"
         component={Link} to="/"
         icon={<HomeIcon />} />
          <BottomNavigationAction label="Explore" 
         component={Link} to="/browse?tab=0"
          icon={<WhatshotIcon />} />
          <BottomNavigationAction label="Collection" 
         component={Link} to="/collection"
          icon={<CollectionsIcon />} />
        </BottomNavigation>
      </Paper>
  )}
export default BottomNavBar;