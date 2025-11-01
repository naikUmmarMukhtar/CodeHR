export default function MessageBanner({ message }) {
  return (
    <p
      className="text-sm text-center font-medium mt-3 rounded-md py-2 px-3"
      style={{
        color: "var(--color-primary)",
      }}
    >
      {message}
    </p>
  );
}
