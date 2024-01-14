export interface Van {
  id: number;
  routeId: number;
  wheelchair: boolean;
}

export interface VanData {
  route_id: number;
  wheelchair: boolean;
}

export interface EditVanProps {
  onSubmit: (data: VanData) => void; // or Promise<void> if async
  onDelete: () => void;
  onCancel: () => void;
}

export interface VanEditFormRef {
  setData: (van: Van) => void;
  clearForm: () => void;
}

export interface VanEditFormMethods {
  setData: (van: Van) => void;
  clearForm: () => void;
}

export interface AddVanFormProps {
    onSubmit: (data: VanData) => void; // or Promise<void> if async
    onCancel: () => void;
}
