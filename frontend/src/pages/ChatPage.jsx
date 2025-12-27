import React from 'react'
import { useAuthStore } from '../store/useAuthStore'

const ChatPage = () => {
  const {logout} = useAuthStore();

  return (
    <div className='z-10'>
      ChatPage
      <button onClick={logout} className='text-red-500 font-bold p-4 m-4 cursor-pointer'>LogOut</button>
    </div> 
  )
}

export default ChatPage 