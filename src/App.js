import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.js";
import Gallery from "./pages/Gallery.js";
import NoPage from "./pages/NoPage";
import FullImage from "./pages/FullImage.js";
import Feedback from "./pages/Feedback";
import Login from './pages/auth/Login';
import PrivateRoute from "./pages/auth/PrivateRoute"
import ForgotPassword from "./pages/auth/ForgotPassword"
import Dashboard from "./pages/admin/Dashboard.js"
import ResponsiveAppBar from "./components/Navbar"
import React from "react"
import Signup from "./pages/auth/Signup"
import './App.css';

import AnonymousRoute from "./pages/auth/AnonymousRoute.js";
import Profile from './pages/Profile.js'
import { useState } from "react";
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
import {  Typography, CssBaseline, Stack } from '@mui/material';
import { useMediaQuery } from '@material-ui/core'
import BottomNavBar from "./components/BottomNavBar.js";
import { useAuth } from "./AuthContext.js"
import EditImage from "./pages/admin/EditImage.js";
import Story from "./pages/Story.js";
import InstagarmLogo from './static/instagram_icon.svg'
import TelegramLogo from './static/telegram_icon.svg'
import RedditLogo from './static/reddit_icon.svg'

export default function App() {
  const themeMode = localStorage.getItem('theme') || 'light';
  localStorage.setItem('theme', themeMode);
  const [mode, setMode] = useState(themeMode);
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('sm'))
  const { currentUser } = useAuth();

  const safety = localStorage.getItem('safety') || 'blur';
  if (currentUser){
    localStorage.setItem('safety', safety);
  } else {
    localStorage.setItem('safety', 'hide');
  }
  const [safetyMode, setSafetyMode] = useState(safety);

  const myTheme= createTheme({
    palette:{
          mode: mode
    }
});
  return (
      <ThemeProvider theme={myTheme}>
      <CssBaseline/>
        <BrowserRouter>
        <>
        <ResponsiveAppBar 
        mode={mode} 
        setMode={setMode}
        safetyMode={safetyMode}
        setSafetyMode={setSafetyMode}
        />
  
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Gallery />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="gallery/:id" element={<FullImage />} />
          <Route path="edit/:id" element={<EditImage />} />
          <Route path="story/" element={<Story />} />
          <Route path="/signup" element={<AnonymousRoute><Signup/></AnonymousRoute>}/>
          <Route path="/login" element={<AnonymousRoute><Login/></AnonymousRoute>}/>
          <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
          <Route path="/collection" element={<PrivateRoute><Profile/></PrivateRoute>}/>
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="*" element={<NoPage />} />
        </Routes>

    <footer style={{ textAlign: 'center', marginTop: '25px' , paddingBottom:matchDownMd?'60px':'10px' }}>
      <Stack justifyContent={'center'} gap={2} flexDirection={'row'} sx={{p:2}}>
        <Stack item component={Link} target="_blank" rel="noopener noreferrer" to={'/'}>
        <img src={InstagarmLogo} style={{margin:'auto'}} width='25' height='25' alt="" />
        <Typography fontSize={'small'} sx={{pt:1}}>
          Instagarm
            </Typography>
        </Stack>
        <Stack item component={Link} target="_blank" rel="noopener noreferrer" to={''}>
        <img src={TelegramLogo} style={{margin:'auto'}} width='25' height='25' alt="" />
        <Typography fontSize={'small'} sx={{pt:1}}>
          Telegram
            
            </Typography>
          </Stack>
        <Stack item component={Link} target="_blank" rel="noopener noreferrer" to={''}>
        <img src={RedditLogo} style={{margin:'auto'}} width='25' height='25' alt="" />
          <Typography fontSize={'small'} sx={{pt:1}}>
          Reddit
          </Typography>
        </Stack>
      </Stack>

      <Typography>
      Galeria ©2023
      </Typography>
      </footer>

      {matchDownMd &&
        <BottomNavBar/>

      }
  </>
        </BrowserRouter>

      </ThemeProvider>
  )
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />, mountNode);