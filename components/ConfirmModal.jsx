import Button from "./Button";

export default function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-primary p-6 rounded-lg shadow-lg text-center border-card-detail">
        <span className="mb-4 text-primary">{message}</span>
        <div className="flex justify-center gap-4 mt-4">
          <Button
            customFunction={onClose}
            customClasses="bg-secondary border-primary px-4 py-2 rounded text-primary"
            text={"Cancelar"}
          />
          <Button
            customFunction={onConfirm}
            customClasses="button-delete-bg text-primary px-4 py-2 rounded"
            text={"Confirmar"}
          />
        </div>
      </div>
    </div>
  );
}
