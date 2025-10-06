import { M_PLUS_Rounded_1c, Lexend, Fira_Code, Montserrat } from "next/font/google";

export const mplus = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mplus",
});

export const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-lexend",
});

export const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-firaCode",
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
})
