import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { Provider } from './components/ui/provider.jsx'
import { Toaster } from './components/ui/toaster.jsx'
import { useColorMode } from './components/ui/color-mode.jsx'

import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function ClerkThemeSync() {
  const { colorMode } = useColorMode()

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={{
        baseTheme: colorMode === 'dark' ? dark : undefined,
        variables: {
          colorPrimary: '#E65C00',
          colorBackground: colorMode === 'dark' ? '#111827' : '#ffffff',
          colorInputBackground: colorMode === 'dark' ? '#0f172a' : '#ffffff',
          colorNeutral: colorMode === 'dark' ? '#e5e7eb' : '#111827',
          colorText: colorMode === 'dark' ? '#f8fafc' : '#111827',
        },
      }}
    >
      <AuthProvider>
        <Provider>
          <Toaster />
          <App />
        </Provider>
      </AuthProvider>
    </ClerkProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<ClerkThemeSync />)