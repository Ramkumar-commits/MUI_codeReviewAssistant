import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Paper, 
  CircularProgress, 
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  ThemeProvider,
  createTheme,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  styled
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { purple, pink } from '@mui/material/colors';
import { getCodeReview } from '../services/geminiService';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(45deg, #1a237e 30%, #311b92 90%)'
    : 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
}));

const RainbowButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  margin: theme.spacing(2),
  '&:hover': {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  },
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: '-webkit-linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(3),
  textAlign: 'center',
  fontSize: '2.5rem',
}));

const CodeReviewForm = () => {
  const [inputType, setInputType] = useState('github');
  const [githubUrl, setGithubUrl] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: purple,
      secondary: pink,
    },
  });

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  const handleInputTypeChange = (event, newType) => {
    if (newType !== null) {
      setInputType(newType);
      setReview('');
    }
  };

  const handleSubmit = async () => {
    const input = inputType === 'github' ? githubUrl : codeSnippet;
    
    if (!input.trim()) {
      setSnackbarMessage(inputType === 'github' ? 'Please give a GitHub URL' : 'Please enter code to review');
      setSnackbarOpen(true);
      return;
    }

    if (inputType === 'github' && !input.startsWith('https://github.com/')) {
      setSnackbarMessage('Please enter a valid GitHub URL');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      const categorizedResponse = await getCodeReview(input);
      console.log('Categorized Response:', categorizedResponse); // Debugging statement
      setReview(categorizedResponse);
    } catch (error) {
      console.error('Error:', error);
      setReview('Error getting code review');
    }
    setLoading(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
        <StyledPaper elevation={3}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Tooltip title={darkMode ? "Light mode" : "Dark mode"}>
              <IconButton onClick={handleThemeChange} color="inherit">
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
          </Box>
          
          <StyledTitle variant="h1">
            Code Review AI
          </StyledTitle>

          <ToggleButtonGroup
            value={inputType}
            exclusive
            onChange={handleInputTypeChange}
            sx={{ mb: 2 }}
          >
            <ToggleButton value="github">GitHub URL</ToggleButton>
            <ToggleButton value="direct">Code Snippet</ToggleButton>
          </ToggleButtonGroup>

          {inputType === 'github' ? (
            <TextField
              fullWidth
              label="GitHub URL"
              placeholder="https://github.com/username/repo/blob/main/path/to/file"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              sx={{ mb: 2 }}
            />
          ) : (
            <TextField
              fullWidth
              multiline
              rows={10}
              label="Code to Review"
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}

          <RainbowButton
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            fullWidth
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Review Code'
            )}
          </RainbowButton>

          {review && (
            <Typography
              variant="body1"
              component="pre"
              sx={{ whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}
            >
              {review}
            </Typography>
          )}

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </StyledPaper>
      </Box>
    </ThemeProvider>
  );
};

export default CodeReviewForm;
