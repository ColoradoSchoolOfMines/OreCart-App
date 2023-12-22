export interface Alert {
  id: number;
  text: string;
  startDateTime: number;
  endDateTime: number;
}

export interface AlertData {
  text: string;
  start_time: number;
  end_time: number;
}

export interface AddAlertFormProps {
  onSubmit: (data: AlertData) => void; // or Promise<void> if async
  onCancel: () => void;
}

export interface EditAlertFormProps {
  onSubmit: (data: AlertData) => void; // or Promise<void> if async
  onDelete: () => void;
  onCancel: () => void;
}

export interface AlertEditFormMethods {
  setData: (alert: Alert) => void;
  clearForm: () => void;
}

export interface AlertEditFormRef {
  setData: (alert: Alert) => void;
  clearForm: () => void;
}
