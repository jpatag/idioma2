import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RssFeedRoundedIcon from '@mui/icons-material/RssFeedRounded';
import { useState, useEffect, useCallback } from 'react';
import LanguageProficiencyDropdown from './LanguageProficiencyDropdown';


function Author({ authors }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
        <AvatarGroup max={3}>
          {authors.map((author, index) => (
            <Avatar
              key={index}
              alt={author.name}
              src={author.avatar}
              sx={{ width: 24, height: 24 }}
            />
          ))}
        </AvatarGroup>
        <Typography variant="caption">
          {authors.map((author) => author.name).join(', ')}
        </Typography>
      </Box>
      <Typography variant="caption">July 14, 2021</Typography>
    </Box>
  );
}

Author.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export function Search() {
  return (
    <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
      <OutlinedInput
        size="small"
        id="search"
        placeholder="Search…"
        sx={{ flexGrow: 1 }}
        startAdornment={
          <InputAdornment position="start" sx={{ color: 'text.primary' }}>
            <SearchRoundedIcon fontSize="small" />
          </InputAdornment>
        }
        inputProps={{
          'aria-label': 'search',
        }}
      />
    </FormControl>
  );
}

const countryLangMap = {
  Spain: 'es',
  France: 'fr',
  Germany: 'de',
  USA: 'en',
};


export default function MainContent() {
  const [articles, setArticles] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('Spain'); // default country
  const [selectedProficiency, setSelectedProficiency] = useState('simple'); // default proficiency
  const [loading, setLoading] = useState(false);

  // Map country names to language codes, e.g., Germany -> "de"
  // Fetch articles based on the selected country
  const fetchArticles = useCallback(async (country) => {
    setLoading(true);
    try {
      const lang = countryLangMap[country] || 'en';
      const response = await fetch(`/api/news?query=${country}&language=${lang}`);
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array here since countryLangMap is constant

  // Fetch articles when the selected country changes
  useEffect(() => {
    fetchArticles(selectedCountry);
  }, [selectedCountry, fetchArticles]);

  // Handler for country chip click
  const handleCountryChange = (country) => {
    setSelectedCountry(country);
  };

  // Handler for proficiency dropdown change
  const handleProficiencyChange = (event) => {
    setSelectedProficiency(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography variant="h1" gutterBottom>
        Welcome to Idioma!
      </Typography>
      <Box
        sx={{
          display: { xs: 'flex', sm: 'none' },
          flexDirection: 'row',
          gap: 1,
          width: { xs: '100%', md: 'fit-content' },
          overflow: 'auto',
        }}
      >
        <Search />
        <IconButton size="small" aria-label="RSS feed">
          <RssFeedRoundedIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', md: 'row' },
          width: '100%',
          justifyContent: 'space-between',
          alignItems: { xs: 'start', md: 'center' },
          gap: 4,
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            flexDirection: 'row',
            gap: 3,
            overflow: 'auto',
          }}
        >
          {Object.keys(countryLangMap).map((country) => (
            <Chip
              key={country}
              label={country}
              onClick={() => handleCountryChange(country)}
              variant={selectedCountry === country ? 'filled' : 'outlined'}
              size="medium"
            />
          ))}
          {/* Pass value and onChange handler to the dropdown */}
          <LanguageProficiencyDropdown
            value={selectedProficiency}
            onChange={handleProficiencyChange}
          />
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'row',
            gap: 1,
            width: { xs: '100%', md: 'fit-content' },
            overflow: 'auto',
          }}
        >
          <Search />
          <IconButton size="small" aria-label="RSS feed">
            <RssFeedRoundedIcon />
          </IconButton>
        </Box>
      </Box>
      {loading ? (
        <Typography>Loading articles...</Typography>
      ) : (
<Grid container spacing={4} columns = {12} /* spacing can be adjusted */>
  {articles.map((article, index) => (
    <Grid size={{ xs: 12, md: 6 }} key={index}>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // Optional: ensure cards stretch to the same height in a row
          height: '100%',
          cursor: 'pointer',
        }}
        onClick={() =>
          window.location.assign(
            `/article?url=${encodeURIComponent(article.url)}&image=${encodeURIComponent(article.urlToImage)}&title=${encodeURIComponent(article.title)}&language=${encodeURIComponent(selectedCountry)}&level=${encodeURIComponent(selectedProficiency)}`
          )
        }
    
      >
        {/* Large image area */}
        {article.urlToImage && (
          <CardMedia
            component="img"
            image={article.urlToImage}
            alt={article.title}
            sx={{
              width: '100%',
              height: 400,      // Adjust as desired
              objectFit: 'cover',
            }}
          />
        )}
        {/* Text content */}
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {article.source?.name || ''}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            {article.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {article.description}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>

      )}
    </Box>
  );
}
