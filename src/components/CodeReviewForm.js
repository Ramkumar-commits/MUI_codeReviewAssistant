import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Paper, 
  CircularProgress, 
  Typography,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { getCodeReview } from '../services/geminiService';

const CodeReviewForm = () => {
  const [inputType, setInputType] = useState('github');
  const [githubUrl, setGithubUrl] = useState('');
  const [directCode, setDirectCode] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputTypeChange = (event, newType) => {
    if (newType !== null) {
      setInputType(newType);
      setReview('');
    }
  };

  const handleSubmit = async () => {
    const input = inputType === 'github' ? githubUrl : directCode;
    
    if (inputType === 'github' && !input.startsWith('https://github.com/')) {
      setReview('Please enter a valid GitHub URL');
      return;
    }

    if (!input.trim()) {
      setReview('Please enter code to review');
      return;
    }

    setLoading(true);
    try {
      const result = await getCodeReview(input);
      setReview(result);
    } catch (error) {
      console.error('Error:', error);
      setReview('Error getting code review');
    }
    setLoading(false);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <ToggleButtonGroup
        value={inputType}
        exclusive
        onChange={handleInputTypeChange}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="github">GitHub URL</ToggleButton>
        <ToggleButton value="direct">Direct Code</ToggleButton>
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
          value={directCode}
          onChange={(e) => setDirectCode(e.target.value)}
          sx={{ mb: 2 }}
        />
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Review Code'}
      </Button>

      {review && (
        <Typography
          variant="body1"
          component="pre"
          sx={{ whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}
        >
          {review}
        </Typography>
      )}
    </Paper>
  );
};

export default CodeReviewForm;
