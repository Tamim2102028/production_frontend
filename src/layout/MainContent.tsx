import React from "react";
import AppRoutes from "../routes/AppRoutes";
import Navbar from "./Navbar";

const MainContent: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="space-y-5 py-5">
        <AppRoutes />
      </div>
    </>
  );
};

export default MainContent;
