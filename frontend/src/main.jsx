import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

import {
  ClerkProvider
} from '@clerk/clerk-react'

const clerkPubKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

ReactDOM.createRoot(
  document.getElementById('root')
).render(

  <ClerkProvider publishableKey={clerkPubKey}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ClerkProvider>

)