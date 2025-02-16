import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import logo from "@/public/msgs.png";
import Link from "next/link";

const Header = () => {
  return (
    <nav className="w-full flex flex-row justify-between items-center px-4 py-2">
      <Link href="/">
        <div className="flex flex-row gap-1">
          <Image src={logo} alt="logo" width={35} height={30} />
          <p className="text-2xl font-bold bg-gradient-to-r from-orange-500  to-yellow-500 bg-clip-text text-transparent">
            AceOS
          </p>
        </div>
      </Link>
      <div className="space-x-2">
        <SignedIn>
          <UserButton
            appearance={{
              baseTheme: dark,
              elements: {
                userButtonAvatarBox: "w-8 h-8 sm:w-10 sm:h-10",
              },
            }}
            afterSignOutUrl="/"
          />
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
