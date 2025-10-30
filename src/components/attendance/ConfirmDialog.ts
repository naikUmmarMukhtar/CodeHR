import Swal from "sweetalert2";

export async function confirmAction(message: any) {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, proceed",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
  });
  return result.isConfirmed;
}
