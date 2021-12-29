import { NextRequest, NextResponse } from 'next/server';
// import AuthService from "src/services/auth";

export async function middleware(req: NextRequest) {

  return setUserCookie(req, NextResponse.next());
};

export async function setUserCookie(
  request: NextRequest,
  response: NextResponse
) {
  const token = request.cookies["token"];

  console.log("TOKEN FOUND : "+token)
  console.log(request.url)

  if (!token && request.url !== '/login') {
    return NextResponse.redirect("/login");
  };

  if(token && request.url === '/login') {
    return NextResponse.redirect("/");
  }

  return NextResponse.next();

};