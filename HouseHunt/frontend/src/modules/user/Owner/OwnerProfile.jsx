import React, { useState, useContext, useEffect } from 'react';
import { Card, Row, Col, Container, Button, Form, Badge, Table, Modal } from 'react-bootstrap';
import { UserContext } from '../../../App';
import { message } from 'antd';
import axios from 'axios';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

const OwnerProfile = () => {
   const { userData, setUserData } = useContext(UserContext);
   const navigate = useNavigate();
   const [isEditing, setIsEditing] = useState(false);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [profileData, setProfileData] = useState({
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      address: userData.address || '',
      profileImage: userData.profileImage || null
   });
   const [propertyStats, setPropertyStats] = useState({
      totalProperties: 0,
      availableProperties: 0,
      bookedProperties: 0,
      totalBookings: 0,
      pendingBookings: 0
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      setProfileData(prev => ({
         ...prev,
         [name]: value
      }));
   };

   const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
         setProfileData(prev => ({
            ...prev,
            profileImage: file
         }));
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const formData = new FormData();
         Object.keys(profileData).forEach(key => {
            formData.append(key, profileData[key]);
         });

         const response = await axios.put(
            `http://localhost:8001/api/user/updateprofile/${userData._id}`,
            formData,
            {
               headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'multipart/form-data'
               }
            }
         );

         if (response.data.success) {
            message.success('Profile updated successfully');
            setUserData(prev => ({
               ...prev,
               ...profileData
            }));
            setIsEditing(false);
         } else {
            message.error('Failed to update profile');
         }
      } catch (error) {
         console.log(error);
         message.error('Failed to update profile');
      }
   };

   const fetchPropertyStats = async () => {
      try {
         const [propertiesResponse, bookingsResponse] = await Promise.all([
            axios.get('http://localhost:8001/api/owner/getallproperties', {
               headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
            }),
            axios.get('http://localhost:8001/api/owner/getallbookings', {
               headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
            })
         ]);

         if (propertiesResponse.data.success && bookingsResponse.data.success) {
            const properties = propertiesResponse.data.data;
            const bookings = bookingsResponse.data.data;

            setPropertyStats({
               totalProperties: properties.length,
               availableProperties: properties.filter(p => p.isAvailable === "Available").length,
               bookedProperties: properties.filter(p => p.isAvailable === "Unavailable").length,
               totalBookings: bookings.length,
               pendingBookings: bookings.filter(b => b.bookingStatus === "pending").length
            });
         }
      } catch (error) {
         console.log(error);
      }
   };

   const handleDeleteAccount = async () => {
      try {
         const response = await axios.delete(
            `http://localhost:8001/api/user/deleteaccount/${userData._id}`,
            {
               headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
               }
            }
         );

         if (response.data.success) {
            message.success('Account deleted successfully');
            // Clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            // Clear context
            setUserData(null);
            // Navigate to home page
            navigate('/');
         } else {
            message.error('Failed to delete account');
         }
      } catch (error) {
         console.error('Error deleting account:', error);
         message.error('Failed to delete account');
      }
   };

   useEffect(() => {
      fetchPropertyStats();
   }, []);

   return (
      <Container className="profile-container">
         <Row className="justify-content-center">
            <Col md={8}>
               <Card className="profile-card shadow-sm">
                  <Card.Body>
                     <div className="text-center mb-4">
                        <div className="profile-image-container">
                           {profileData.profileImage ? (
                              <img
                                 src={typeof profileData.profileImage === 'string' 
                                    ? `http://localhost:8001${profileData.profileImage}`
                                    : profileData.profileImage instanceof File 
                                       ? URL.createObjectURL(profileData.profileImage)
                                       : null
                                 }
                                 alt="Profile"
                                 className="profile-image"
                              />
                           ) : (
                              <div className="profile-image-placeholder">
                                 {profileData.name?.charAt(0).toUpperCase() || 'U'}
                              </div>
                           )}
                           {isEditing && (
                              <div className="profile-image-upload">
                                 <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    id="profile-image-input"
                                    className="d-none"
                                 />
                                 <label htmlFor="profile-image-input" className="btn btn-light btn-sm">
                                    Change Photo
                                 </label>
                              </div>
                           )}
                        </div>
                        <h3 className="mt-3">{profileData.name}</h3>
                        <Badge bg="success" className="user-type-badge">Property Owner</Badge>
                     </div>

                     <Form onSubmit={handleSubmit}>
                        <Row>
                           <Col md={6}>
                              <Form.Group className="mb-3">
                                 <Form.Label>Full Name</Form.Label>
                                 <Form.Control
                                    type="text"
                                    name="name"
                                    value={profileData.name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                 />
                              </Form.Group>
                           </Col>
                           <Col md={6}>
                              <Form.Group className="mb-3">
                                 <Form.Label>Email</Form.Label>
                                 <Form.Control
                                    type="email"
                                    name="email"
                                    value={profileData.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                 />
                              </Form.Group>
                           </Col>
                        </Row>

                        <Row>
                           <Col md={6}>
                              <Form.Group className="mb-3">
                                 <Form.Label>Phone Number</Form.Label>
                                 <Form.Control
                                    type="tel"
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                 />
                              </Form.Group>
                           </Col>
                           <Col md={6}>
                              <Form.Group className="mb-3">
                                 <Form.Label>Address</Form.Label>
                                 <Form.Control
                                    type="text"
                                    name="address"
                                    value={profileData.address}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                 />
                              </Form.Group>
                           </Col>
                        </Row>

                        <div className="d-flex justify-content-between align-items-center mt-4">
                           <div className="profile-stats">
                              <div className="stat-item">
                                 <h5>Total Properties</h5>
                                 <p>{propertyStats.totalProperties}</p>
                              </div>
                              <div className="stat-item">
                                 <h5>Available Properties</h5>
                                 <p>{propertyStats.availableProperties}</p>
                              </div>
                              <div className="stat-item">
                                 <h5>Booked Properties</h5>
                                 <p>{propertyStats.bookedProperties}</p>
                              </div>
                              <div className="stat-item">
                                 <h5>Pending Bookings</h5>
                                 <p>{propertyStats.pendingBookings}</p>
                              </div>
                           </div>
                           <div className="profile-actions">
                              {isEditing ? (
                                 <>
                                    <Button variant="success" type="submit" className="me-2">
                                       Save Changes
                                    </Button>
                                    <Button variant="secondary" onClick={() => setIsEditing(false)}>
                                       Cancel
                                    </Button>
                                 </>
                              ) : (
                                 <>
                                    <Button variant="primary" onClick={(e) => {
                                       e.preventDefault();
                                       setIsEditing(true);
                                    }}>
                                       Edit Profile
                                    </Button>
                                    <Button 
                                       variant="danger" 
                                       className="ms-2"
                                       onClick={() => setShowDeleteModal(true)}
                                    >
                                       Delete Account
                                    </Button>
                                 </>
                              )}
                           </div>
                        </div>
                     </Form>

                     <div className="mt-4">
                        <h4>Recent Bookings</h4>
                        <Table striped bordered hover>
                           <thead>
                              <tr>
                                 <th>Property</th>
                                 <th>Status</th>
                                 <th>Date</th>
                              </tr>
                           </thead>
                           <tbody>
                              {propertyStats.pendingBookings > 0 && (
                                 <tr>
                                    <td>Property Booking</td>
                                    <td><Badge bg="warning">Pending</Badge></td>
                                    <td>{new Date().toLocaleDateString()}</td>
                                 </tr>
                              )}
                              {propertyStats.bookedProperties > 0 && (
                                 <tr>
                                    <td>Property Booking</td>
                                    <td><Badge bg="success">Confirmed</Badge></td>
                                    <td>{new Date().toLocaleDateString()}</td>
                                 </tr>
                              )}
                           </tbody>
                        </Table>
                     </div>
                  </Card.Body>
               </Card>
            </Col>
         </Row>

         {/* Delete Account Confirmation Modal */}
         <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
               <Modal.Title>Delete Account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <p>Are you sure you want to delete your account? This action cannot be undone.</p>
               <p className="text-danger">This will permanently delete:</p>
               <ul>
                  <li>Your profile information</li>
                  <li>All your properties</li>
                  <li>All your bookings</li>
               </ul>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
               </Button>
               <Button variant="danger" onClick={handleDeleteAccount}>
                  Delete Account
               </Button>
            </Modal.Footer>
         </Modal>
      </Container>
   );
};

export default OwnerProfile; 