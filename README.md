# Carbon Footprint Estimation 🌱

A full-stack web application designed to estimate CO2 emissions and provide actionable recommendations using Machine Learning. The project features a modern, responsive frontend built with Next.js and a FastAPI backend to serve the ML prediction models.

## 🚀 Features

* **ML-Based Predictions:** Calculates estimated carbon footprints based on user inputs.
* **Smart Recommendations:** Suggests personalized ways to reduce CO2 emissions.
* **Modern Dashboard UI:** A sleek, responsive dashboard (dark-mode ready) to visualize data.
* **API Integration:** Seamless communication between the React frontend and Python backend.

## 💻 Tech Stack

**Frontend:**
* [Next.js](https://nextjs.org/) (App Router)
* React & TypeScript
* Tailwind CSS (Styling)
* [shadcn/ui](https://ui.shadcn.com/) (UI Components)
* pnpm (Package Manager)

**Backend:**
* [FastAPI](https://fastapi.tiangolo.com/) (API Framework)
* Python (Machine Learning & Data Processing)

**Deployment:**
* [Vercel](https://vercel.com) (Frontend & Serverless Functions)

## 📁 Project Structure

```text
CarbonFootprintEstimation/
├── api/                # FastAPI backend and ML models
├── app/                # Next.js App Router (Pages & Layouts)
├── components/         # Reusable React/UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── public/             # Static assets (images, icons)
├── styles/             # Global CSS and Tailwind styles
├── components.json     # UI component configuration
├── next.config.mjs     # Next.js configuration
├── tailwind.config.ts  # Tailwind CSS configuration
└── vercel.json         # Vercel deployment configuration
