import { NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { compare } from 'bcryptjs'

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      return NextResponse.json(
        { message: 'Serviço temporariamente indisponível' },
        { status: 503 }
      )
    }

    const { email, password } = await request.json()

    // Buscar o usuário no Supabase
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !adminUser) {
      return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Verificar a senha
    const isValidPassword = await compare(password, adminUser.password_hash)

    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Gerar o token JWT
    const token = sign(
      { 
        email: adminUser.email,
        id: adminUser.id,
        name: adminUser.name 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    )

    // Criar a resposta com o cookie
    const response = NextResponse.json({ 
      message: 'Login realizado com sucesso',
      user: {
        email: adminUser.email,
        name: adminUser.name
      }
    })
    
    // Configurar o cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 dia
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Erro na autenticação:', error)
    return NextResponse.json(
      { message: 'Erro ao fazer login' },
      { status: 500 }
    )
  }
} 