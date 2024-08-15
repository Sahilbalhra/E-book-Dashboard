import { Trash2 } from "lucide-react";

const DeleteConfirmationModal = () => {
  return (
    <div>
      <div className="flex justify-center my-4">
        <Trash2 className="text-red-600" size={80} />
      </div>
      <div className="text-center">
        <p className="text-sm">Are You Sure.</p>
        <p className="text-sm">You Want To Delete This Record ?</p>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
