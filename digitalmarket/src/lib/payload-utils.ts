import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest } from "next/server";
import { User } from "../payload-types";

// GET logedin user
export const getServerSideUser = async (
  cookies: NextRequest["cookies"] | ReadonlyRequestCookies
) => {
  const token = cookies.get("payload-token")?.value;

  //   fetch the current user
  // it si not the endpoint we have to make our cms automatically create this wecan simply query it or fetch from it to get the currently loged user
  const meRes = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
    {
      headers: {
        // WE CAN ALSO USE Bearer
        Authorization: `JWT ${token}`,
      },
    }
  );

  //   as the response we get user
  const { user } = (await meRes.json()) as { user: User | null };

  return { user };
};
