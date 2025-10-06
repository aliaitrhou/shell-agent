// import React from "react";
// import StatusAlert from "./alert";
// import Header from "./header";
// import { userAlertStore } from "@/stores/use-alert-store";
//
// interface WrapperProps {
//   start: boolean;
//   classNames: string;
//   children: React.ReactNode;
// }
//
// const PageWrapper: React.FC<WrapperProps> = ({
//   start,
//   children,
//   classNames,
// }) => {
//   const { message, type } = userAlertStore();
//
//   return (
//     <main className={`${classNames} min-h-screen flex flex-col`}>
//       {!start && <div className={"gradient_background"}></div>}
//       {message && (
//         <div className="absolute top-0 w-full flex justify-center">
//           <StatusAlert message={message} type={type} />
//         </div>
//       )}
//       {children}
//     </main>
//   );
// };
//
// export default PageWrapper;
