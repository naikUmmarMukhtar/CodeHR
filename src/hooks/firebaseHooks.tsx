// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   deleteFromFirebase,
//   getFromFirebase,
//   postToFirebase,
//   putToFirebase,
// } from "../api/firebaseAPI";

// export const useFirebaseData = (endpoint: string) =>
//   useQuery({
//     queryKey: ["firebaseData", endpoint],
//     queryFn: () => getFromFirebase(endpoint),
//   });

// export const usePostToFirebase = (endpoint: string) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (data: any) => postToFirebase(endpoint, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["firebaseData", endpoint] });
//     },
//   });
// };

// export const useUpdateFirebase = (endpoint: string) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (updatedData: any) => putToFirebase(endpoint, updatedData),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["firebaseData", endpoint] });
//     },
//   });
// };

// export const useDeleteFromFirebase = (endpoint: string) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: () => deleteFromFirebase(endpoint),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["firebaseData", endpoint] });
//     },
//   });
// };
