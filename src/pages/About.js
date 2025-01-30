import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

function About() {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          About Service Hunt
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" paragraph>
            Service Hunt is your one-stop platform for finding and booking local services. 
            We connect skilled service providers with customers looking for quality services 
            in their locality.
          </Typography>
          
          <Typography variant="body1" paragraph>
            Our mission is to make it easy for people to find reliable service providers 
            while helping skilled professionals grow their business. We carefully verify 
            all service providers to ensure quality and reliability.
          </Typography>
          
          <Typography variant="body1" paragraph>
            Whether you need a plumber, electrician, carpenter, or any other service 
            professional, Service Hunt helps you find the right person for the job. 
            Compare prices, read reviews, and book services with confidence.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default About;
