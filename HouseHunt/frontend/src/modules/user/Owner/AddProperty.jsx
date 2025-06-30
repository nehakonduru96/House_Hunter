import React, { useState, useEffect, useContext } from 'react';
import { Container, Button, Col, Form, InputGroup, Row, FloatingLabel } from 'react-bootstrap';
import axios from 'axios';
import { message } from 'antd';
import { UserContext } from '../../../App';
import { useNavigate } from 'react-router-dom';

function AddProperty() {
   const { userData } = useContext(UserContext);
   const navigate = useNavigate();
   const [image, setImage] = useState(null);
   const [propertyDetails, setPropertyDetails] = useState({
      propertyType: 'house',
      propertyAdType: 'rent',
      propertyAddress: '',
      ownerContact: '',
      propertyAmt: 0,
      additionalInfo: '',
      bhkType: ''
   });

   const handleImageChange = (e) => {
      const files = e.target.files;
      setImage(files);
   };

   const handleChange = (e) => {
      const { name, value } = e.target;
      setPropertyDetails((prevDetails) => ({
         ...prevDetails,
         [name]: value,
      }));
   };

   useEffect(() => {
      setPropertyDetails((prevDetails) => ({
         ...prevDetails,
         propertyImages: image,
      }));
   }, [image]);

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const formData = new FormData();
         formData.append('propertyType', propertyDetails.propertyType);
         formData.append('propertyAdType', propertyDetails.propertyAdType);
         formData.append('propertyAddress', propertyDetails.propertyAddress);
         formData.append('ownerContact', propertyDetails.ownerContact);
         formData.append('propertyAmt', propertyDetails.propertyAmt);
         formData.append('additionalInfo', propertyDetails.additionalInfo);
         formData.append('userId', userData._id);
         if (propertyDetails.propertyType === 'flat') {
            formData.append('bhkType', propertyDetails.bhkType);
         }

         if (image) {
            for (let i = 0; i < image.length; i++) {
               formData.append('propertyImages', image[i]);
            }
         }

         const response = await axios.post('http://localhost:8001/api/owner/postproperty', formData, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
               'Content-Type': 'multipart/form-data',
            }
         });

         if (response.data.success) {
            message.success(response.data.message);
            // Reset form
            setPropertyDetails({
               propertyType: 'house',
               propertyAdType: 'rent',
               propertyAddress: '',
               ownerContact: '',
               propertyAmt: 0,
               additionalInfo: '',
               bhkType: ''
            });
            setImage(null);
            
            // Use navigate instead of window.location.href
            navigate('/ownerhome');
         } else {
            message.error(response.data.message);
         }
      } catch (error) {
         console.error('Error adding property:', error);
         message.error('Failed to add property. Please try again.');
      }
   };

   return (
      <Container style={{ border: '1px solid lightblue', borderRadius: '5px', padding: '30px' }}>
         <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
               <Form.Group as={Col} md="4">
                  <Form.Group as={Col}>
                     <Form.Label>Property type</Form.Label>
                     <Form.Select name='propertyType' value={propertyDetails.propertyType} onChange={handleChange}>
                        <option value="choose.." disabled>Choose...</option>
                        <option value="house">House</option>
                        <option value="duplex">Duplex</option>
                        <option value="flat">Flat</option>
                     </Form.Select>
                  </Form.Group>
               </Form.Group>
               {propertyDetails.propertyType === 'flat' && (
                  <Form.Group as={Col} md="4">
                     <Form.Group as={Col}>
                        <Form.Label>BHK Type</Form.Label>
                        <Form.Select name='bhkType' value={propertyDetails.bhkType} onChange={handleChange} required>
                           <option value="" disabled>Choose BHK...</option>
                           <option value="1BHK">1 BHK</option>
                           <option value="2BHK">2 BHK</option>
                           <option value="3BHK">3 BHK</option>
                        </Form.Select>
                     </Form.Group>
                  </Form.Group>
               )}
               <Form.Group as={Col} md="4">
                  <Form.Group as={Col}>
                     <Form.Label>Property Ad type</Form.Label>
                     <Form.Select name='propertyAdType' value={propertyDetails.propertyAdType} onChange={handleChange}>
                        <option value="choose.." disabled>Choose...</option>
                        <option value="rent">Rent</option>
                        <option value="sale">Sale</option>
                     </Form.Select>
                  </Form.Group>
               </Form.Group>
               <Form.Group as={Col} md="4">
                  <Form.Label>Property Full Address</Form.Label>
                  <InputGroup hasValidation>
                     <Form.Control
                        type="text"
                        placeholder="Address"
                        aria-describedby="inputGroupPrepend"
                        required
                        name='propertyAddress'
                        value={propertyDetails.propertyAddress}
                        onChange={handleChange}
                     />
                  </InputGroup>
               </Form.Group>
            </Row>
            <Row className="mb-3">
               <Form.Group as={Col} md="6">
                  <Form.Label>Property Images</Form.Label>
                  <Form.Control
                     type="file"
                     placeholder="images"
                     required
                     accept="image/*"
                     name="images"
                     multiple
                     onChange={handleImageChange}
                  />
               </Form.Group>
               <Form.Group as={Col} md="3">
                  <Form.Label>Owner Contact No.</Form.Label>
                  <Form.Control type="phone" placeholder="contact number" required
                     name='ownerContact'
                     value={propertyDetails.ownerContact}
                     onChange={handleChange}
                  />
               </Form.Group>
               <Form.Group as={Col} md="3">
                  <Form.Label>Property Amt.</Form.Label>
                  <Form.Control type="number" placeholder="amount" required
                     name='propertyAmt'
                     value={propertyDetails.propertyAmt}
                     onChange={handleChange}
                  />
               </Form.Group>
               <FloatingLabel
                  label="Additional details for the Property"
                  className="mt-4"
               >
                  <Form.Control name='additionalInfo' value={propertyDetails.additionalInfo} onChange={handleChange} as="textarea" placeholder="Leave a comment here" />
               </FloatingLabel>
            </Row>
            <Button variant='outline-info' className='float-right' type="submit">Submit form</Button>
         </Form>
      </Container>
   );
}

export default AddProperty;
