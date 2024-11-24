import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const Header = () => {
  return (
    <nav className="w-full flex flex-row justify-between items-center">
      <div>
        <p className="text-3xl font-bold bg-gradient-to-r from-orange-500  to-yellow-500 bg-clip-text text-transparent">
          AceOS
        </p>
      </div>
      <div className="space-x-2">
        <SignedIn>
          <UserButton appearance={{ baseTheme: dark }} afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-orange-300 border border-orange-500 hover:text-white hover:bg-[#ff7a064a] py-2 px-4 rounded-3xl transition duration-300 ease-in-out">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="bg-white text-black py-2 px-4 rounded-3xl transition duration-300 ease-in-out">
              Sign up
            </button>
          </SignUpButton>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Header;
