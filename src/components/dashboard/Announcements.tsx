// import React from "react";
import { Megaphone } from "lucide-react";

export default function Announcements() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
      <h3 className="font-bold text-lg text-gray-700 mb-3 border-b pb-2 flex items-center gap-2">
        <Megaphone size={18} /> Announcements
      </h3>
      <ul className="space-y-3 text-sm text-gray-600">
        <li className="p-2 border-l-4 border-yellow-500 bg-yellow-50 rounded">
          <strong>Oct 31:</strong> All hands meeting moved to 2:00 PM.
        </li>
        <li className="p-2 border-l-4 border-blue-500 bg-blue-50 rounded">
          <strong>Nov 1:</strong> Submit Q3 goals review by EOD.
        </li>
        <li className="p-2 border-l-4 border-green-500 bg-green-50 rounded">
          <strong>Nov 28:</strong> Office closed for Thanksgiving.
        </li>
      </ul>
    </div>
  );
}
