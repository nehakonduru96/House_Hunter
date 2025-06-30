import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Card, Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../App';

const BookingRequests = () => {
   const [bookingRequests, setBookingRequests] = useState([]);
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();
   const { userData } = useContext(UserContext);

   const getAllBookingRequests = useCallback(async () => {
      try {
         const token = localStorage.getItem('token');

         if (!userData || !token) {
            message.error('Please login to view booking requests');
            navigate('/login');
            return;
         }

         const response = await axios.get(
            `http://localhost:8001/api/user/getallbookings/${userData._id}`,
            {
               headers: {
                  'Authorization': `Bearer ${token}`
               }
            }
         );

         if (response.data.success) {
            setBookingRequests(response.data.data);
         } else {
            message.error('Failed to fetch booking requests');
         }
      } catch (error) {
         console.error('Error fetching booking requests:', error);
         if (error.response?.status === 401) {
            message.error('Session expired. Please login again');
            navigate('/login');
         } else {
            message.error('Failed to fetch booking requests');
         }
      } finally {
         setLoading(false);
      }
   }, [userData, navigate]);

   useEffect(() => {
      getAllBookingRequests();
   }, [getAllBookingRequests]);

   const handleBookingStatus = async (bookingId, status) => {
      try {
         const token = localStorage.getItem('token');
         if (!token) {
            message.error('Please login to update booking status');
            navigate('/login');
            return;
         }

         const response = await axios.post(
            `http://localhost:8001/api/user/updatebookingstatus/${bookingId}`,
            { status },
            {
               headers: {
                  'Authorization': `Bearer ${token}`
               }
            }
         );

         if (response.data.success) {
            message.success(response.data.message);
            getAllBookingRequests(); // Refresh the list
         } else {
            message.error(response.data.message || 'Failed to update booking status');
         }
      } catch (error) {
         console.error('Error updating booking status:', error);
         if (error.response?.status === 401) {
            message.error('Session expired. Please login again');
            navigate('/login');
         } else {
            message.error(error.response?.data?.message || 'Failed to update booking status');
         }
      }
   };

   const getStatusBadge = (status) => {
      switch (status) {
         case 'pending':
            return <Badge bg="warning">Pending</Badge>;
         case 'booked':
            return <Badge bg="success">Booked</Badge>;
         case 'rejected':
            return <Badge bg="danger">Rejected</Badge>;
         default:
            return <Badge bg="secondary">{status}</Badge>;
      }
   };

   // Helper function to safely access property data
   const getPropertyDetail = (booking, field) => {
      return booking?.propertId?.[field] || 'N/A'; // Return 'N/A' if the field or propertId is undefined
   };

   if (loading) {
      return (
         <Container className="text-center mt-5">
            <h3>Loading booking requests...</h3>
         </Container>
      );
   }

   return (
      <Container>
         <h2 className="mb-4">Booking Requests</h2>
         <Row className="g-4">
            {bookingRequests.length === 0 ? (
               <Col xs={12}>
                  <Card className="text-center p-5">
                     <h3>No booking requests at the moment</h3>
                  </Card>
               </Col>
            ) : (
               bookingRequests.map((booking) => (
                  <Col key={booking._id} xs={12} md={6} lg={4}>
                     <Card className="h-100">
                        <Card.Body>
                           <Card.Title>Booking Request</Card.Title>
                           <Card.Text>
                              <strong>Property:</strong> {getPropertyDetail(booking, 'propertyType')}<br />
                              <strong>Address:</strong> {getPropertyDetail(booking, 'propertyAddress')}<br />
                              <strong>Amount:</strong> ₹{getPropertyDetail(booking, 'propertyAmt')}<br />
                              <strong>Status:</strong> {getStatusBadge(booking.bookingStatus)}
                           </Card.Text>
                           <Card.Text>
                              <strong>Renter Details:</strong><br />
                              Name: {booking.userName}<br />
                              Phone: {booking.phone}
                           </Card.Text>
                           {booking.bookingStatus === 'pending' && (
                              <div className="d-grid gap-2">
                                 <Button
                                    variant="success"
                                    onClick={() => handleBookingStatus(booking._id, 'booked')}
                                 >
                                    Accept
                                 </Button>
                                 <Button
                                    variant="danger"
                                    onClick={() => handleBookingStatus(booking._id, 'rejected')}
                                 >
                                    Reject
                                 </Button>
                              </div>
                           )}
                        </Card.Body>
                     </Card>
                  </Col>
               ))
            )}
         </Row>
      </Container>
   );
};

export default BookingRequests;
