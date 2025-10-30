import React from "react";
import { Clock } from "lucide-react";

export default function PunchLog({ punches, message }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
      {message && (
        <p
          className="text-xs p-2 rounded-lg border text-center mb-3"
          dangerouslySetInnerHTML={{
            __html: message.includes("successful")
              ? `<span class='text-green-600 font-medium'>${message}</span>`
              : `<span class='text-red-500 font-medium'>${message}</span>`,
          }}
        />
      )}

      <h3 className="font-bold text-base text-gray-700 mb-3 border-b pb-2 flex items-center gap-2">
        <Clock size={16} /> Today's Log
      </h3>

      {punches.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No records.</p>
      ) : (
        <ul className="text-sm text-gray-700 space-y-2">
          {punches.map((p, i) => (
            <li key={i} className="flex justify-between">
              <span
                className={`font-semibold ${
                  p.type === "Check-in" ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {p.type}
              </span>
              <span className="font-mono text-gray-600">{p.time}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
