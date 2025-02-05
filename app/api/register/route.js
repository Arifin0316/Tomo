import prisma from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { username, email, password } = await req.json()
    
    const exists = await prisma.user.findUnique({
      where: { email }
    })
    
    if (exists) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(password, 10)
    
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      }
    })

    return NextResponse.json(
      { message: 'User berhasil dibuat' },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat user' },
      { status: 500 }
    )
  }
}