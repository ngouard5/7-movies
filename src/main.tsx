import { createRoot } from 'react-dom/client'
import React from 'react'
import { PostHogProvider } from 'posthog-js/react'
import posthog from 'posthog-js'
import App from './App.tsx'
import './index.css'
import { POSTHOG_KEY, POSTHOG_HOST } from './config/posthog'

// Initialize PostHog
if (POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false, // We'll handle this manually
    capture_exceptions: true,
    debug: window.location.hostname === 'localhost',
  })
}

const root = createRoot(document.getElementById("root")!)

root.render(
  <React.StrictMode>
    <PostHogProvider client={posthog}>
      <App />
    </PostHogProvider>
  </React.StrictMode>
)
