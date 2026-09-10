import React from 'react'
import AppNavbar from '@/components/layout/AppNavbar'

export default function SchemesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNavbar />
      {children}
    </>
  )
}
