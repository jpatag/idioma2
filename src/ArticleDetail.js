import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppAppBar from './components/AppAppBar';
import AppTheme from './shared-theme/AppTheme';
import CssBaseline from '@mui/material/CssBaseline';

export default function ArticleDetail(props) {
  const [searchParams] = useSearchParams();
  const articleUrl = searchParams.get('url');
  const articleImage = searchParams.get('image');
  const title = searchParams.get('title');
  const language = searchParams.get('language');
  const selectedLevel = searchParams.get('level');

  const [simplifiedText, setSimplifiedText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const simplifyArticle = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/simplify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: articleUrl,
            target_language: language,
            level: selectedLevel,
          }),
        });
        const data = await response.json();
        setSimplifiedText(data.simplified_text);
      } catch (error) {
        console.error('Error simplifying article:', error);
      } finally {
        setLoading(false);
      }
    };

    if (articleUrl) {
      simplifyArticle();
    }
  }, [articleUrl, language, selectedLevel]);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <AppAppBar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '40px',
        }}
      ></Box>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Back button */}
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => window.history.back()}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Card sx={{ overflow: 'hidden' }}>
            {articleImage && (
              <CardMedia
                component="img"
                image={articleImage}
                alt="Article Image"
                sx={{
                  height: { xs: 200, sm: 300 },
                  objectFit: 'cover',
                }}
              />
            )}
            <CardContent sx={{ px: { xs: 2, sm: 4 }, py: { xs: 3, sm: 4 } }}>
              {title && (
                <Typography variant="h4" gutterBottom>
                  {title}
                </Typography>
              )}
              <Typography
                variant="body1"
                sx={{
                  textAlign: 'justify',
                  lineHeight: 1.6,
                }}
              >
                {simplifiedText}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    </AppTheme>
  );
}
