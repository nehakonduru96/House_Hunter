import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Container, Badge, Button } from 'react-bootstrap';
import './BookingHistory.css';

const AllBookings = () => {
   const [allBookings, setAllBookings] = useState([]);
   const [propertyDetails, setPropertyDetails] = useState({});
   const [loading, setLoading] = useState(true);

   const getAllBookings = async () => {
      try {
         const response = await axios.get('http://localhost:8001/api/owner/getallbookings', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
         });

         if (response.data.success) {
            const bookings = response.data.data;
            setAllBookings(bookings);
            
            // Fetch property details for each booking
            for (const booking of bookings) {
               try {
                  const propertyId = booking.propertId || booking.propertyId;
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
            message.error(response.data.message || 'Failed to fetch bookings');
         }
      } catch (error) {
         console.log(error);
         message.error('Failed to fetch bookings');
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      getAllBookings();
   }, []);

   const handleBookingStatus = async (bookingId, propertyId, status) => {
      try {
         // If confirming a booking, first reject all other pending bookings for this property
         if (status === 'booked') {
            const pendingBookings = allBookings.filter(
               booking => 
                  booking.propertyId === propertyId && 
                  booking._id !== bookingId && 
                  booking.bookingStatus === 'pending'
            );

            // Reject all other pending bookings
            for (const booking of pendingBookings) {
               await axios.post(
                  'http://localhost:8001/api/owner/handlebookingstatus',
                  { bookingId: booking._id, propertyId, status: 'rejected' },
                  {
                     headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
                  }
               );
            }
         }

         // Update the selected booking status
         const response = await axios.post(
            'http://localhost:8001/api/owner/handlebookingstatus',
            { bookingId, propertyId, status },
            {
               headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
            }
         );

         if (response.data.success) {
            message.success(response.data.message);
            getAllBookings(); // Refresh the bookings list
         } else {
            message.error('Failed to update booking status');
         }
      } catch (error) {
         console.log(error);
         message.error('Failed to update booking status');
      }
   };

   const getStatusBadgeVariant = (status) => {
      switch (status?.toLowerCase()) {
         case 'pending':
            return 'warning';
         case 'booked':
            return 'success';
         default:
            return 'secondary';
      }
   };

   if (loading) {
      return (
         <Container>
            <div className="text-center p-5">
               <h4>Loading bookings...</h4>
            </div>
         </Container>
      );
   }

   return (
      <Container>
         <h3 className="mb-4">Property Booking Requests</h3>
         <Row className="g-4">
            {allBookings.map((booking) => {
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
                              <p><strong>Renter Name:</strong> {booking.userName || 'N/A'}</p>
                              <p><strong>Renter Contact:</strong> {booking.phone || 'N/A'}</p>
                           </div>
                           {booking.bookingStatus === 'pending' && (
                              <div className="d-flex gap-2 mt-3">
                                 <Button 
                                    variant="success" 
                                    className="flex-grow-1"
                                    onClick={() => handleBookingStatus(booking._id, propertyId, 'booked')}
                                 >
                                    Confirm Booking
                                 </Button>
                                 <Button 
                                    variant="danger" 
                                    className="flex-grow-1"
                                    onClick={() => handleBookingStatus(booking._id, propertyId, 'rejected')}
                                 >
                                    Reject
                                 </Button>
                              </div>
                           )}
                        </Card.Body>
                     </Card>
                  </Col>
               );
            })}
            {allBookings.length === 0 && (
               <Col xs={12}>
                  <div className="text-center p-5">
                     <h4>No Booking Requests</h4>
                     <p>You don't have any pending booking requests.</p>
                  </div>
               </Col>
            )}
         </Row>
      </Container>
   );
};

export default AllBookings;

