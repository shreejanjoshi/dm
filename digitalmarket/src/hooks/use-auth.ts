import { useRouter } from "next/navigation";
import { toast } from "sonner";

// this is nothing then an arrow function that now has access to all reacr api beacuse it is prefixed with you ki use
export const useAuth = () => {
  const router = useRouter();

  const signOut = async () => {
    try {
      const res = await fetch(
        // api endpoint that our cms provides to us that we can simply call its going to invalidate the token remove it from the response and the user is logged out propley
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`,
        // some options
        {
          method: "POST",
          credentials: "include",
          headers: {
            // a data format that is propbably the most comman in any api calls. We are saying this is of type application json this could be plain text or whatever but we are working with json here
            "Content-Type": "application/json",
          },
        }
      );

      //   if something goes wrong throw new error res not okey
      if (!res.ok) throw new Error();

      toast.success("Signed out successfully");

      router.push("/sign-in");
      router.refresh();
    } catch (err) {
      toast.error("Couldn't sign out, please try again.");
    }
  };

  return { signOut };
};
