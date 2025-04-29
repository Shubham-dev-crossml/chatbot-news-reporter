import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';

export default function NewsFilter({ setQuery,handleSearch }) {
  const categories = [
    'World', 'Nation', 'Business', 'Technology',
    'Entertainment', 'Sports', 'Science', 'Health'
  ];

  return (
    <Box mb={6} sx={{ textAlign: 'center' }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Discover the Latest in Popular Topics
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {categories.map((category) => (
          <Grid item key={category}>
            <Button
            type='submit'
              onClick={(e) => {setQuery("");handleSearch(e,category)}}
              variant="outlined"
              sx={{
                borderRadius: '20px', // Slightly rounded corners
                textTransform: 'capitalize',
                fontSize: '0.875rem', // Smaller text size
                paddingX: 3, // Less horizontal padding
                paddingY: 1, // Less vertical padding
                borderColor: 'primary.main',
                color: 'primary.main',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderColor: 'primary.dark',
                  transform: 'scale(1.03)', // Slight hover scale
                },
                borderColor: "#90caf9",  // Light blue border
                color: "#90caf9",        // Light blue text
                "&:hover": {
                  backgroundColor: "#90caf9",
                  color: "#121212",
                },
                borderRadius: "20px",
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              {category}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
