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

    // Get translation history from database
    const history = await prisma.translationHistory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        originalText: true,
        enhancedText: true,
        creditsConsumed: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: history.map((item) => ({
        id: item.id,
        originalText: item.originalText,
        enhancedText: item.enhancedText,
        creditsConsumed: item.creditsConsumed,
        createdAt: item.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Get history error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

