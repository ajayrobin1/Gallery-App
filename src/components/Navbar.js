import * as React from 'react';
import {ButtonGroup, Tooltip,MenuItem , Menu, AppBar, Toolbar, Box ,CssBaseline, Button, Typography } from '@mui/material';
import { useMediaQuery } from '@material-ui/core'
import { Link } from 'react-router-dom';
import { useAuth } from "../AuthContext"
import LogoutModal from './LogoutModal';
import { useState } from "react";
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';

function ResponsiveAppBar(props) {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('sm'))

  const [open, setOpen] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { currentUser } = useAuth()
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    console.log(anchorElNav);
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
    <CssBaseline/>
    <LogoutModal open={open} handleCloseUserMenu={handleCloseUserMenu} handleClose={handleClose} />
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
        <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: 'flex',
              fontFamily: 'Satisfy',
              fontWeight: 600,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Ai Galeria
          </Typography>
          { !matchDownMd &&
          <Box  sx={{ display:'flex', flexGrow: 1 }}>
            <Button
                key="home"
                component={Link} to="/"
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Home
              </Button>

              <Button
                key="gallery"
                component={Link} to="/browse?tab=0"
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Gallery
              </Button>

              <Button
                key="collection"
                component={Link} to="/collection"
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                collection
              </Button>      
          </Box>
          }
          <Box sx={{ml:'auto'}} >
            <Tooltip title="Open settings">
                <MenuIcon onClick={handleOpenUserMenu} fontSize="large"  sx={{ p: 0 }}></MenuIcon>
            </Tooltip>
            <Menu
              sx={{ mt: '45px'}}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
            <MenuItem key="contact" sx={{display:'flex', flexDirection: 'column'}}>
            <Box align="left">
                Mode
              </Box>
            <ButtonGroup fullWidth variant="outlined" size="xs" aria-label="outlined button group">
              <Button onClick={()=>{ 
                props.setMode("dark")
                localStorage.setItem('theme', "dark");
              }}
              variant= {localStorage.getItem('theme')==='dark'? "contained" : "outlined" }
              >
                Dark</Button>
                <Button onClick={()=>{ 
                props.setMode("light")
                localStorage.setItem('theme', "light");
              }}
              variant= {localStorage.getItem('theme')==='light'? "contained" : "outlined" }
              >
                Light</Button>

            </ButtonGroup>
          </MenuItem>
          <MenuItem key="filter" sx={{display:'flex', flexDirection: 'column'}}>

            <Box align="left">
                Adult Filter
              </Box>
            <ButtonGroup fullWidth variant="outlined" size="xs" aria-label="outlined button group">

          <Button 
          onClick={()=>{ 
                props.setSafetyMode("hide")
                localStorage.setItem('safety', "hide");
              }}
              variant= {localStorage.getItem('safety')!=='hide'? "outlined" : "contained" }
              > Hide </Button>
                              <Button onClick={()=>{ 
                props.setSafetyMode("blur")
                localStorage.setItem('safety', "blur");
              }}
              variant= {localStorage.getItem('safety')!=='blur'? "outlined" : "contained" }
              disabled = {!currentUser}
              >
                Blur</Button>

                <Button 
                onClick={()=>{ 
                props.setSafetyMode("show")
                localStorage.setItem('safety', "show");
              }}
              variant= {localStorage.getItem('safety')!=='show'? "outlined" : "contained" }
              disabled = {!currentUser}
              >
                Show
                
                </Button>

          </ButtonGroup>
                </MenuItem>

                <MenuItem  key="feedback"
                component={Link} to="/feedback"
                 onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Feedback</Typography>
                </MenuItem>

                { currentUser
                  ?<MenuItem key="Logout"
               
                  onClick={handleOpen}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>

                  :<MenuItem key="Login"
                  component={Link} to="/login"
                  onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Login</Typography>
                  </MenuItem>
                }
  
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
    </>
  );
}
export default ResponsiveAppBar;