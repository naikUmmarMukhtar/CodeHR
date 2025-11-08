export default function AuthHeader({
  mode,
}: {
  mode: "employeeLogin" | "employeeRegister" | "adminLogin" | "adminRegister";
}) {
  const isAdmin = mode.startsWith("admin");
  const isLogin = mode.endsWith("Login");

  const subtitle = isLogin
    ? `Log in as ${isAdmin ? "Admin" : "Employee"}`
    : `Create ${isAdmin ? "Admin" : "Employee"} Account`;

  return (
    <div className="text-center space-y-2 mb-6">
      <h1 className="font-bold tracking-tight">
        <span className="text-(--color-primary) text-3xl sm:text-4xl md:text-5xl">
          CodeStrix{" "}
        </span>
        <span className="text-(--color-secondary) text-3xl sm:text-4xl md:text-5xl">
          {" "}
          HRM
        </span>
      </h1>

      <p className="text-sm sm:text-base text-(--color-text-muted) font-medium">
        {subtitle}
      </p>
    </div>
  );
}
