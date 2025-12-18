# Deployment Guide

This guide explains how to deploy the Church Schedule PDF Generator application for free.

**Strategy:**
- **Backend**: Render (using Docker). We use Docker because the PDF generator needs specific system files that the standard Node environment doesn't have.
- **Frontend**: Vercel (easiest for Vite apps).

## Part 1: Deploy Backend to Render

1.  Log in to your [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository.
4.  Configure the service:
    -   **Name**: `church-news-server`
    -   **Runtime/Language**: **Docker** (Important! Do not select Node).
    -   **Region**: Singapore (or nearest).
    -   **Branch**: `main`
    -   **Instance Type**: Free
5.  **Environment Variables**:
    -   Render handles the PORT automatically.
    -   No special variables needed for now.
6.  Click **Create Web Service**.
7.  Wait for the build to finish. It will take a few minutes to download the Docker image.
8.  Once deployed, copy the URL (e.g., `https://church-news-server.onrender.com`).

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
        -   **Value**: The **Render Backend URL** you copied earlier (e.g., `https://church-news-server.onrender.com`).
        -   *Important*: Do not add a trailing slash `/`.
6.  Click **Deploy**.
