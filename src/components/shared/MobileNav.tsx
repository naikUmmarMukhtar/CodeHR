import { CalendarDays, Clock, User, Wallet } from "lucide-react";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: "attendance", name: "Attendance", icon: <Clock size={18} /> },
  { id: "profile", name: "Profile", icon: <User size={18} /> },
  { id: "leave", name: "Leave", icon: <CalendarDays size={18} /> },
  { id: "salary", name: "Salary", icon: <Wallet size={18} /> },
];

export default function MobileNav({ activeTab, setActiveTab }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--color-bg)] border-t border-[var(--color-border)] shadow-2xl flex justify-around p-2 z-20 lg:hidden">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center p-2 rounded-lg transition text-xs sm:text-sm ${
            activeTab === item.id
              ? "text-[var(--color-primary)] font-semibold"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-secondary)]"
          }`}
        >
          {item.icon}
          {item.name}
        </button>
      ))}
    </nav>
  );
}
