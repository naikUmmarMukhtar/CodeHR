import localeCurrency from "locale-currency";

export const formatCurrency = (amount: number): string => {
  const locale = navigator.language || "en-US";
  const currency = localeCurrency.getCurrency(locale) || "USD";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
};
