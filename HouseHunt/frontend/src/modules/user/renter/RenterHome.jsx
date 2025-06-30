import React, { useState, useContext, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Button, Box } from '@mui/material';
import { UserContext } from '../../../App';
import { useNavigate } from 'react-router-dom';
import AvailableProperties from './AvailableProperties';
import BookingHistory from './BookingHistory';
import RenterProfile from './RenterProfile';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import HouseIcon from '@mui/icons-material/House';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';

const RenterHome = () => {
   const { userData, setUserData, setUserLoggedIn } = useContext(UserContext);
   const navigate = useNavigate();
   const [activeTab, setActiveTab] = useState('available');

   useEffect(() => {
      if (!userData) {
         navigate('/login');
      }
   }, [userData, navigate]);

   const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUserData(null);
      setUserLoggedIn(false);
      navigate('/login');
   };

   const handleHomeClick = () => {
      navigate('/');
   };

   if (!userData) {
      return null;
   }

   return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
               <Typography variant="h4" component="h1" gutterBottom>
                  Welcome, {userData.name}!
               </Typography>
               <Typography variant="subtitle1" color="text.secondary">
                  Manage your property rentals and bookings
               </Typography>
            </Box>
            <Box>
               <Button
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  onClick={handleHomeClick}
                  sx={{ mr: 2 }}
               >
                  Home
               </Button>
               <Button
                  variant="outlined"
                  color="error"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
               >
                  Logout
               </Button>
            </Box>
         </Box>

         <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
               <Paper
                  sx={{
                     p: 3,
                     cursor: 'pointer',
                     transition: 'all 0.3s ease',
                     '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3,
                     },
                     bgcolor: activeTab === 'available' ? 'primary.light' : 'background.paper',
                     color: activeTab === 'available' ? 'primary.contrastText' : 'text.primary',
                  }}
                  onClick={() => setActiveTab('available')}
               >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                     <HouseIcon sx={{ fontSize: 40 }} />
                     <Box>
                        <Typography variant="h6">Available Properties</Typography>
                        <Typography variant="body2">Browse and book properties</Typography>
                     </Box>
                  </Box>
               </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
               <Paper
                  sx={{
                     p: 3,
                     cursor: 'pointer',
                     transition: 'all 0.3s ease',
                     '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3,
                     },
                     bgcolor: activeTab === 'bookings' ? 'primary.light' : 'background.paper',
                     color: activeTab === 'bookings' ? 'primary.contrastText' : 'text.primary',
                  }}
                  onClick={() => setActiveTab('bookings')}
               >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                     <HistoryIcon sx={{ fontSize: 40 }} />
                     <Box>
                        <Typography variant="h6">My Bookings</Typography>
                        <Typography variant="body2">View booking history</Typography>
                     </Box>
                  </Box>
               </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
               <Paper
                  sx={{
                     p: 3,
                     cursor: 'pointer',
                     transition: 'all 0.3s ease',
                     '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3,
                     },
                     bgcolor: activeTab === 'profile' ? 'primary.light' : 'background.paper',
                     color: activeTab === 'profile' ? 'primary.contrastText' : 'text.primary',
                  }}
                  onClick={() => setActiveTab('profile')}
               >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                     <PersonIcon sx={{ fontSize: 40 }} />
                     <Box>
                        <Typography variant="h6">My Profile</Typography>
                        <Typography variant="body2">Manage your account</Typography>
                     </Box>
                  </Box>
               </Paper>
            </Grid>
         </Grid>

         <Box sx={{ mt: 4 }}>
            {activeTab === 'available' && <AvailableProperties />}
            {activeTab === 'bookings' && <BookingHistory />}
            {activeTab === 'profile' && <RenterProfile />}
         </Box>
      </Container>
   );
};

export default RenterHome;

