//@ts-nocheck

export default function MessageBanner({ message }) {
  return (
    <p
      className="text-xs text-center font-medium mt-3 rounded-md py-2 px-3"
      style={{
        color: "var(--color-text)",
      }}
    >
      {message}
    </p>
  );
}
