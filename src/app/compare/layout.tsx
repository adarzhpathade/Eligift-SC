import React from 'react'
import AppNavbar from '@/components/layout/AppNavbar'
import { PageTransition } from '@/components/ui/motion/page-transition'

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNavbar />
      <PageTransition>{children}</PageTransition>
    </>
  )
}
