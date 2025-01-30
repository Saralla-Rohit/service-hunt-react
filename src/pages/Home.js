import React from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function Home() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Welcome to Service Hunt
      </Typography>
      <Typography variant="h5" gutterBottom align="center" color="textSecondary">
        Find all types of services in your locality
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Item>
            <Typography variant="h6">Find Services</Typography>
            <Typography>
              Browse through a wide range of services available in your area
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Item>
            <Typography variant="h6">Compare Options</Typography>
            <Typography>
              Compare different service providers and choose the best one
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Item>
            <Typography variant="h6">Book Services</Typography>
            <Typography>
              Easy booking process with secure payment options
            </Typography>
          </Item>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
