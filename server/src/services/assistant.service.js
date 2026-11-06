const fs = require('fs');
const path = require('path');

const PROFILE_PATH = path.resolve(__dirname, '../../data/profile.json');

let cachedProfile = null;

const getProfileData = () => {
  if (cachedProfile) return cachedProfile;
  try {
    const raw = fs.readFileSync(PROFILE_PATH, 'utf-8');
    cachedProfile = JSON.parse(raw);
    return cachedProfile;
  } catch (err) {
    console.error('Failed to load profile.json:', err);
    return null;
  }
};

const SYSTEM_PROMPT = (profile) => `
You are the interactive portfolio terminal assistant for Rithish S, a Backend Engineer and Computer Science & Engineering student.
You are embedded inside a retro-futuristic terminal interface on his portfolio website.

Here is Rithish's complete profile data:
${JSON.stringify(profile, null, 2)}

STRICT RESPONSE GUIDELINES:
1. Answer questions in natural language, formatted cleanly for a developer terminal.
2. LENGTH: SHORT to MEDIUM only (1 to 4 sentences, or a tight 2-4 item bulleted list). NEVER write long essay-like walls of text.
3. TONE: Confident, technical, sharp, and concise. No conversational filler like "Certainly! I'd be happy to tell you about...".
4. ACCURACY: Only state facts from the profile data above. Never fabricate skills, roles, or claims.
5. If the user asks for contact info, provide email (${profile?.email || 'rithishcodespace@gmail.com'}) and relevant links directly.
6. If the user asks something completely irrelevant to Rithish or software engineering, return a short terminal message: "Command not recognized. I can answer questions about Rithish's projects, distributed systems experience, skills, certifications, and background."
`.trim();

/**
 * Clean any model thought / reasoning tags (e.g. <think>...</think>)
 */
const cleanModelResponse = (text) => {
  if (!text) return '';
  // Remove <think>...</think> or reasoning tags if present
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  return cleaned;
};

/**
 * Offline keyword fallback when Groq is unreachable or fails
 */
const getFallbackResponse = (query, profile) => {
  const q = query.toLowerCase();

  if (q.includes('skill') || q.includes('stack') || q.includes('tech')) {
    return `Rithish specializes in Backend Engineering & Distributed Systems. Key skills include Node.js, TypeScript, Go/Python, Express, FastAPI, PostgreSQL, Redis, BullMQ, Docker, Kubernetes, AWS, and System Design.`;
  }
  if (q.includes('project') || q.includes('built')) {
    return `Key projects:
• Humming Tone (2026): Production e-commerce platform with RBAC & Redis caching.
• DB Backup CLI (2026): Automated multi-database backup utility with BullMQ queues & AWS S3.
• PatentIQ (2026): AI patent prior-art semantic search with vector embeddings.`;
  }
  if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('reach')) {
    return `Reach Rithish at:
• Email: ${profile?.email || 'rithishcodespace@gmail.com'}
• GitHub: ${profile?.links?.github || 'github.com/rithishcodespace'}
• LinkedIn: ${profile?.links?.linkedin || 'linkedin.com/in/rithish-saravanan-32a39431a'}`;
  }
  if (q.includes('eslint') || q.includes('open source') || q.includes('oss')) {
    return `Rithish is an ESLint Core Contributor (PR #21218), fixing false negatives in the 'no-loss-of-precision' rule by handling IEEE 754 float64 subnormal underflow.`;
  }
  if (q.includes('who') || q.includes('about') || q.includes('experience')) {
    return `Rithish S is a Backend Engineer & CSE student at Bannari Amman Institute of Technology (CGPA 8.29). Former Web Developer at Students Special Group, 1000+ LeetCode problems solved, and national hackathon winner.`;
  }
  if (q.includes('achievement') || q.includes('award') || q.includes('hackathon')) {
    return `Key achievements:
• 1000+ LeetCode DSA problems solved
• ESLint Core Contributor (PR #21218)
• 1st Place at IEEE DevSpark Hackathon
• 1st Place at BIT Hackathon`;
  }

  return `Rithish S is a Backend Engineer focusing on distributed systems, cloud architecture, and Node.js/TypeScript. Ask me about his projects, skills, achievements, or contact info.`;
};

/**
 * Core LLM assistant service method using Groq API
 */
const askAssistant = async (message, history = []) => {
  const profile = getProfileData();
  const apiKey = process.env.GROQ_API_KEY;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return {
      answer: 'Please provide a valid question or command.',
    };
  }

  const query = message.trim();

  // If no Groq API key is configured, fallback smoothly
  if (!apiKey) {
    console.warn('GROQ_API_KEY is not set. Using local profile fallback.');
    return {
      answer: getFallbackResponse(query, profile),
      source: 'offline_fallback',
    };
  }

  // Sanitize chat history (last 4 interactions to keep prompts compact)
  const safeHistory = Array.isArray(history)
    ? history
        .slice(-4)
        .filter((h) => h && (h.role === 'user' || h.role === 'assistant') && typeof h.content === 'string')
        .map((h) => ({ role: h.role, content: h.content.slice(0, 300) }))
    : [];

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT(profile) },
    ...safeHistory,
    { role: 'user', content: query },
  ];

  const preferredModel = process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';
  const fallbackModel = 'openai/gpt-oss-120b';

  const callGroq = async (model) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.4,
          max_completion_tokens: 350,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content || '';
      return cleanModelResponse(rawContent);
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  };

  try {
    let answer = await callGroq(preferredModel);
    if (!answer) {
      answer = await callGroq(fallbackModel);
    }
    return {
      answer: answer || getFallbackResponse(query, profile),
      source: 'groq',
    };
  } catch (err) {
    console.warn(`Groq request failed with ${preferredModel}, attempting fallback model...`, err.message);
    try {
      const fallbackAnswer = await callGroq(fallbackModel);
      return {
        answer: fallbackAnswer || getFallbackResponse(query, profile),
        source: 'groq_fallback',
      };
    } catch (fallbackErr) {
      console.error('All Groq calls failed. Using local fallback.', fallbackErr.message);
      return {
        answer: getFallbackResponse(query, profile),
        source: 'offline_fallback',
      };
    }
  }
};

module.exports = {
  askAssistant,
  getProfileData,
};

