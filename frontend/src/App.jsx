import { useEffect } from "react";

import {
  useUser,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton
} from "@clerk/clerk-react";

import {
  saveUserToDB
} from "./api/authApi";

function App() {

  const {
    user,
    isLoaded
  } = useUser();

  useEffect(() => {

    if (!isLoaded || !user)
      return;

    const syncUser =
    async () => {

      try {

        await saveUserToDB({

          fullName:
            user.fullName,

          email:
            user.primaryEmailAddress
            ?.emailAddress,

          avatar:
            user.imageUrl,

          phoneNumber: ""

        });

        console.log(
          "User saved to MongoDB"
        );

      } catch (error) {

        console.log(error);
      }
    };

    syncUser();

  }, [user, isLoaded]);

  return (

    <div
      style={{
        padding: "40px"
      }}
    >

      <h1>
        RealEstatePro
      </h1>

      <SignedOut>

        <button
          style={{
            marginRight: "10px"
          }}
        >
          <SignInButton />
        </button>

        <button>
          <SignUpButton />
        </button>

      </SignedOut>

      <SignedIn>

        <p>
          Welcome,
          {" "}
          {user?.fullName}
        </p>

        <UserButton />

      </SignedIn>

    </div>
  );
}

export default App;