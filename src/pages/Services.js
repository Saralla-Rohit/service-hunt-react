import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';

const services = [
  {
    id: 1,
    title: 'Plumbing',
    description: 'Professional plumbing services for your home',
    image: 'https://source.unsplash.com/random/800x600/?plumbing'
  },
  {
    id: 2,
    title: 'Electrical',
    description: 'Expert electrical repair and installation',
    image: 'https://source.unsplash.com/random/800x600/?electrical'
  },
  {
    id: 3,
    title: 'Carpentry',
    description: 'Custom carpentry and woodworking services',
    image: 'https://source.unsplash.com/random/800x600/?carpentry'
  },
  {
    id: 4,
    title: 'Cleaning',
    description: 'Professional cleaning services for homes and offices',
    image: 'https://source.unsplash.com/random/800x600/?cleaning'
  },
  {
    id: 5,
    title: 'Painting',
    description: 'Interior and exterior painting services',
    image: 'https://source.unsplash.com/random/800x600/?painting'
  },
  {
    id: 6,
    title: 'Gardening',
    description: 'Professional gardening and landscaping services',
    image: 'https://source.unsplash.com/random/800x600/?gardening'
  }
];

function Services() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Our Services
      </Typography>
      <Grid container spacing={4}>
        {services.map((service) => (
          <Grid item key={service.id} xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="200"
                  image={service.image}
                  alt={service.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Services;
