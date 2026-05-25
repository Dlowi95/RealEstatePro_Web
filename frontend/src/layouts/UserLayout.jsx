import ChatbotWidget from '@/components/users/ChatbotWidget'
import Navbar from '@/components/users/Navbar'
import React from 'react'
import Footer from '@/components/users/Footer'

const UserLayout = ({ children }) => {
  return (
    <>
      <Navbar />

      <main>
        {children}
      </main>

      <ChatbotWidget />
      <Footer />
    </>
  )
}

export default UserLayout