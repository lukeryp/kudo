import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kudo — RYP Golf Proof of Work',
  description: 'Student testimonial pipeline and management for golf instructors.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="antialiased">{children}</body>
    </html>
  )
}
