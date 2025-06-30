import { message } from 'antd';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { Card, Row, Col, Container, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../App';
import './BookingHistory.css';

const BookingHistory = () => {
   const [bookings, setBookings] = useState([]);
   const [propertyDetails, setPropertyDetails] = useState({});
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();
   const { userData } = useContext(UserContext);

   const getBookingHistory = useCallback(async () => {
      try {
         const token = localStorage.getItem('token');
         if (!userData || !token) {
            message.error('Please login to view booking history');
            navigate('/login');
            return;
         }

         const response = await axios.get(
            `http://localhost:8001/api/user/getallbookings/${userData._id}`,
            {
               headers: { 'Authorization': `Bearer ${token}` }
            }
         );

         if (response.data.success) {
            const userBookings = response.data.data;
            setBookings(userBookings);
            
            // Fetch property details for each booking
            for (const booking of userBookings) {
               try {
                  const propertyId = booking.propertId;
                  if (!propertyId) {
                     console.log('No property ID found for booking:', booking);
                     continue;
                  }

                  const propertyResponse = await axios.get(`http://localhost:8001/api/user/getAllProperties`);
                  if (propertyResponse.data.success) {
                     const matchingProperty = propertyResponse.data.data.find(
                        property => property._id === propertyId
                     );
                     
                     if (matchingProperty) {
                        setPropertyDetails(prev => ({
                           ...prev,
                           [propertyId]: matchingProperty
                        }));
                     }
                  }
               } catch (error) {
                  console.log('Error fetching property details:', error);
               }
            }
         } else {
            message.error(response.data.message || 'Failed to fetch booking history');
         }
      } catch (error) {
         console.log(error);
         if (error.response?.status === 401) {
            message.error('Session expired. Please login again');
            navigate('/login');
         } else {
            message.error('Failed to fetch booking history');
         }
      } finally {
         setLoading(false);
      }
   }, [userData, navigate]);

   useEffect(() => {
      getBookingHistory();
   }, [getBookingHistory]);

   const getStatusBadgeVariant = (status) => {
      switch (status?.toLowerCase()) {
         case 'pending':
            return 'warning';
         case 'booked':
            return 'success';
         case 'rejected':
            return 'danger';
         default:
            return 'secondary';
      }
   };

   if (loading) {
      return (
         <Container>
            <div className="text-center p-5">
               <h4>Loading booking history...</h4>
            </div>
         </Container>
      );
   }

   return (
      <Container>
         <h3 className="mb-4">My Booking History</h3>
         <Row className="g-4">
            {bookings.map((booking) => {
               const propertyId = booking.propertId || booking.propertyId;
               const property = propertyDetails[propertyId] || {};
               
               return (
                  <Col key={booking._id} xs={12} md={6} lg={4}>
                     <Card className="booking-card h-100 shadow-sm">
                        <div className="booking-image-container">
                           {property.propertyImage && property.propertyImage[0] ? (
                              <Card.Img
                                 variant="top"
                                 src={`http://localhost:8001${property.propertyImage[0].path}`}
                                 alt="Property"
                                 className="booking-image"
                              />
                           ) : (
                              <div className="placeholder-image">
                                 No Image Available
                              </div>
                           )}
                           <Badge 
                              bg={getStatusBadgeVariant(booking.bookingStatus)}
                              className="status-badge"
                           >
                              {booking.bookingStatus || 'Unknown'}
                           </Badge>
                        </div>
                        <Card.Body>
                           <Card.Title className="booking-title">
                              {property.propertyType || 'Property'} - {property.propertyAdType || 'N/A'}
                           </Card.Title>
                           <div className="booking-info">
                              <p><strong>Booking ID:</strong> {booking._id}</p>
                              <p><strong>Location:</strong> {property.propertyAddress || 'N/A'}</p>
                              <p><strong>Price:</strong> {property.propertyAmt ? `₹${property.propertyAmt}` : 'N/A'}</p>
                              <p><strong>Owner Contact:</strong> {property.ownerContact || 'N/A'}</p>
                              <p><strong>Booking Date:</strong> {new Date(booking.createdAt).toLocaleDateString()}</p>
                           </div>
                        </Card.Body>
                     </Card>
                  </Col>
               );
            })}
            {bookings.length === 0 && (
               <Col xs={12}>
                  <div className="text-center p-5">
                     <h4>No Booking History</h4>
                     <p>You haven't made any property bookings yet.</p>
                  </div>
               </Col>
            )}
         </Row>
      </Container>
   );
};

export default BookingHistory; 