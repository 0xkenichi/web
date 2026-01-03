import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";
import { cookies } from "next/headers";
import { prisma } from "@verba/database";
import { createClient as createBrowserClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  try {
    let user = null;
    
    // Try to get user from Authorization header first (for client-side calls)
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const accessToken = authHeader.substring(7);
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
      
      if (supabaseUrl && supabaseKey) {
        try {
          // Decode JWT token to get user info (Supabase tokens are standard JWTs)
          const tokenParts = accessToken.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
            // Verify token hasn't expired
            if (payload.exp && payload.exp * 1000 > Date.now()) {
              // Create a minimal user object from the token
              user = {
                id: payload.sub,
                email: payload.email,
                // Add other fields as needed
              } as any;
            }
          }
        } catch (tokenError) {
          // If token decoding fails, try Supabase REST API verification
          try {
            const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'apikey': supabaseKey,
              },
            });
            if (response.ok) {
              const userData = await response.json();
              user = userData;
            }
          } catch (apiError) {
            console.log("Token verification failed:", apiError);
          }
        }
      }
    }
    
    // Fall back to cookie-based authentication
    if (!user) {
      try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const {
          data: { user: cookieUser },
        } = await supabase.auth.getUser();
        user = cookieUser;
      } catch (cookieError) {
        // Cookie auth failed, but that's okay if we already have user from token
        console.log("Cookie auth failed:", cookieError);
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Try to find user in database, or create if doesn't exist
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        creditsBalance: true,
        premiumStatus: true,
      },
    });

    // If user doesn't exist in database, create them (first time login)
    if (!dbUser) {
      try {
        dbUser = await prisma.user.create({
          data: {
            id: user.id,
            email: user.email || "",
            name: user.email?.split("@")[0] || "User",
            creditsBalance: 100, // Free tier monthly allocation
            premiumStatus: "free",
          },
          select: {
            creditsBalance: true,
            premiumStatus: true,
          },
        });
      } catch (createError: any) {
        console.error("Error creating user:", createError);
        // If creation fails (e.g., email already exists), try to find by email
        if (user.email) {
          dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: {
              creditsBalance: true,
              premiumStatus: true,
            },
          });
        }
        
        if (!dbUser) {
          return NextResponse.json(
            { error: "Failed to create or find user" },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        balance: dbUser.creditsBalance,
        premiumStatus: dbUser.premiumStatus,
        unlimited: dbUser.premiumStatus === "premium",
      },
    });
  } catch (error: any) {
    console.error("Get balance error:", error);
    // Log more details for debugging
    console.error("Error details:", {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}

