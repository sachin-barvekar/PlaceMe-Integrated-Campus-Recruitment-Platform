import React from 'react'
import { Modal, Button } from 'rsuite'

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  onConfirm: () => void;
  confirmText?: React.ReactNode;
  cancelText?: React.ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  title = 'Confirm Action',
  message,
  onConfirm,
  confirmText = 'Yes',
  cancelText = 'No'
}) => {
  return (
    <Modal open={open} onClose={onClose} size="xs">
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="modal-text">{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} appearance="primary" color="red">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} appearance="primary">
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmModal
