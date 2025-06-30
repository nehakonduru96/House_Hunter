import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Container, Badge } from 'react-bootstrap';
import './BookingHistory.css';

const AllProperties = () => {
   const [allProperties, setAllProperties] = useState([]);
   const [loading, setLoading] = useState(true);

   const getAllProperties = async () => {
      try {
         const response = await axios.get(`http://localhost:8001/api/user/getAllProperties`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
         });

         if (response.data.success) {
            setAllProperties(response.data.data);
         } else {
            message.error(response.data.message);
         }
      } catch (error) {
         console.log(error);
         message.error('Failed to fetch properties');
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      getAllProperties();
   }, []);

   if (loading) {
      return (
         <Container>
            <div className="text-center p-5">
               <h4>Loading available properties...</h4>
            </div>
         </Container>
      );
   }

   return (
      <Container>
         <h3 className="mb-4">Available Properties</h3>
         <Row className="g-4">
            {allProperties.map((property) => (
               <Col key={property._id} xs={12} md={6} lg={4}>
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
                           bg="info"
                           className="status-badge"
                        >
                           Available
                        </Badge>
                     </div>
                     <Card.Body>
                        <Card.Title className="booking-title">
                           {property.propertyType || 'Property'} - {property.propertyAdType || 'N/A'}
                        </Card.Title>
                        <div className="booking-info">
                           <p><strong>Location:</strong> {property.propertyAddress || 'N/A'}</p>
                           <p><strong>Owner Contact:</strong> {property.ownerContact || 'N/A'}</p>
                           <p><strong>Price:</strong> {property.propertyAmt ? `₹${property.propertyAmt}` : 'N/A'}</p>
                           <p><strong>Description:</strong> {property.propertyDescription || 'N/A'}</p>
                        </div>
                        <div className="d-grid">
                           <button 
                              className="btn btn-primary"
                              onClick={() => {
                                 // Add booking functionality here
                                 message.info('Booking functionality will be implemented soon');
                              }}
                           >
                              Book Now
                           </button>
                        </div>
                     </Card.Body>
                  </Card>
               </Col>
            ))}
            {allProperties.length === 0 && (
               <Col xs={12}>
                  <div className="text-center p-5">
                     <h4>No Properties Available</h4>
                     <p>There are no properties available at the moment.</p>
                  </div>
               </Col>
            )}
         </Row>
      </Container>
   );
};

export default AllProperties;

