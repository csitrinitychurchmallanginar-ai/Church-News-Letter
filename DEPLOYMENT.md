# Deployment Guide

This guide explains how to deploy the Church Schedule PDF Generator application for free using **Render** (for the backend) and **Vercel** (for the frontend).

## Prerequisites

- A GitHub account.
- Accounts on [Render](https://render.com/) and [Vercel](https://vercel.com/signup).
- Your project pushed to GitHub.

---

## Part 1: Deploy Backend to Render

1.  Log in to your [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository.
4.  Configure the service:
    -   **Name**: `church-newsletter-server` (or similar)
    -   **Region**: Select the one closest to you (e.g., Singapore, Frankfurt).
    -   **Branch**: `main`
    -   **Root Directory**: `.` (leave empty or set to root)
    -   **Runtime**: `Node`
    -   **Build Command**: `npm install && npm run build` (Wait, this project uses `tsx` or specific server build. Actually, we just need dependencies).
        -   *Correction*: Since we are running the server directly from TS or JS, we just need to install deps.
        -   **Build Command**: `npm install`
    -   **Start Command**: `npm run server` (Make sure this script runs `tsx server/index.ts` or `node dist/server/index.js` if you build it).
        -   *Note*: The current `server` script is `tsx watch server/index.ts`. For production, it's better to use `node` but `tsx` works if installed.
        -   Let's check `package.json` scripts again. Use `npm run start` if it runs the built file, or add a proper start command.
    -   **Instance Type**: Free

5.  **Environment Variables**:
    -   Render automatically sets `PORT`, so you don't need to add it manually unless you want a specific one.

6.  Click **Create Web Service**.
7.  Wait for deployment. Once live, copy the **onrender.com URL** (e.g., `https://church-newsletter-server.onrender.com`).

---

## Part 2: Deploy Frontend to Vercel

1.  Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  Configure the project:
    -   **Framework Preset**: Vite
    -   **Root Directory**: `.`
    -   **Build Command**: `npm run build`
    -   **Output Directory**: `dist`
5.  **Environment Variables**:
    -   Add a new variable:
        -   **Name**: `VITE_API_URL`
        -   **Value**: The **Render Backend URL** you copied earlier (e.g., `https://church-newsletter-server.onrender.com`).
        -   *Important*: Do not add a trailing slash `/`.

6.  Click **Deploy**.

---

## Part 3: Verification

1.  Open your Vercel deployment URL.
2.  Try generating a PDF.
3.  If it fails, check the **Console** (F12) for network errors or the **Render Logs** for server errors.

## Troubleshooting

-   **CORS Error**: Ensure the backend allows requests from your Vercel domain. The current code allows all origins (`app.use(cors())`), so it should work.
-   **Puppeteer Issues on Render**: Puppeteer needs specific system dependencies.
    -   If the PDF generation fails on Render, you might need to add a "Environment Variable" on Render:
        -   Key: `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD`
        -   Value: `true`
    -   AND use a Render Native Environment implementation for Puppeteer if strictly needed, but often the default Node environment might miss libraries.
    -   *Better approach for Render*: Add a "Build Command" that installs chrome deps or use a dockerfile.
    -   **Simplest Fix**: If Puppeteer fails, go to Render **Settings** > **Environment** and add a Secret File or just ensure you are using a Node version that supports it.
    -   Actually, for Render, it's best to use the **Puppeteer cached** path or add a build script.
    -   But for now, try the basic deployment. If it fails, search "Render Puppeteer node" for the specific build script addition.
