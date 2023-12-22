import { forwardRef, useImperativeHandle, useRef } from "react";
import { EditVanProps, Van, VanData, VanEditFormRef } from "./van-types";

const VanEditForm = forwardRef<VanEditFormRef, EditVanProps>( ({ onSubmit, onDelete, onCancel}, ref) => {

  const routeIdRef = useRef<HTMLInputElement>(null);
  const wheelchairRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const routeIdInput = form.elements.namedItem('routeId') as HTMLInputElement;
    const wheelchairInput = form.elements.namedItem('wheelchair') as HTMLInputElement;

    const formData: VanData = {
      route_id: parseInt(routeIdInput.value, 10),
      wheelchair: wheelchairInput.checked,
    };

    onSubmit(formData);
  };

  const setData = (van: Van) => {
    if (! (van.routeId === undefined || van.routeId === null)) {
      routeIdRef.current!.value = van.routeId.toString();
    }
    if (! (van.wheelchair === undefined || van.wheelchair === null)) {
      wheelchairRef.current!.checked = van.wheelchair;
    }
  };

  const clearForm = () => {
    routeIdRef.current!.value = '';
    wheelchairRef.current!.checked = false;
  };

  useImperativeHandle(ref, () => ({
    setData,
    clearForm,
  }));

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Route ID:
          <input type="number" name="routeId" ref={routeIdRef} required />
        </label>
        <br />
        <label>
          Wheelchair Accessible:
          <input type="checkbox" name="wheelchair" ref={wheelchairRef} />
        </label>
        <br />
        <button type="submit">Change Van</button>
        <button type="button" onClick={onDelete}>Delete Van</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
});

export default VanEditForm;
