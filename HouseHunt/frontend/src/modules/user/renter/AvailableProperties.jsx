import React, { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, Container, Button, Modal, Form } from 'react-bootstrap';
import { message } from 'antd';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';
import { UserContext } from '../../../App';
import { useNavigate } from 'react-router-dom';

const AvailableProperties = () => {
   const { userData } = useContext(UserContext);
   const navigate = useNavigate();
   const [properties, setProperties] = useState([]);
   const [loading, setLoading] = useState(true);
   const [showBookingModal, setShowBookingModal] = useState(false);
   const [selectedProperty, setSelectedProperty] = useState(null);
   const [bookingDetails, setBookingDetails] = useState({
      fullName: '',
      phone: '',
      email: ''
   });

   useEffect(() => {
      const fetchProperties = async () => {
         if (!userData) {
            message.warning('Please login to view available properties');
            navigate('/login');
            return;
         }

         const token = localStorage.getItem('token');
         if (!token) {
            message.warning('Please login to view available properties');
            navigate('/login');
            return;
         }

         try {
            console.log('Fetching properties...');
            const response = await axios.get('http://localhost:8001/api/user/getAllProperties', {
               headers: {
                  'Authorization': `Bearer ${token}`
               }
            });
            
            if (response.data.success) {
               console.log('Properties fetched successfully:', response.data.data);
               // Filter only available properties
               const availableProperties = response.data.data.filter(
                  property => property.isAvailable === "Available"
               );
               setProperties(availableProperties);
            } else {
               console.error('Failed to fetch properties:', response.data.message);
               message.error('Failed to fetch properties');
            }
         } catch (error) {
            console.error('Error fetching properties:', error);
            if (error.response?.status === 401) {
               message.error('Session expired. Please login again');
               navigate('/login');
            } else if (error.code === 'ERR_NETWORK') {
               message.error('Network error. Please check your connection');
            } else {
               message.error('Failed to fetch properties');
            }
         } finally {
            setLoading(false);
         }
      };

      fetchProperties();
   }, [userData, navigate]);

   const handleBookingClick = (property) => {
      if (!userData) {
         message.warning('Please login to book a property');
         navigate('/login');
         return;
      }
      setSelectedProperty(property);
      setShowBookingModal(true);
   };

   const handleBookingSubmit = async (e) => {
      e.preventDefault();
      try {
         const token = localStorage.getItem('token');
         if (!token) {
            message.warning('Please login to submit a booking');
            navigate('/login');
            return;
         }

         console.log('Submitting booking for property:', selectedProperty._id);
         const response = await axios.post(
            `http://localhost:8001/api/user/bookinghandle/${selectedProperty._id}`,
            {
               userDetails: bookingDetails,
               status: "pending",
               userId: userData._id,
               ownerId: selectedProperty.ownerId
            },
            {
               headers: {
                  'Authorization': `Bearer ${token}`
               }
            }
         );

         if (response.data.success) {
            message.success('Booking request submitted successfully');
            setShowBookingModal(false);
            // Refresh the properties list
            const updatedResponse = await axios.get('http://localhost:8001/api/user/getAllProperties', {
               headers: {
                  'Authorization': `Bearer ${token}`
               }
            });
            if (updatedResponse.data.success) {
               const availableProperties = updatedResponse.data.data.filter(
                  property => property.isAvailable === "Available"
               );
               setProperties(availableProperties);
            }
         } else {
            message.error('Failed to submit booking request');
         }
      } catch (error) {
         console.error('Error submitting booking:', error);
         if (error.response?.status === 401) {
            message.error('Session expired. Please login again');
            navigate('/login');
         } else if (error.code === 'ERR_NETWORK') {
            message.error('Network error. Please check your connection');
         } else {
            message.error('Failed to submit booking request');
         }
      }
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setBookingDetails(prev => ({
         ...prev,
         [name]: value
      }));
   };

   if (loading) {
      return (
         <Container className="text-center mt-5">
            <h3>Loading properties...</h3>
         </Container>
      );
   }

   return (
      <Container>
         <Row className="g-4">
            {properties.length === 0 ? (
               <Col xs={12}>
                  <Card className="text-center p-5">
                     <h3>No properties available at the moment</h3>
                  </Card>
               </Col>
            ) : (
               properties.map((property) => (
                  <Col key={property._id} xs={12} md={6} lg={4}>
                     <Card className="h-100">
                        <div style={{ height: '200px', overflow: 'hidden' }}>
                           {property.propertyImage && property.propertyImage[0] ? (
                              <img
                                 src={`http://localhost:8001${property.propertyImage[0].path}`}
                                 alt={`${property.propertyType} in ${property.propertyAddress}`}
                                 className="w-100 h-100"
                                 style={{ objectFit: 'cover' }}
                              />
                           ) : (
                              <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                                 <span>No Image Available</span>
                              </div>
                           )}
                        </div>
                        <Card.Body>
                           <Card.Title>{property.propertyType}</Card.Title>
                           <Card.Text>
                              <strong>Address:</strong> {property.propertyAddress}<br />
                              <strong>Amount:</strong> ₹{property.propertyAmt}<br />
                              <strong>Contact:</strong> {property.ownerContact}
                           </Card.Text>
                           {property.additionalInfo && (
                              <Card.Text>
                                 <strong>Additional Info:</strong> {property.additionalInfo}
                              </Card.Text>
                           )}
                           <Button
                              variant="primary"
                              onClick={() => handleBookingClick(property)}
                              className="w-100"
                           >
                              Book Now
                           </Button>
                        </Card.Body>
                     </Card>
                  </Col>
               ))
            )}
         </Row>

         {/* Booking Modal */}
         <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
            <Modal.Header closeButton>
               <Modal.Title>Book Property</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               {selectedProperty && selectedProperty.propertyImage && selectedProperty.propertyImage.length > 0 && (
                  <Carousel className="mb-4">
                     {selectedProperty.propertyImage.map((image, idx) => (
                        <Carousel.Item key={idx}>
                           <img
                              src={`http://localhost:8001${image.path}`}
                              alt={`Property view ${idx + 1}`}
                              className="d-block w-100"
                              style={{ height: '300px', objectFit: 'cover' }}
                           />
                        </Carousel.Item>
                     ))}
                  </Carousel>
               )}
               <Form onSubmit={handleBookingSubmit}>
                  <Form.Group className="mb-3">
                     <Form.Label>Full Name</Form.Label>
                     <Form.Control
                        type="text"
                        name="fullName"
                        value={bookingDetails.fullName}
                        onChange={handleInputChange}
                        required
                     />
                  </Form.Group>
                  <Form.Group className="mb-3">
                     <Form.Label>Phone Number</Form.Label>
                     <Form.Control
                        type="tel"
                        name="phone"
                        value={bookingDetails.phone}
                        onChange={handleInputChange}
                        required
                     />
                  </Form.Group>
                  <Form.Group className="mb-3">
                     <Form.Label>Email</Form.Label>
                     <Form.Control
                        type="email"
                        name="email"
                        value={bookingDetails.email}
                        onChange={handleInputChange}
                        required
                     />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100">
                     Submit Booking Request
                  </Button>
               </Form>
            </Modal.Body>
         </Modal>
      </Container>
   );
};

export default AvailableProperties; 