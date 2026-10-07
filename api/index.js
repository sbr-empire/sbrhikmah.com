// =====================================================================
// SBR SUPER-APP BACKEND - CLOUD RUN ENTRY POINT
// =====================================================================
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5173;

// Middleware
app.use(cors());
app.use(express.json());

// =====================================================================
// HEALTH CHECK ENDPOINT (required by Cloud Run)
// =====================================================================
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'sbr-super-app-backend' });
});

// =====================================================================
// CHAT API ENDPOINT (placeholder)
// =====================================================================
app.post('/api/chat', async (req, res) => {
  try {
    const { message, model = 'gemini' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // TODO: Implement AI chat routing (Gemini, OpenAI, Claude, etc.)
    res.json({
      success: true,
      message: 'Chat endpoint ready for implementation',
      received: message,
      model
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================================================
// ERROR HANDLING
// =====================================================================
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ SBR Super-App Backend running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`💬 Chat API: POST http://localhost:${PORT}/api/chat`);
});

module.exports = app;
