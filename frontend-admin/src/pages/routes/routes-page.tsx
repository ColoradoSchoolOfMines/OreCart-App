import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useRef } from 'react';
import Card from '../../components/card/card';
import AddRouteForm from './add-route-form';
import { Route } from './route-types';
import './routes-page.scss';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const fetchRoutes = async () => {
  const response = await fetch(`${baseUrl}/routes/`);
  const data = await response.json();
  const route_data = data as Route[];
  return route_data;
}

const RoutesPage: React.FC = () => {
  const { data: routes, isLoading, error } = useQuery({ queryKey: ['routes'], queryFn: fetchRoutes });
  const dialogRef = useRef<HTMLDialogElement>(null);
  const queryClient = useQueryClient();

  const handleFormSubmit = async (formData: FormData) => {
    try {
      const response = await fetch(`${baseUrl}/routes/`, {
        method: 'POST',
        body: formData, // FormData is directly sent without setting Content-Type header
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Handle the successful response
      await queryClient.invalidateQueries({ queryKey: ['routes'] });
      dialogRef.current?.close();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const clearRoutes = async () => {
    try {
      const response = await fetch(`${baseUrl}/routes/`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Handle the successful response
      await queryClient.invalidateQueries({ queryKey: ['routes'] });
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  const getKML = async () => {
    const response = await fetch(`${baseUrl}/routes/kmlfile`);
    const data = await response.json();
    const kml = atob(data.base64);

    const element = document.createElement("a");
    const file = new Blob([kml], {type: 'application/vnd.google-earth.kml+xml'});
    element.href = URL.createObjectURL(file);
    element.download = "routes.kml";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }


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

      {
        (!routes || routes?.length == 0) && <button onClick={() => {dialogRef.current?.show()}}>Add Route</button>
      }

      {
        !(!routes || routes?.length == 0) && <button onClick={() => {clearRoutes()}}>Clear Routes</button>
      }

{
        !(!routes || routes?.length == 0) && <button onClick={() => {getKML()}}>Get KML</button>
      }

      <dialog ref={dialogRef}>
        <AddRouteForm onSubmit={handleFormSubmit} onCancel={() => {dialogRef.current?.close()}} />
      </dialog>

    </main>
  );
};

export default RoutesPage;
