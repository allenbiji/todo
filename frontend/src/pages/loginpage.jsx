import React from "react";
import LoginBox from "../components/loginform";  

const NewLoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      
      
      
      
      <div className="w-full max-w-md">
        <LoginBox />
      </div>

      <footer className="mt-10 mb-5 text-gray-500 text-center fixed bottom-0">
        &copy; {new Date().getFullYear()} Biji'sTodo App. All rights reserved.
      </footer>
    </div>
  );
};

export default NewLoginPage;
