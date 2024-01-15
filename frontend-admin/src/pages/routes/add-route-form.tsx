import { AddRouteFormProps } from "./route-types";

const AddRouteForm: React.FC<AddRouteFormProps> = ({ onSubmit, onCancel }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    onSubmit(formData);
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h2>Add Route</h2>
      <label htmlFor="kml_file">KML File</label>
      <input type="file" id="kml_file" name="kml_file" />
      <button type="submit">Submit</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default AddRouteForm;
