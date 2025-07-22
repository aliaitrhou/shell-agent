import React from "react";
import { StatusAlert } from "./alert";
import Header from "./header";
// import Footer from "./footer";

interface WrapperProps {
  message: string;
  status: string;
  start: boolean;
  classNames: string;
  children: React.ReactNode;
}

const PageWrapper: React.FC<WrapperProps> = ({
  message,
  status,
  start,
  children,
  classNames,
}) => {
  return (
    <main className={classNames}>
      {!start && <div className={"gradient_background"}></div>}
      <Header />
      {message && (
        <div className="absolute top-0 w-full flex justify-center pt-16 sm:pt-8">
          <StatusAlert message={message} type={status} />
        </div>
      )}
      {children}
      {/* {!start && <Footer />} */}
    </main>
  );
};

export default PageWrapper;
