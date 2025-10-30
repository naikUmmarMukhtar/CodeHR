import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFromFirebase } from "../api/firebaseAPI";
import { auth } from "../firebaseConfig";

export const useCategories = () => {
  const uid = auth.currentUser?.uid;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["categories", uid],
    enabled: !!uid,
    queryFn: async () => {
      const data = await getFromFirebase(`${uid}/categories`);
      return Object.entries(data || {}).map(([key, value]: any) => ({
        id: key,
        type: value.type,
        category: value.category,
        date: value.date,
      }));
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const categoriesList = useMemo(() => data ?? [], [data]);

  return {
    categoriesList,
    loadingCategories: isLoading,
    error: isError,
    refetchCategories: refetch,
  };
};
