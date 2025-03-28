import * as React from 'react';
import Box from '@mui/material/Box';
import idiomaLogo from '../idioma.png'; // adjust the path as needed

export default function SitemarkIcon() {
  return (
    <Box sx={{ height: 50, width: 200, mr: 2 }}>
      <img
        src={idiomaLogo}
        alt="Idioma Logo"
        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
      />
    </Box>
  );
}
