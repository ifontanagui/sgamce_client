import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

const publicRoutes = [
  { path: '/sign-in', whenAuthenticated: 'next' },
  { path: '/redirect', whenAuthenticated: 'redirect' },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATE_ROUTE = '/sign-in';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find(route => route.path === path )
  const token = request.cookies.get('token')
  const authToken = token?.value
  
  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  if (!authToken && !publicRoute) {

    const redirectUrl = request.nextUrl.clone();
    
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATE_ROUTE;

    return NextResponse.redirect(redirectUrl);
  }
  
  if (authToken && publicRoute && publicRoute?.whenAuthenticated === 'redirect') {
    const redirectUrl = request.nextUrl.clone();
    
    redirectUrl.pathname = '/';

    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && !publicRoute) {
    //Checar ser o JWT esta expirado
    //Se sim, redirecionar para o SignIn
  
    return NextResponse.next();
  }
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}