import React from 'react';
import { Typography, Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';

export default function AiInsights({ analysis }) {
  return (
    <Box sx={{ p: 3, bgcolor: '#000', borderRadius: 2 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        AI Insights
      </Typography>
      <ReactMarkdown>{analysis}</ReactMarkdown>
    </Box>
  );
}
