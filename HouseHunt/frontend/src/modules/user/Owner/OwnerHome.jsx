import React, { useState, useContext, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Button, Box } from '@mui/material';
import { UserContext } from '../../../App';
import { useNavigate } from 'react-router-dom';
import AddProperty from './AddProperty';
import AllProperties from './AllProperties';
import BookingRequests from './BookingRequests';
import OwnerProfile from './OwnerProfile';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import AddHomeIcon from '@mui/icons-material/AddHome';
import HouseIcon from '@mui/icons-material/House';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';

const OwnerHome = () => {
   const { userData, setUserData, setUserLoggedIn } = useContext(UserContext);
   const navigate = useNavigate();
   const [activeTab, setActiveTab] = useState('add');

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
                  Manage your properties and bookings
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
                     bgcolor: activeTab === 'add' ? 'primary.light' : 'background.paper',
                     color: activeTab === 'add' ? 'primary.contrastText' : 'text.primary',
                  }}
                  onClick={() => setActiveTab('add')}
               >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                     <AddHomeIcon sx={{ fontSize: 40 }} />
                     <Box>
                        <Typography variant="h6">Add Property</Typography>
                        <Typography variant="body2">List a new property</Typography>
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
                     bgcolor: activeTab === 'properties' ? 'primary.light' : 'background.paper',
                     color: activeTab === 'properties' ? 'primary.contrastText' : 'text.primary',
                  }}
                  onClick={() => setActiveTab('properties')}
               >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                     <HouseIcon sx={{ fontSize: 40 }} />
                     <Box>
                        <Typography variant="h6">My Properties</Typography>
                        <Typography variant="body2">Manage your listings</Typography>
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
                     <NotificationsIcon sx={{ fontSize: 40 }} />
                     <Box>
                        <Typography variant="h6">Booking Requests</Typography>
                        <Typography variant="body2">Manage booking requests</Typography>
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
            {activeTab === 'add' && <AddProperty />}
            {activeTab === 'properties' && <AllProperties />}
            {activeTab === 'bookings' && <BookingRequests />}
            {activeTab === 'profile' && <OwnerProfile />}
         </Box>
      </Container>
   );
};

export default OwnerHome;

