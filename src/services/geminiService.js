import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error('REACT_APP_GEMINI_API_KEY is not defined');
}

const genAI = new GoogleGenerativeAI(API_KEY);

const fetchGitHubCode = async (githubUrl) => {
  try {
    // Extract owner, repo, and path from GitHub URL
    const urlParts = githubUrl
      .replace('https://github.com/', '')
      .replace('/blob/', '/')
      .split('/');
    
    const owner = urlParts[0];
    const repo = urlParts[1];
    const path = urlParts.slice(3).join('/');
    
    // Fetch raw content from GitHub
    const response = await fetch(
      `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch code from GitHub');
    }
    
    return await response.text();
  } catch (error) {
    throw new Error(`GitHub fetch failed: ${error.message}`);
  }
};

export const getCodeReview = async (input) => {
  if (!input) {
    throw new Error('No input provided for review');
  }

  try {
    // Check if input is a GitHub URL
    const isGithubUrl = input.startsWith('https://github.com/');
    const codeToReview = isGithubUrl ? await fetchGitHubCode(input) : input;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Review this code and provide:
      1. ⭐ Code quality 
      2. 🐞 Potential bugs 
      3. 🚀 Performance rating 
      4. 📏 Best practices rating 
      5. 💡 Improvements suggestions
      6. 📝 Improved code snippet

      ${isGithubUrl ? 'GitHub Source: ' + input : ''}
      Code to review:n
      ${codeToReview}`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error in code review:', error);
    throw new Error(`Failed to review code: ${error.message}`);
  }
};
     
  
 
