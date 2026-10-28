PlacementPro – Placement Prediction & Career Analytics System
Overview

PlacementPro is a full-stack web application designed to analyze student academic and technical profiles and estimate placement probability.

The system combines structured scoring logic with AI-generated feedback to provide actionable recommendations for improving employability.

This project was developed as an academic engineering system integrating frontend development, backend API design, and AI-based analysis.

Problem Statement

Campus placement preparation often lacks structured, data-driven evaluation. Students typically do not have a quantified understanding of:

Their current placement readiness

Key areas requiring improvement

Comparative profile strength

PlacementPro addresses this gap by converting academic and skill-based inputs into measurable probability outputs and structured recommendations.

System Architecture

The application follows a modular full-stack architecture:

Frontend

React (TypeScript)

Vite

Tailwind CSS

Component-based UI design

SVG-based probability visualization

Backend

Node.js

Express.js

REST API structure

Environment-based API key management

AI Integration

Google Gemini API

Structured JSON response generation

Categorized improvement recommendations

Data Handling

LocalStorage-based profile persistence

Modular scoring engine

Historical prediction tracking

Core Features

Profile-based placement probability prediction

Dynamic circular probability visualization

AI-generated structured feedback

Tier classification (Platinum / Elite / Growth)

Profile management system

Dark/Light theme support

Historical prediction tracking

Technical Highlights

Custom probability calculation engine

SVG-based animated progress ring

Gradient-based stroke visualization

Modular state management

Clean routing with React Router

Environment variable handling for secure API usage

Installation & Setup
Prerequisites

Node.js (v18+ recommended)

Steps

Clone the repository

Install dependencies:

npm install


Create a .env file:

GEMINI_API_KEY=your_api_key_here


Start frontend:

npm run dev


Start backend:

node server/index.mjs

Academic Value

This project demonstrates:

Full-stack web development

API integration

Client-server communication

State persistence

UI/UX design with responsive architecture

Applied AI usage in decision support systems

Future Improvements

Replace LocalStorage with database (MongoDB/PostgreSQL)

Add authentication system (JWT)

Deploy backend on cloud platform

Add model-based statistical scoring refinement

Add recruiter dashboard view