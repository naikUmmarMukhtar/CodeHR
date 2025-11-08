//@ts-nocheck
export default function LeavePopup({ record, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div
        className="p-6 rounded-2xl shadow-lg max-w-md w-[90%] relative"
        style={{
          backgroundColor: "var(--color-leave-bg)",
          color: "var(--color-text)",
          fontFamily: "'Courier New', monospace",
          border: "2px dashed var(--color-leave)",
        }}
      >
        <h2
          className="text-xl font-bold mb-3"
          style={{ color: "var(--color-leave)" }}
        >
          Leave Note 📝
        </h2>
        <p className="mb-2">
          <strong>Name:</strong> {record.name}
        </p>
        <p className="mb-2">
          <strong>Date:</strong> {new Date(record.date).toDateString()}
        </p>
        <p className="mb-4 whitespace-pre-wrap">{record.reason}</p>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-sm px-3 py-1 rounded-full text-white"
          style={{ backgroundColor: "var(--color-leave)" }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
