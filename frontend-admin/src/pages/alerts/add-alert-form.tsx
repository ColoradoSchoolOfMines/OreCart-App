import { AddAlertFormProps, AlertData } from "./alert-types";

const AddAlertForm: React.FC<AddAlertFormProps> = ({ onSubmit, onCancel }) => {
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

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="text">Text</label>
      <input type="text" id="text" name="text" />
      <br />
      <label htmlFor="start_time">Start Time</label>
      <input type="datetime-local" id="start_time" name="start_time" />
      <br />
      <label htmlFor="end_time">End Time</label>
      <input type="datetime-local" id="end_time" name="end_time" />
      <br />
      <button type="submit">Submit</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default AddAlertForm;
