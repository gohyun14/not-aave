import { Dialog } from "@headlessui/react";

type ModalProps = {
  closeModal: () => void;
  children: React.ReactNode;
};

const Modal = ({ closeModal, children }: ModalProps) => {
  return (
    <Dialog open={true} as="div" className="relative z-10" onClose={closeModal}>
      <div className="fixed inset-0 bg-black bg-opacity-25" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
            {children}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;
