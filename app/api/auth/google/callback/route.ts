import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import { exchangeCodeForTokens, getGoogleUserInfo } from '@/lib/google-auth'
import { generateToken } from '@/lib/auth'

// Mark this route as dynamic since it uses request.url
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    // Get the base URL from environment or request headers
    const baseUrl = process.env.NEXTAUTH_URL || 
                    process.env.NEXT_PUBLIC_APP_URL || 
                    `${request.headers.get('x-forwarded-proto') || 'https'}://${request.headers.get('x-forwarded-host') || request.headers.get('host')}`;
    
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle OAuth errors
    if (error) {
      return NextResponse.redirect(
        new URL(`/auth/login?error=Google authentication was cancelled or failed`, baseUrl)
      )
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/auth/login?error=No authorization code received', baseUrl)
      )
    }

    // Parse state to get role information
    let role = 'job_seeker'
    try {
      if (state) {
        const stateData = JSON.parse(state)
        role = stateData.role || 'job_seeker'
      }
    } catch (e) {
      console.warn('Failed to parse state parameter:', e)
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code)
    
    // Get user info from Google
    const googleUser = await getGoogleUserInfo(tokens.access_token)

    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { email: googleUser.email.toLowerCase() },
        { googleId: googleUser.id }
      ]
    })

    if (user) {
      // Update existing user with Google info if needed
      if (!user.googleId) {
        user.googleId = googleUser.id
        // If user already has a password, make it hybrid, otherwise google
        user.authProvider = user.password ? 'hybrid' : 'google'
        user.emailVerified = true // Google emails are pre-verified
        if (googleUser.picture && !user.profile?.profilePicture) {
          user.profile = user.profile || {}
          user.profile.profilePicture = googleUser.picture
        }
        await user.save()
      }
    } else {
      // Create new user
      user = await User.create({
        email: googleUser.email.toLowerCase(),
        firstName: googleUser.given_name || googleUser.name?.split(' ')[0] || 'User',
        lastName: googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || '',
        role,
        googleId: googleUser.id,
        authProvider: 'google',
        emailVerified: true, // Google emails are pre-verified
        profile: {
          skills: [],
          profilePicture: googleUser.picture || undefined,
        },
      })
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    // Create response and set cookie
    const response = NextResponse.redirect(new URL('/', baseUrl))
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Google OAuth callback error:', error)
    
    // Get base URL for error redirect
    const baseUrl = process.env.NEXTAUTH_URL || 
                    process.env.NEXT_PUBLIC_APP_URL || 
                    `${request.headers.get('x-forwarded-proto') || 'https'}://${request.headers.get('x-forwarded-host') || request.headers.get('host')}`;
    
    return NextResponse.redirect(
      new URL('/auth/login?error=Authentication failed. Please try again.', baseUrl)
    )
  }
}