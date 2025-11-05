const holidayList = [
  { name: "New Year", date: "2025-01-01", day: "Wednesday" },
  { name: "Republic Day", date: "2025-01-26", day: "Sunday" },
  { name: "Maha Shivaratri", date: "2025-02-26", day: "Wednesday" },
  { name: "Ramzan (Id-ul-Fitr)", date: "2025-03-31", day: "Monday" },
  { name: "Good Friday", date: "2025-04-18", day: "Friday" },
  { name: "May Day", date: "2025-05-01", day: "Thursday" },
  { name: "Id-ul Ad’ha (Bakrid)", date: "2025-06-06", day: "Thursday" },
  { name: "Muharram", date: "2025-07-06", day: "Sunday" },
  { name: "Independence Day", date: "2025-08-15", day: "Friday" },
  { name: "Gandhi Jayanti", date: "2025-10-02", day: "Thursday" },
  { name: "Diwali (Bali Pratipada)", date: "2025-10-20", day: "Monday" },
  { name: "Christmas", date: "2025-12-25", day: "Thursday" },
];
export default function HolidayList() {
  return (
    <div className="min-h-screen bg-(--color-bg-alt) flex justify-center mb-16 ">
      <div className="w-full max-w-2xl bg-(--color-bg) rounded-2xl shadow-md py-6 border border-(--color-border)">
        <h1 className="text-2xl font-semibold text-center mb-6 text-(--color-primary)">
          📅 Holiday List - 2025
        </h1>

        <div className="divide-y divide-(--color-border)">
          {holidayList.map((holiday, index) => (
            <div
              key={holiday.date}
              className="flex justify-between items-center py-3 px-4 rounded-lg my-1 hover:bg-(--color-holiday-bg) transition"
            >
              <div>
                <p className="text-(--color-text) font-medium">
                  {index + 1}. {holiday.name}
                </p>
                <p className="text-sm text-(--color-text-muted)">
                  {holiday.day}
                </p>
              </div>
              <div className="text-(--color-holiday) font-semibold">
                {new Date(holiday.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
