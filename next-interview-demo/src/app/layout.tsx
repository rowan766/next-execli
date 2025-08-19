// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@/contexts/UserContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next.js 面试 Demo',
  description: '全面的 Next.js 和 React 面试知识点演示',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        {/* 面试重点：Provider 的层级结构 */}
        <UserProvider>
          <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
              <div className="container mx-auto px-4 py-4">
                <h1 className="text-xl font-bold text-gray-800">
                  Next.js 面试知识点 Demo
                </h1>
              </div>
            </header>
            
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            
            <footer className="bg-white border-t mt-auto">
              <div className="container mx-auto px-4 py-4 text-center text-gray-600">
                <p>涵盖 React、Next.js、TypeScript 核心面试知识点</p>
              </div>
            </footer>
          </div>
        </UserProvider>
      </body>
    </html>
  )
}