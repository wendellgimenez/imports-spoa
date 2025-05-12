import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { hash } from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    // Verificar se já existe algum usuário admin
    const { count } = await supabase
      .from('admin_users')
      .select('*', { count: 'exact', head: true })

    if (count && count > 0) {
      return NextResponse.json(
        { message: 'Já existe um usuário administrador configurado' },
        { status: 400 }
      )
    }

    // Criar hash da senha
    const passwordHash = await hash(password, 10)

    // Criar o usuário admin
    const { data, error } = await supabase
      .from('admin_users')
      .insert([
        {
          email,
          password_hash: passwordHash,
          name
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar usuário admin:', error)
      return NextResponse.json(
        { message: 'Erro ao criar usuário administrador' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Usuário administrador criado com sucesso',
      user: {
        email: data.email,
        name: data.name
      }
    })
  } catch (error) {
    console.error('Erro na configuração:', error)
    return NextResponse.json(
      { message: 'Erro ao configurar usuário administrador' },
      { status: 500 }
    )
  }
} 