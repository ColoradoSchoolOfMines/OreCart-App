import { useQuery } from '@tanstack/react-query';
import { Route } from '../routes/route-types.tsx';
import { AddVanFormProps, VanData } from './van-types.tsx';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const fetchRoutes = async () => {
    const response = await fetch(baseUrl + '/routes/');
    const data = await response.json();
    const route_data = data as Route[];
    return route_data;
}

const AddVanForm: React.FC<AddVanFormProps> = ({ onSubmit, onCancel }) => {
    const { data: routes } = useQuery({ queryKey: ['routes'], queryFn: fetchRoutes });

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
                    {routes?.length === 0 ? (
                        <p>No routes available</p>
                    ) : (
                        <select name="number" id="routeId" required>
                            {routes?.map((route: Route) => (
                                <option key={route.id} value={route.id}>{route.name} ({route.id})</option>
                            ))}
                        </select>
                    )}
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
