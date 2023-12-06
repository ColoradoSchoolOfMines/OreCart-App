import { forwardRef, useImperativeHandle, useRef } from "react";
import { Alert, AlertData, AlertEditFormRef, EditAlertFormProps } from "./alert-types";

const EditAlertForm = forwardRef<AlertEditFormRef, EditAlertFormProps>(({ onSubmit, onCancel, onDelete }, ref) => {
  const textRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const startTime = new Date(formData.get('start_time') as string);
    const endTime = new Date(formData.get('end_time') as string);
    const alertData: AlertData = {
      text: formData.get('text') as string,
      start_time: startTime.getTime() / 1000,
      end_time: endTime.getTime() / 1000,
    };

    onSubmit(alertData);
  };

  const setData = (data: Alert) => {
    if (! (data.text === undefined || data.text === null)) {
      textRef.current!.value = data.text;
    }
    if (! (data.startDateTime === undefined || data.startDateTime === null)) {
      startTimeRef.current!.value = (new Date(data.startDateTime*1000).toISOString().slice(0, 16));
    }
    if (! (data.endDateTime === undefined || data.endDateTime === null)) {
      endTimeRef.current!.value = (new Date(data.endDateTime * 1000).toISOString().slice(0, 16));
    }
  }

  const clearForm = () => {
    textRef.current!.value = '';
    startTimeRef.current!.value = '';
    endTimeRef.current!.value = '';
  };

  useImperativeHandle(ref, () => ({
    setData,
    clearForm,
  }));

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="text">Text</label>
      <input type="text" id="text" name="text" ref={textRef} />
      <br />
      <label htmlFor="start_time">Start Time</label>
      <input type="datetime-local" id="start_time" name="start_time" ref={startTimeRef} />
      <br />
      <label htmlFor="end_time">End Time</label>
      <input type="datetime-local" id="end_time" name="end_time" ref={endTimeRef} />
      <br />
      <button type="submit">Submit</button>
      <button type="button" onClick={onDelete}>Delete</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
});

export default EditAlertForm;
