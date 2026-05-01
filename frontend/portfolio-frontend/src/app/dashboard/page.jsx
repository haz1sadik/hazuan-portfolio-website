'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useAuth } from "../../context/AuthContext.jsx";


const page = () => {
  const { logout, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  const handleLogout = async () => {
    const ok = await logout();    
    if (ok) {
      router.push("/");
    }
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <div>Dashboard</div>
      <button onClick={handleLogout} className='border-2 hover:cursor-pointer text-white font-bold bg-amber-400 border-amber-500 w-30 h-10 rounded-xl'>Logout</button>
    </>
  )
}

export default page