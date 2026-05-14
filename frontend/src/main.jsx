import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { Provider } from './components/ui/provider.jsx'

import {
  ClerkProvider
} from '@clerk/clerk-react'
import { Toaster } from './components/ui/toaster.jsx'

const clerkPubKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

ReactDOM.createRoot(
  document.getElementById('root')
).render(

  <ClerkProvider publishableKey={clerkPubKey}>
    <AuthProvider>
      <Provider>
        <Toaster />
        <App />
      </Provider>
    </AuthProvider>
  </ClerkProvider>

)