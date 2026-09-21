ShellAI
ShellAI is an AI-powered knowledge management platform that allows users to save, organize, understand, and rediscover useful information from the web — all directly through the web application.

Instead of using a browser extension, users interact with ShellAI entirely through its frontend. They can add content, manage their saved knowledge, generate AI-powered insights, organize information into collections, and explore relationships between their saved content from one centralized interface.

What It Does
1. Save Anything
Users can save useful web content directly through the ShellAI frontend.

The platform can be used to store:

Articles
Web pages
Tweets/posts
Videos
PDFs
Important links and notes
2. AI Enrichment
Whenever content is saved, ShellAI uses AI to analyze it and generate useful information such as:

Automatic summaries
Topic tags
Key topics
Important information from the content
This reduces the need for users to manually organize every saved item.

3. Knowledge Graph
ShellAI creates a visual representation of relationships between saved items.

Content that shares common topics can be connected in the knowledge graph, helping users discover relationships between different pieces of information.

4. Collections
Users can organize their saved content into collections based on their interests or requirements.

For example:

Artificial Intelligence
Programming
College
Research
Projects
Personal Learning
5. Highlights
Users can highlight important portions of saved content and store those highlights for future reference.

6. Memory Resurfacing
ShellAI helps users rediscover information they saved previously but may have forgotten.

Instead of allowing saved content to become a collection of unused links, ShellAI brings relevant knowledge back to the user.

Tech Stack
Frontend
React.js
D3.js
SCSS
The frontend provides the complete user interface and handles all user interactions.

Backend
Node.js
Express.js
MongoDB
The backend handles APIs, authentication, data management, and communication with the AI services.

AI
Mistral AI
Mistral AI is used for:

Content summarization
Topic extraction
Automatic tagging
AI-powered knowledge processing
Authentication
JWT
HTTP-only Cookies
Authentication is handled securely using JWT-based sessions stored through HTTP-only cookies.

Application Architecture
ShellAI follows a full-stack web application architecture:

                ┌─────────────────────┐
                │       User          │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │   React Frontend    │
                │                     │
                │ Dashboard           │
                │ Saves               │
                │ Collections         │
                │ Knowledge Graph     │
                │ Highlights          │
                └──────────┬──────────┘
                           │
                           │ API Requests
                           ▼
                ┌─────────────────────┐
                │ Node.js + Express   │
                │      Backend        │
                └──────┬───────┬──────┘
                       │       │
             ┌─────────┘       └──────────┐
             ▼                            ▼
    ┌─────────────────┐          ┌─────────────────┐
    │    MongoDB      │          │   Mistral AI    │
    │                 │          │                 │
    │ Users           │          │ Summaries       │
    │ Saves           │          │ Tags            │
    │ Collections     │          │ Topics          │
    │ Highlights      │          │ AI Analysis     │
    └─────────────────┘          └─────────────────┘

All functionality is accessed through the ShellAI web application.

Project Structure
ShellAI/
│
├── client/
│   ├── src/
│   │   └── features/
│   │       ├── auth/
│   │       ├── dashboard/
│   │       ├── saves/
│   │       ├── graph/
│   │       └── collections/
│   │
│   └── ...
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   │
│   └── ...
│
└── README.md

Getting Started
1. Clone the Repository
git clone <repository-url>
cd ShellAI

Backend Setup
Navigate to the server directory:

cd server

Install dependencies:

npm install

Create a .env file inside the server directory:

MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
MISTRAL_API_KEY=your_mistral_api_key
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_USER=your_email

Start the development server:

npm run dev

Frontend Setup
Open another terminal and navigate to the client directory:

cd client

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will normally be available at:

http://localhost:5173

Core Features
Feature	Description
Authentication	Secure user registration and login
Content Saving	Save web content directly through the application
AI Summarization	Generate summaries using Mistral AI
Automatic Tags	Generate relevant topic tags
Knowledge Graph	Visualize relationships between saved content
Collections	Organize saved content into groups
Highlights	Save important portions of content
Memory Resurfacing	Rediscover previously saved information
Data Flow
A typical content-saving workflow is:

User
  ↓
ShellAI Frontend
  ↓
Express API
  ↓
Content Processing
  ↓
Mistral AI
  ↓
Summary + Topics + Tags
  ↓
MongoDB
  ↓
ShellAI Dashboard

The processed information is then available to the user through the ShellAI frontend.

Security
ShellAI uses:

JWT-based authentication
HTTP-only cookies
Environment variables for API credentials
Backend API validation
Protected routes
Sensitive credentials such as database URLs, JWT secrets, and AI API keys should never be exposed in the frontend.

Future Scope
Potential future improvements include:

More advanced AI recommendations
Semantic search
Voice-based knowledge retrieval
Personalized knowledge feeds
Better knowledge-graph exploration
AI-powered question answering over saved content
Support for additional AI models
Conclusion
ShellAI aims to turn scattered information from the internet into an organized personal knowledge system.

Instead of simply bookmarking content and forgetting about it, users can save, understand, organize, connect, and rediscover their knowledge from one centralized platform.

Some content has been disabled in this document