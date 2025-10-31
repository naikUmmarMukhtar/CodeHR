//@ts-nocheck
import { useIsMobile } from "../../hooks/useIsMobile";

export default function ContentWrapper({
  children,
  compactScreen = false,
  topSpacing = false,
}) {
  const isMobile = useIsMobile();

  const widthClass = compactScreen && !isMobile ? "w-[74vw]" : "w-[93vw]";

  const topMarginClass = topSpacing
    ? "mt-16 sm:mt-16 md:mt-28 lg:mt-32"
    : "mt-0";

  return (
    <div className={`${widthClass} ${topMarginClass} mx-auto`}>{children}</div>
  );
}
