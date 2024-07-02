import { NextRequest, NextResponse } from "next/server";
import { getServerSideUser } from "./lib/payload-utils";

// ------------------------------------------------------------
// ------------------------------------------------------------

// form nextjs we receive the req of type nextreq
export async function middleware(req: NextRequest) {
  // logic check -> if the user is logged in they shouldnt be able to access the signin and singup page
  const { nextUrl, cookies } = req;
  const { user } = await getServerSideUser(cookies);

  //   if we have the user in the array in signin or signup then dont include next url pathname
  // that means user is trying to access one of these routes and is logged in beacuse we have the user thats how we know they are logged in and in that cae they should not be able to do this beacuse they are already logged in
  if (user && ["/sign-in", "/sign-up"].includes(nextUrl.pathname)) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/`);
  }

  //   if the user is not logged in and not trying to access one of this url then everytgings is fine
  return NextResponse.next();
}
