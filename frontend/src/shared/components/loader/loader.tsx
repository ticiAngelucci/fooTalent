import React from "react";

export default function loader() {
  return (
    <div>
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    </div>
  );
}
