import ChatbotWidget from '@/components/users/ChatbotWidget'
import Navbar from '@/components/users/Navbar'
import React from 'react'

const UserLayout = ({ children }) => {
  return (
    <>
      <Navbar />

      <main>
        {children}
      </main>

      <ChatbotWidget />
    </>
  )
}

export default UserLayout