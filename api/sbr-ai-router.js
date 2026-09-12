/**
 * 🧠 SBR SUPER-APP — SECURE SERVERLESS AI ROUTING API
 * Handles secure communication with OpenAI, Gemini, and Anthropic
 * Fixed: All API endpoints, response parsing, error handling
 */

export default async function handler(req, res) {
    // ========================================================================
    // SECURITY: Only POST allowed
    // ========================================================================
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            error: 'Method Not Allowed',
            details: 'Use POST method only'
        });
    }

    const { engine, prompt } = req.body;

    // ========================================================================
    // VALIDATION: Check required fields
    // ========================================================================
    if (!engine) {
        return res.status(400).json({ error: 'Engine parameter required' });
    }
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        // ====================================================================
        // 1️⃣ SBR AQL - ISLAMIC KNOWLEDGE (OpenAI GPT-4o)
        // ====================================================================
        if (engine === 'openai') {
            const apiKey = process.env.OPENAI_API_KEY;
            if (!apiKey) {
                return res.status(500).json({ 
                    error: 'OpenAI API Key missing',
                    engine: 'SBR Aql'
                });
            }

            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o',
                        messages: [
                            {
                                role: 'system',
                                content: 'You are SBR Aql, an Islamic knowledge assistant. Provide verified academic knowledge based on Quran, Hadith, and scholarly consensus. Always cite sources and mention if something requires scholarly verification.'
                            },
                            {
                                role: 'user',
                                content: prompt
                            }
                        ],
                        temperature: 0.7,
                        max_tokens: 1500
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    return res.status(response.status).json({
                        error: 'OpenAI API Error',
                        details: errorData.error?.message || 'Unknown error'
                    });
                }

                const data = await response.json();

                // ✅ FIXED: Correct response parsing
                if (!data.choices || data.choices.length === 0) {
                    return res.status(500).json({
                        error: 'Invalid response from OpenAI',
                        details: 'No choices in response'
                    });
                }

                return res.status(200).json({
                    success: true,
                    engine: 'SBR Aql (OpenAI GPT-4o)',
                    text: data.choices[0].message.content,
                    tokens: data.usage.total_tokens,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                console.error('OpenAI Error:', error);
                return res.status(500).json({
                    error: 'OpenAI Connection Error',
                    details: error.message
                });
            }
        }

        // ====================================================================
        // 2️⃣ SBR SAFAR - LOCATION INTELLIGENCE (Google Gemini)
        // ====================================================================
        else if (engine === 'gemini') {
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                return res.status(500).json({
                    error: 'Gemini API Key missing',
                    engine: 'SBR Safar'
                });
            }

            try {
                // ✅ FIXED: Correct Gemini API endpoint
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [
                                {
                                    parts: [
                                        { text: prompt }
                                    ]
                                }
                            ],
                            generationConfig: {
                                temperature: 0.7,
                                maxOutputTokens: 1500
                            }
                        })
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    return res.status(response.status).json({
                        error: 'Gemini API Error',
                        details: errorData.error?.message || 'Unknown error'
                    });
                }

                const data = await response.json();

                // ✅ FIXED: Correct response structure
                if (!data.candidates || data.candidates.length === 0) {
                    return res.status(500).json({
                        error: 'Invalid response from Gemini',
                        details: 'No candidates in response'
                    });
                }

                const candidateContent = data.candidates[0].content;
                if (!candidateContent.parts || candidateContent.parts.length === 0) {
                    return res.status(500).json({
                        error: 'Invalid response structure from Gemini',
                        details: 'No parts in content'
                    });
                }

                return res.status(200).json({
                    success: true,
                    engine: 'SBR Safar (Google Gemini 2.5)',
                    text: candidateContent.parts[0].text,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                console.error('Gemini Error:', error);
                return res.status(500).json({
                    error: 'Gemini Connection Error',
                    details: error.message
                });
            }
        }

        // ====================================================================
        // 3️⃣ SBR QALAM - SMART WRITING (Anthropic Claude)
        // ====================================================================
        else if (engine === 'anthropic') {
            const apiKey = process.env.ANTHROPIC_API_KEY;
            if (!apiKey) {
                return res.status(500).json({
                    error: 'Anthropic API Key missing',
                    engine: 'SBR Qalam'
                });
            }

            try {
                // ✅ FIXED: Correct Anthropic API endpoint
                const response = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                        'x-api-key': apiKey,
                        'anthropic-version': '2023-06-01',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'claude-3-5-sonnet-20241022',
                        max_tokens: 1500,
                        system: 'You are SBR Qalam, an advanced writing assistant. Help with text refinement, content polishing, journaling, and creative writing with Islamic perspectives.',
                        messages: [
                            {
                                role: 'user',
                                content: prompt
                            }
                        ]
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    return res.status(response.status).json({
                        error: 'Anthropic API Error',
                        details: errorData.error?.message || 'Unknown error'
                    });
                }

                const data = await response.json();

                // ✅ FIXED: Correct response parsing
                if (!data.content || data.content.length === 0) {
                    return res.status(500).json({
                        error: 'Invalid response from Anthropic',
                        details: 'No content in response'
                    });
                }

                return res.status(200).json({
                    success: true,
                    engine: 'SBR Qalam (Anthropic Claude 3.5)',
                    text: data.content[0].text,
                    tokens: data.usage.output_tokens,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                console.error('Anthropic Error:', error);
                return res.status(500).json({
                    error: 'Anthropic Connection Error',
                    details: error.message
                });
            }
        }

        // ====================================================================
        // INVALID ENGINE
        // ====================================================================
        else {
            return res.status(400).json({
                error: 'Invalid AI Engine specified',
                supportedEngines: ['openai', 'gemini', 'anthropic'],
                received: engine
            });
        }

    } catch (error) {
        console.error('Backend Router Error:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
}
