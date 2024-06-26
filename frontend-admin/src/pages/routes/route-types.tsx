export interface Route {
  id: number;
  name: string;
  description: string;
}

export interface Stop {
  id: number;
  name: string;
}

export interface AddRouteFormProps {
  onSubmit: (data: FormData) => void; // or Promise<void> if async
  onCancel: () => void;
}

export interface RouteEditProps {
  onSubmit: (data: FormData) => void; // or Promise<void> if async
  onDelete: () => void;
  onCancel: () => void;
}

export interface RouteEditFormRef {
  setData: (van: Route) => void;
  clearForm: () => void;
}
