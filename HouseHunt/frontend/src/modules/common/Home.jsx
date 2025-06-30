import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Button } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import AllPropertiesCards from '../user/AllPropertiesCards';
import Navbar from '../../components/Navbar';

const Home = () => {
   const [index, setIndex] = useState(0);

   const handleSelect = (selectedIndex) => {
      setIndex(selectedIndex);
   };

   const carouselItems = [
      {
         title: "Find Your Dream Home",
         description: "Browse through our extensive collection of properties",
         image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
      },
      {
         title: "Rent or Buy",
         description: "Choose from a variety of rental and sale properties",
         image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
      },
      {
         title: "Professional Service",
         description: "Get expert help in finding your perfect property",
         image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
      }
   ];

   return (
      <>
         <Navbar />
         <div className='home-body'>
            <Carousel activeIndex={index} onSelect={handleSelect}>
               {carouselItems.map((item, idx) => (
                  <Carousel.Item key={idx}>
                     <div
                        className="d-block w-100"
                        style={{
                           height: '500px',
                           backgroundImage: `url(${item.image})`,
                           backgroundSize: 'cover',
                           backgroundPosition: 'center',
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           color: 'white',
                           textAlign: 'center',
                           backgroundColor: 'rgba(0,0,0,0.5)'
                        }}
                     >
                        <div>
                           <h1>{item.title}</h1>
                           <p>{item.description}</p>
                        </div>
                     </div>
                  </Carousel.Item>
               ))}
            </Carousel>
         </div>

         <div className='property-content'>
            <div className='text-center'>
               <h1 className='m-1 p-5'>All Properties that may you look for</h1>
               <p style={{fontSize: 15, fontWeight: 800}}>
                  Want to post your Property? 
                  <Link to={'/register'}>
                     <Button variant='outline-primary' className="ms-2">Register as Owner</Button>
                  </Link>
               </p>
            </div>

            <Container>
               <AllPropertiesCards />
            </Container>
         </div>
      </>
   );
};

export default Home;
