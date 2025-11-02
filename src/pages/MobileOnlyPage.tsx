// @ts-nocheck
export default function MobileOnlyPage() {
  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-center text-center"
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <img
        src="https://static.vecteezy.com/system/resources/previews/007/283/994/non_2x/blocked-web-page-website-icon-vector.jpg"
        alt="Mobile only access illustration"
        className="w-full h-auto object-contain rounded-xl"
      />

      <h1 className="text-lg font-semibold">Mobile Access Only</h1>
      <p className="text-sm text-(--color-text-muted)">
        Please use your mobile device for better location accuracy.
      </p>
    </div>
  );
}
