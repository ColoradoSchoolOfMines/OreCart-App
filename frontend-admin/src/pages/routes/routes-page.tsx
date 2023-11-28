import React, { useRef } from 'react';
import { useQuery } from 'react-query';
import Card from '../../components/card/card';
import './routes-page.scss';

interface Route {
  id: number;
  name: string;
}

interface AddRouteFormProps {
  onSubmit: (data: FormData) => void; // or Promise<void> if async
  onCancel: () => void;
}

const fetchRoutes = async () => {
  const response = await fetch('http://localhost:8000/routes');
  const data = await response.json();
  const route_data = data as Route[];
  return route_data;
}

const RoutesPage: React.FC = () => {
  const { data: routes, isLoading, error } = useQuery('routes', fetchRoutes);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleFormSubmit = async (formData: FormData) => {
    try {
      const response = await fetch('http://localhost:8000/routes', {
        method: 'POST',
        body: formData, // FormData is directly sent without setting Content-Type header
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Handle the successful response
      dialogRef.current?.close();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <main className='p-routes-page'>
      <h1>Routes</h1>
      <div className="cards-container">
        {routes?.map((route: Route) => (
          <Card title={`${route.name} (${route.id})`} key={route.id}></Card>
        ))}
      </div>

      <button onClick={() => {dialogRef.current?.show()}}>Add Route</button>

      <dialog ref={dialogRef}>
        <AddRouteForm onSubmit={handleFormSubmit} onCancel={() => {dialogRef.current?.close()}} />
      </dialog>

    </main>
  );
};

const AddRouteForm: React.FC<AddRouteFormProps> = ({ onSubmit, onCancel }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    onSubmit(formData);
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h2>Add Route</h2>
      <label htmlFor="name">Name</label>
      <input type="text" id="name" name="name" />
      <label htmlFor="kml">KML File</label>
      <input type="file" id="kml" name="kml" />
      <button type="submit">Submit</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default RoutesPage;
