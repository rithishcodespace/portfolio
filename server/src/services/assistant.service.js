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
You are the interactive portfolio terminal for Rithish S, a Backend Engineer and Computer Science & Engineering student.
You respond directly as terminal standard output (stdout).

Profile Information:
${JSON.stringify(profile, null, 2)}

STRICT TERMINAL STDOUT FORMATTING RULES:
1. Always format responses as clean, structured terminal stdout. Never act like a chatty bot or conversational assistant.
2. NO conversational greetings or pleasantries (never say "Hi!", "Sure!", "I'd be happy to help", "Here is information..."). Start directly with the title or output.
3. STRUCTURE & FORMATTING:
   - For a specific project or topic, write the name and underline it with dashes:
     AskDB
     -----
   - Use clean, indented sections with 2 spaces (e.g. "Tech stack:", "Key features:", "Summary:"):
     Tech stack:
       Node.js      TypeScript
       PostgreSQL   Redis
     Key features:
       - Feature one
       - Feature two
   - Keep answers readable, clean, and concise (short to medium, typically 5-12 lines of structured terminal stdout).
4. ACCURACY: Only use verified facts from the profile data. Never invent technologies or claims.
5. If asked for contact details, format as:
Contact Information
-------------------
Email:    ${profile?.email || 'rithishcodespace@gmail.com'}
Phone:    ${profile?.phone || '+91 9952252304'}
GitHub:   ${profile?.links?.github || 'https://github.com/rithishcodespace'}
LinkedIn: ${profile?.links?.linkedin || 'https://www.linkedin.com/in/rithish-saravanan-32a39431a/'}
LeetCode: ${profile?.links?.leetcode || 'https://leetcode.com/u/rithishcodespace'}
6. If asked an unrelated question outside of Rithish or computer science, output:
Command not recognized.
Available topics: projects, backend experience, skills, achievements, education, contact.
`.trim();

/**
 * Clean any model thought / reasoning tags (e.g. <think>...</think>)
 */
const cleanModelResponse = (text) => {
  if (!text) return '';
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  return cleaned;
};

/**
 * Offline keyword fallback when Groq is unreachable or fails
 */
const getFallbackResponse = (query, profile) => {
  const q = query.toLowerCase();

  if (q.includes('skill') || q.includes('stack') || q.includes('tech')) {
    return `Technical Stack
---------------
Backend & Core:
  Node.js, TypeScript, Express.js, FastAPI, Python, REST APIs

Distributed Systems & Databases:
  Redis, BullMQ, PostgreSQL, MySQL, MongoDB, System Design

Cloud & DevOps:
  AWS EC2/S3, Docker, Kubernetes, Helm, GitHub Actions, Prometheus`;
  }
  if (q.includes('ragforge') || q.includes('rag')) {
    return `RAGForge
--------
Production-style full-stack Retrieval-Augmented Generation application.

Key features:
  - Hybrid search: BM25 sparse keyword matching + sentence-transformers dense search
  - Cross-encoder BGE re-ranking for maximum context precision
  - Session-isolated document stores and query tracking without login
  - Citation-aware answers with benchmark evaluation (MRR, Recall@k, NDCG)

Tech stack:
  FastAPI      Python       LangChain
  ChromaDB     Groq LLM     React + Vite
  Pytest       BM25         BGE Reranker

Live Demo: https://ragforge.rithish.site
Repo:      https://github.com/rithishcodespace/RAGForge`;
  }
  if (q.includes('project') || q.includes('built')) {
    return `Featured Projects
-----------------
RAGForge (2026)
  Production-style full-stack RAG app with hybrid search & BGE reranker.
  Tech: FastAPI, Python, LangChain, ChromaDB, React, Groq LLM
  Live: https://ragforge.rithish.site
  Repo: https://github.com/rithishcodespace/RAGForge

DB Backup CLI (2026)
  Cross-platform CLI tool for automated multi-database backups.
  Tech: TypeScript, Redis, BullMQ, AWS S3, Docker
  Repo: https://github.com/rithishcodespace/db-backup-cli

Humming Tone (2026)
  Production e-commerce platform with RBAC & Redis caching.
  Tech: Node.js, TypeScript, PostgreSQL, Redis, Docker, AWS

AskDB (2026)
  AI natural-language database assistant via MCP and LangGraph.
  Tech: Python, LangGraph, MCP, SQLAlchemy
  Repo: https://github.com/rithishcodespace/AskDB`;
  }
  if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('reach')) {
    return `Contact Information
-------------------
Email:    ${profile?.email || 'rithishcodespace@gmail.com'}
GitHub:   ${profile?.links?.github || 'https://github.com/rithishcodespace'}
LinkedIn: ${profile?.links?.linkedin || 'https://www.linkedin.com/in/rithish-saravanan-32a39431a/'}
LeetCode: ${profile?.links?.leetcode || 'https://leetcode.com/u/rithishcodespace'}`;
  }
  if (q.includes('eslint') || q.includes('open source') || q.includes('oss')) {
    return `ESLint Core Contribution (PR #21218)
------------------------------------
Fixed false negatives in ESLint's 'no-loss-of-precision' rule
by handling IEEE 754 float64 underflow to 0/-0 for subnormal numeric literals.
PR: https://github.com/eslint/eslint/pull/21218`;
  }
  if (q.includes('experience') || q.includes('work') || q.includes('job')) {
    return `Web Developer | Students Special Group (Feb 2025 - Dec 2025)
-----------------------------------------------------------
- Developed backend services using Node.js and MySQL for core platform.
- Designed normalized database schemas to improve scalability and data integrity.
- Implemented secure RESTful APIs for authentication and user workflows.
- Mentored 50+ students in backend development and software engineering.`;
  }
  if (q.includes('odoo')) {
    return `Odoo x NMIT Bangalore Hackathon 2026
-----------------------------------
Award:       Winner / 1st Runner-Up (₹35,000 cash prize)
Event:       National Level Enterprise Hackathon
Organizers:  Odoo in partnership with NMIT Bangalore & DataWiz
Team:        Deepak, Thirumurugam, Rithish, Hemanth`;
  }
  if (q.includes('achievement') || q.includes('award') || q.includes('hackathon') || q.includes('leetcode')) {
    return `Achievements & Honors
---------------------
- Winner / 1st Runner-Up: Odoo x NMIT Bangalore Hackathon 2026 (₹35,000 cash prize)
- 1250+ DSA problems solved on LeetCode (Rating 1618, 500 Days Badge, 365-day streak)
- ESLint Core Contributor (Merged PR #21218)
- 1st Place: IEEE DevSpark National Hackathon (₹10,000 cash prize)
- 1st Place: BIT Hackathon (₹3,000 cash prize)
- Runner-up: SNS Ideathon (₹10,000 cash prize)
- 1st Place: Code With Curious`;
  }

  return `Rithish S | Backend Engineer & CSE Student
------------------------------------------
Specializing in Node.js, TypeScript, distributed systems, and cloud architecture.
Try asking:
- What projects has Rithish built?
- What is his backend experience?
- What are his achievements?
- What technologies does he use?`;
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

