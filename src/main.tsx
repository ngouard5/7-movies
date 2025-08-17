import { createRoot } from 'react-dom/client'
import React from 'react'
import { PostHogProvider } from 'posthog-js/react'
import App from './App.tsx'
import './index.css'

const root = createRoot(document.getElementById("root")!)

root.render(
  <React.StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={{
        api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
        defaults: '2025-05-24',
        capture_exceptions: true, // This enables capturing exceptions using Error Tracking, set to false if you don't want this
        debug: import.meta.env.MODE === "production",
      }}
    >
      <App />
    </PostHogProvider>
  </React.StrictMode>
)
