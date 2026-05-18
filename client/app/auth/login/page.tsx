import React from 'react'
import LoginForm from "@/app/components/forms/LoginForm";
import Header from '@/app/components/layout/headers/header';

export default function page() {
  return (
    <div>
      <Header />
      <LoginForm />
    </div>
  )
}
