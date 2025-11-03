import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
} from "@headlessui/react";
import type { ConfirmModalProps } from "../../types";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmModalProps & {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 flex w-screen items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      >
        <DialogPanel
          className="max-w-md w-full rounded-xl p-6 space-y-4 shadow-xl"
          style={{
            backgroundColor: "var(--color-bg)",
            color: "var(--color-text)",
          }}
        >
          <DialogTitle
            className="text-lg font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            {title}
          </DialogTitle>

          <Description
            className="text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            {description}
          </Description>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded"
              style={{
                color: "var(--color-text-muted)",
              }}
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 text-sm rounded"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-bg)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--color-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--color-primary)")
              }
            >
              {confirmText}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
