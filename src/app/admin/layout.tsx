import { Inter } from 'next/font/google'
import '../globals.css'
import AdminNav from './components/AdminNav'

const inter = Inter({ subsets: ['latin'] })

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AdminNav />
        <main className="p-4">
          {children}
        </main>
      </body>
    </html>
  )
} 