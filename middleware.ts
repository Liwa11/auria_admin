import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from './src/lib/supabase';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If accessing dashboard routes without session, redirect to login
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  // If accessing login page with session, redirect to dashboard
  if (session && req.nextUrl.pathname === '/login') {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}; 