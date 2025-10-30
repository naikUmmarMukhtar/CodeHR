import React from "react";

export default function MobileNav({ items, activeTab, setActiveTab }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl flex justify-around p-2 z-20 lg:hidden">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center p-2 rounded-lg transition text-xs sm:text-sm ${
            activeTab === item.id
              ? "text-blue-600 font-semibold"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          {item.icon}
          {item.name}
        </button>
      ))}
    </nav>
  );
}
