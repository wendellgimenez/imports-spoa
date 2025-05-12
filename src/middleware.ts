import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Verificar se a rota é administrativa
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Verificar se o usuário está autenticado
    const isAuthenticated = request.cookies.has('admin_token')
    
    // Se não estiver autenticado e não estiver na página de login, redirecionar para o login
    if (!isAuthenticated && request.nextUrl.pathname !== '/admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    
    // Se estiver autenticado e estiver na página de login, redirecionar para o dashboard
    if (isAuthenticated && request.nextUrl.pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
} 