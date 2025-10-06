import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  console.log('🔐 Login API called')
  
  try {
    console.log('📡 Connecting to database...')
    await dbConnect()
    console.log('✅ Database connected')
    
    const body = await request.json()
    console.log('📨 Request body received:', { email: body.email, passwordLength: body.password?.length })
    
    const { email, password } = body

    if (!email || !password) {
      console.log('❌ Missing email or password')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    console.log('🔍 Looking for user with email:', email)
    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      console.log('❌ User not found')
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    console.log('✅ User found:', user.email, 'Role:', user.role)

    // Check if email is verified
    if (!user.emailVerified) {
      console.log('❌ Email not verified')
      return NextResponse.json(
        { 
          error: 'Please verify your email address before logging in',
          requiresVerification: true,
          email: user.email
        },
        { status: 403 }
      )
    }

    // Check if user uses Google OAuth only (no password set)
    if (user.authProvider === 'google' && !user.password) {
      console.log('❌ User should use Google OAuth (no password set)')
      return NextResponse.json(
        { 
          error: 'This account was created with Google. Please sign in with Google or set a password in your profile.',
          requiresGoogleAuth: true
        },
        { status: 400 }
      )
    }

    // Check if user has no password (shouldn't happen, but safety check)
    if (!user.password) {
      console.log('❌ User has no password')
      return NextResponse.json(
        { 
          error: 'No password set for this account. Please sign in with Google or set a password.',
          requiresGoogleAuth: true
        },
        { status: 400 }
      )
    }

    console.log('🔑 Comparing passwords...')
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      console.log('❌ Password invalid')
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    console.log('✅ Password valid')

    console.log('🎫 Creating JWT token...')
    // Create JWT token
    const tokenPayload = { userId: user._id, email: user.email, role: user.role }
    console.log('🎫 Token payload:', tokenPayload)
    
    if (!process.env.JWT_SECRET) {
      console.error('❌ Missing JWT_SECRET in environment variables')
      return NextResponse.json(
        { error: 'Server configuration error: missing JWT_SECRET' },
        { status: 500 }
      )
    }
    const JWT_SECRET = process.env.JWT_SECRET

    const token = jwt.sign(
      tokenPayload,
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    console.log('✅ JWT token created')

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject()

    const response = NextResponse.json(
      { message: 'Login successful', user: userWithoutPassword },
      { status: 200 }
    )

    console.log('🍪 Setting cookie...')
    // Set HTTP-only cookie with more permissive settings for development
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds (Next expects seconds)
      path: '/',
      // omit domain in development
    })
    console.log('✅ Cookie set successfully')

    console.log('🎉 Login successful for user:', user.email)
    return response
  } catch (error) {
    console.error('💥 Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}