

const express = require('express');
const { google } = require('googleapis');

const app = express();
const port = 3000;

// Set up OAuth2 credentials
const oAuth2Client = new google.auth.OAuth2(
  '965384561845-fbicc5vsgbklo1llaiq3pvlq6oals6o3.apps.googleusercontent.com',
  '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',
  'http://localhost:3000/oauth2callback'
);

// Generate the authorization URL
const scopes = ['https://www.googleapis.com/auth/gmail.send'];
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

// Route handler for the authorization URL
app.get('/auth', (req, res) => {
  res.redirect(authUrl);
});

// Route handler for the callback URL
app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange authorization code for tokens
    const { tokens } = await oAuth2Client.getToken(code);
    const { refresh_token, access_token } = tokens;

    // Store the tokens securely for future use
    console.log('Refresh Token:', refresh_token);
    console.log('Access Token:', access_token);

    res.send('Authentication successful!');
  } catch (error) {
    console.error('Authentication error:', error);
    res.send('Authentication failed!');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
