import { AddVanFormProps, VanData } from './van-types.tsx';

const AddVanForm: React.FC<AddVanFormProps> = ({ onSubmit, onCancel }) => {
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

    return (
        <div className="popup-form">
        <form onSubmit={handleSubmit}>
            <label>
            Route ID:
            <input type="number" name="routeId" required />
            </label>
            <br />
            <label>
            Wheelchair Accessible:
            <input type="checkbox" name="wheelchair" />
            </label>
            <br />
            <button type="submit">Create Van</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
        </div>
    );
};

export default AddVanForm;
