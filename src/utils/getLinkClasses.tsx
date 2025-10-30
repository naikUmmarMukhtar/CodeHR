export const getLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200"${
    isActive
      ? "bg-blue-50 text-rose-600"
      : "text-gray-300  hover:bg-gray-100 text-gray-700"
  }`;
