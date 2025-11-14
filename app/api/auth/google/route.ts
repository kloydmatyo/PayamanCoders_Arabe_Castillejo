import { NextRequest, NextResponse } from "next/server";
import { getGoogleAuthUrl, GOOGLE_OAUTH_CONFIG } from "@/lib/google-auth";

// Mark this route as dynamic since it uses request.url
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get the base URL from environment or request headers
    const baseUrl = process.env.NEXTAUTH_URL || 
                    process.env.NEXT_PUBLIC_APP_URL || 
                    `${request.headers.get('x-forwarded-proto') || 'https'}://${request.headers.get('x-forwarded-host') || request.headers.get('host')}`;
    
    // Check if Google OAuth is properly configured
    if (!GOOGLE_OAUTH_CONFIG.clientId || !GOOGLE_OAUTH_CONFIG.clientSecret) {
      console.error("Google OAuth configuration missing:", {
        clientId: !!GOOGLE_OAUTH_CONFIG.clientId,
        clientSecret: !!GOOGLE_OAUTH_CONFIG.clientSecret,
      });

      // Redirect to login with error message
      const loginUrl = new URL("/auth/login", baseUrl);
      loginUrl.searchParams.set("error", "google_oauth_not_configured");
      return NextResponse.redirect(loginUrl);
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") || "job_seeker";

    // Generate state parameter to include role information
    const state = JSON.stringify({ role });

    // Get Google OAuth URL
    const authUrl = getGoogleAuthUrl(state);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Google OAuth initiation error:", error);

    // Get base URL for error redirect
    const baseUrl = process.env.NEXTAUTH_URL || 
                    process.env.NEXT_PUBLIC_APP_URL || 
                    `${request.headers.get('x-forwarded-proto') || 'https'}://${request.headers.get('x-forwarded-host') || request.headers.get('host')}`;

    // Redirect to login with error message
    const loginUrl = new URL("/auth/login", baseUrl);
    loginUrl.searchParams.set("error", "google_oauth_failed");
    return NextResponse.redirect(loginUrl);
  }
}
