import React, { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, Container, Button, Modal, Form, Badge } from 'react-bootstrap';
import { message } from 'antd';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';
import './AllPropertiesCards.css';

const AllPropertiesCards = () => {
   const { userData } = useContext(UserContext);
   const navigate = useNavigate();
   const [properties, setProperties] = useState([]);
   const [loading, setLoading] = useState(true);
   const [show, setShow] = useState(false);
   const [filterPropertyType, setPropertyType] = useState('');
   const [filterPropertyAdType, setPropertyAdType] = useState('');
   const [filterPropertyAddress, setPropertyAddress] = useState('');
   const [propertyOpen, setPropertyOpen] = useState(null);
   const [userDetails, setUserDetails] = useState({
      fullName: '',
      phone: 0,
   });
   const [currentBooking, setCurrentBooking] = useState(null);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setUserDetails({ ...userDetails, [name]: value });
   };

   const handleClose = () => {
      setShow(false);
      setCurrentBooking(null);
      setPropertyOpen(null);
      setUserDetails({ fullName: '', phone: 0 });
   };

   const handleShow = (propertyId) => {
      if (!userData) {
         message.warning('Please login to view property details');
         navigate('/login');
         return;
      }
      setPropertyOpen(propertyId);
      setShow(true);
   };

   const getAllProperties = async () => {
      try {
         setLoading(true);
         const res = await axios.get('http://localhost:8001/api/user/getAllProperties');
         if (res.data.success) {
            setProperties(res.data.data);
         }
      } catch (error) {
         console.log(error);
         setProperties([]);
      } finally {
         setLoading(false);
      }
   };

   const handleBooking = async (status, propertyId, ownerId) => {
      try {
         const token = localStorage.getItem('token');
         if (!token) {
            message.warning('Please login to book a property');
            navigate('/login');
            return;
         }

         const response = await axios.post(
            `http://localhost:8001/api/user/bookinghandle/${propertyId}`, 
            { userDetails, status, ownerId }, 
            {
               headers: {
                  Authorization: `Bearer ${token}`
               }
            }
         );

         if (response.data.success) {
            message.success(response.data.message);
            handleClose();
            getAllProperties(); // Refresh the properties list
         } else {
            message.error(response.data.message);
         }
      } catch (error) {
         console.log(error);
         if (error.response?.status === 401) {
            message.error('Session expired. Please login again');
            navigate('/login');
         } else {
            message.error('Failed to submit booking request');
         }
      }
   };

   const getBookingDetails = async (propertyId) => {
      try {
         const token = localStorage.getItem('token');
         if (!token) {
            message.warning('Please login to view booking details');
            navigate('/login');
            return;
         }

         const response = await axios.get(`http://localhost:8001/api/user/getallbookings`, {
            headers: { 'Authorization': `Bearer ${token}` }
         });
         
         if (response.data.success) {
            const booking = response.data.data.find(b => b.propertyId === propertyId);
            if (booking) {
               setCurrentBooking(booking);
            } else {
               message.warning('No booking details found for this property');
            }
         } else {
            message.error('Failed to fetch booking details');
         }
      } catch (error) {
         console.log(error);
         if (error.response?.status === 401) {
            message.error('Session expired. Please login again');
            navigate('/login');
         } else {
            message.error('Failed to fetch booking details');
         }
      }
   };

   useEffect(() => {
      getAllProperties();
   }, []);

   const filteredProperties = properties
      .filter((property) => filterPropertyAddress === '' || property.propertyAddress.includes(filterPropertyAddress))
      .filter(
         (property) =>
            filterPropertyAdType === '' ||
            property.propertyAdType.toLowerCase().includes(filterPropertyAdType.toLowerCase())
      )
      .filter(
         (property) =>
            filterPropertyType === '' ||
            property.propertyType.toLowerCase().includes(filterPropertyType.toLowerCase())
      );

   return (
      <Container>
         <div className="filter-container text-center p-4 bg-light rounded shadow-sm mb-4">
            <h4 className="mb-3">Filter Properties</h4>
            <div className="d-flex justify-content-center gap-3">
               <input
                  className="form-control"
                  type="text"
                  placeholder="Search by Address"
                  value={filterPropertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
               />
               <select 
                  className="form-select" 
                  value={filterPropertyAdType} 
                  onChange={(e) => setPropertyAdType(e.target.value)}
               >
                  <option value="">All Ad Types</option>
                  <option value="sale">Sale</option>
                  <option value="rent">Rent</option>
               </select>
               <select 
                  className="form-select"
                  value={filterPropertyType} 
                  onChange={(e) => setPropertyType(e.target.value)}
               >
                  <option value="">All Types</option>
                  <option value="commercial">Commercial</option>
                  <option value="land/plot">Land/Plot</option>
                  <option value="residential">Residential</option>
               </select>
            </div>
         </div>

         {loading ? (
            <div className="text-center p-5">
               <h3>Loading properties...</h3>
            </div>
         ) : (
            <Row className="g-4">
               {filteredProperties && filteredProperties.length > 0 ? (
                  filteredProperties.map((property) => {
                     const isBooked = property.isAvailable === "Unavailable";
                     
                     return (
                        <Col key={property._id} xs={12} md={6} lg={4}>
                           <Card className="h-100 shadow-sm hover-shadow">
                              <div className="property-image-container">
                                 {property.propertyImage && property.propertyImage[0] && (
                                    <Card.Img
                                       variant="top"
                                       src={`http://localhost:8001${property.propertyImage[0].path}`}
                                       alt={`${property.propertyType} in ${property.propertyAddress}`}
                                       className="property-image"
                                    />
                                 )}
                                 {isBooked && (
                                    <Badge bg="danger" className="status-badge">
                                       Already Booked
                                    </Badge>
                                 )}
                              </div>
                              <Card.Body>
                                 <Card.Title className="property-title">
                                    {property.propertyType} - {property.propertyAdType}
                                 </Card.Title>
                                 <div className="property-info">
                                    <p><i className="bi bi-geo-alt"></i> <strong>Location:</strong> {property.propertyAddress}</p>
                                    <p><i className="bi bi-house"></i> <strong>Type:</strong> {property.propertyType}</p>
                                    <p><i className="bi bi-tag"></i> <strong>Ad Type:</strong> {property.propertyAdType}</p>
                                    {userData && (
                                       <>
                                          <p><i className="bi bi-person"></i> <strong>Contact:</strong> {property.ownerContact}</p>
                                          <p><i className="bi bi-check-circle"></i> <strong>Status:</strong> {property.isAvailable}</p>
                                          <p><i className="bi bi-currency-rupee"></i> <strong>Price:</strong> Rs.{property.propertyAmt}</p>
                                       </>
                                    )}
                                 </div>
                                 <div className="mt-auto">
                                    {!userData ? (
                                       <>
                                          <p className="text-warning small mb-2">Sign in to view more details</p>
                                          <Link to="/login">
                                             <Button variant="outline-primary" className="w-100">
                                                Get Info
                                             </Button>
                                          </Link>
                                       </>
                                    ) : (
                                       <>
                                          <Button 
                                             onClick={() => {
                                                handleShow(property._id);
                                                if (isBooked) {
                                                   getBookingDetails(property._id);
                                                }
                                             }} 
                                             variant={isBooked ? "secondary" : "primary"} 
                                             className="w-100"
                                             disabled={isBooked}
                                          >
                                             {isBooked ? "View Renter Details" : "View Details"}
                                          </Button>
                                          
                                          <Modal 
                                             show={show && propertyOpen === property._id} 
                                             onHide={handleClose}
                                             size="lg"
                                          >
                                             <Modal.Header closeButton>
                                                <Modal.Title>
                                                   {isBooked ? "Renter Details" : "Property Details"}
                                                </Modal.Title>
                                             </Modal.Header>
                                             <Modal.Body>
                                                {!isBooked && property.propertyImage && property.propertyImage.length > 0 && (
                                                   <Carousel className="property-carousel mb-4">
                                                      {property.propertyImage.map((image, idx) => (
                                                         <Carousel.Item key={idx}>
                                                            <img
                                                               src={`http://localhost:8001${image.path}`}
                                                               alt={`Property view ${idx + 1}`}
                                                               className="d-block w-100 carousel-image"
                                                            />
                                                         </Carousel.Item>
                                                      ))}
                                                   </Carousel>
                                                )}
                                                
                                                {isBooked ? (
                                                   <div className="renter-details p-3 bg-light rounded">
                                                      {currentBooking && (
                                                         <>
                                                            <h5>Renter Information</h5>
                                                            <p><strong>Name:</strong> {currentBooking.userName}</p>
                                                            <p><strong>Contact:</strong> {currentBooking.phone}</p>
                                                            <p><strong>Booking Status:</strong> {currentBooking.bookingStatus}</p>
                                                         </>
                                                      )}
                                                   </div>
                                                ) : (
                                                   <>
                                                      <div className="property-details p-3 bg-light rounded">
                                                         <Row>
                                                            <Col md={6}>
                                                               <h5>Basic Information</h5>
                                                               <p><strong>Location:</strong> {property.propertyAddress}</p>
                                                               <p><strong>Type:</strong> {property.propertyType}</p>
                                                               <p><strong>Ad Type:</strong> {property.propertyAdType}</p>
                                                            </Col>
                                                            <Col md={6}>
                                                               <h5>Contact & Pricing</h5>
                                                               <p><strong>Owner Contact:</strong> {property.ownerContact}</p>
                                                               <p><strong>Status:</strong> {property.isAvailable}</p>
                                                               <p><strong>Price:</strong> Rs.{property.propertyAmt}</p>
                                                            </Col>
                                                         </Row>
                                                         
                                                         {property.additionalInfo && (
                                                            <div className="mt-3">
                                                               <h5>Additional Information</h5>
                                                               <p>{property.additionalInfo}</p>
                                                            </div>
                                                         )}
                                                      </div>

                                                      <div className="booking-form mt-4">
                                                         <h4>Book Property</h4>
                                                         <Form onSubmit={(e) => {
                                                            e.preventDefault();
                                                            handleBooking('pending', property._id, property.ownerId);
                                                         }}>
                                                            <Row className="mb-3">
                                                               <Col md={6}>
                                                                  <Form.Group>
                                                                     <Form.Label>Full Name</Form.Label>
                                                                     <Form.Control
                                                                        type="text"
                                                                        placeholder="Enter your full name"
                                                                        required
                                                                        name="fullName"
                                                                        value={userDetails.fullName}
                                                                        onChange={handleChange}
                                                                     />
                                                                  </Form.Group>
                                                               </Col>
                                                               <Col md={6}>
                                                                  <Form.Group>
                                                                     <Form.Label>Phone Number</Form.Label>
                                                                     <Form.Control
                                                                        type="number"
                                                                        placeholder="Enter your phone number"
                                                                        required
                                                                        name="phone"
                                                                        value={userDetails.phone}
                                                                        onChange={handleChange}
                                                                     />
                                                                  </Form.Group>
                                                               </Col>
                                                            </Row>
                                                            <Button type="submit" variant="primary" className="w-100">
                                                               Submit Booking Request
                                                            </Button>
                                                         </Form>
                                                      </div>
                                                   </>
                                                )}
                                             </Modal.Body>
                                          </Modal>
                                       </>
                                    )}
                                 </div>
                              </Card.Body>
                           </Card>
                        </Col>
                     );
                  })
               ) : (
                  <Col xs={12}>
                     <Card className="text-center p-5">
                        <h3>No properties available at the moment</h3>
                     </Card>
                  </Col>
               )}
            </Row>
         )}
      </Container>
   );
};

export default AllPropertiesCards;



