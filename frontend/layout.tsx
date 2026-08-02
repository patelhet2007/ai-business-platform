import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Business Operations Intelligence Platform',
  description: 'Enterprise AI-powered ERP + CFO + Supply Chain Control Tower for Indian SMEs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  )
}
