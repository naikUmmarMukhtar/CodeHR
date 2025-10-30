import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFromFirebase } from "../api/firebaseAPI";
import type { IncomeExpenseType } from "../types";
import { auth } from "../firebaseConfig";

export const useTransactions = (categoriesList: any[]) => {
  const uid = auth.currentUser?.uid;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["transactions", uid],
    queryFn: () => {
      if (!uid) throw new Error("User not authenticated");
      return getFromFirebase(`${uid}/transactions`);
    },
    enabled: !!uid,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { transactionList, incomeTotal, expenseTotal } = useMemo(() => {
    const resolveCategory = (id: string) =>
      categoriesList.find((cat) => cat.id === id) || "";

    const expenses = data?.expenses || {};
    const incomes = data?.incomes || {};

    const expenseList: IncomeExpenseType[] = Object.entries(expenses).map(
      ([key, value]: any) => ({
        id: key,
        type: "expenses",
        description: value.description,
        amount: Number(value.amount),
        date: value.date,
        selectedCategory: resolveCategory(value.selectedCategory?.id),
      })
    );

    const incomeList: IncomeExpenseType[] = Object.entries(incomes).map(
      ([key, value]: any) => ({
        id: key,
        type: "incomes",
        description: value.description,
        amount: Number(value.amount),
        date: value.date,
        selectedCategory: resolveCategory(value.selectedCategory?.id),
      })
    );

    const allTransactions = [...expenseList, ...incomeList].reverse();

    const incomeTotal = incomeList.reduce((sum, item) => sum + item.amount, 0);
    const expenseTotal = expenseList.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    return {
      transactionList: allTransactions,
      incomeTotal,
      expenseTotal,
    };
  }, [data, categoriesList]);

  return {
    transactionList,
    incomeTotal,
    expenseTotal,
    loading: isLoading,
    error: isError,
    refetchTransactions: refetch,
  };
};
