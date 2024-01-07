import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import Card from '../../components/card/card';
import AddRouteForm from './add-route-form';
import EditRouteForm from './edit-route-form';
import { Route, RouteEditFormRef } from './route-types';
import './routes-page.scss';

const baseUrl = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : "http://localhost:8000";

const fetchRoutes = async () => {
  const response = await fetch(baseUrl + '/routes/');
  const data = await response.json();
  const route_data = data as Route[];
  return route_data;
}

const RoutesPage: React.FC = () => {
  const { data: routes, isLoading, error } = useQuery({ queryKey: ['routes'], queryFn: fetchRoutes });
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogEditRef = useRef<HTMLDialogElement>(null);
  const [ currentRouteId, setCurrentRouteId ] = useState<number>(-1);
  const routeEditFormRef = useRef<RouteEditFormRef>(null);
  const queryClient = useQueryClient();

  const handleFormSubmit = async (formData: FormData) => {
    try {
      const response = await fetch(baseUrl + '/routes/', {
        method: 'POST',
        body: formData, // FormData is directly sent without setting Content-Type header
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

  const openRouteEditForm = (routeId: number) => {
    setCurrentRouteId(routeId);
    dialogEditRef.current?.showModal();
    routeEditFormRef.current?.clearForm();
    const route = routes?.find((route: Route) => route.id === routeId);
    if (route) {
      routeEditFormRef.current?.setData(route);
    }
  };

  const handleEditFormSubmit = async (formData: FormData) => {
    try {
      const response = await fetch(`${baseUrl}/routes/${currentRouteId}`, {
        method: 'PUT',
        body: formData, // FormData is directly sent without setting Content-Type header
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Handle the successful response
      await queryClient.invalidateQueries({ queryKey: ['routes'] });
      setCurrentRouteId(-1);
      dialogEditRef.current?.close();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${baseUrl}/routes/${currentRouteId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Handle the successful response
      await queryClient.invalidateQueries({ queryKey: ['routes'] });
      setCurrentRouteId(-1);
      dialogEditRef.current?.close();
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
          <Card title={`${route.name} (${route.id})`} key={route.id} onClick={() => {openRouteEditForm(route.id)}}></Card>
        ))}
      </div>

      <button onClick={() => {dialogRef.current?.show()}}>Add Route</button>

      <dialog ref={dialogRef}>
        <AddRouteForm onSubmit={handleFormSubmit} onCancel={() => {dialogRef.current?.close()}} />
      </dialog>

      <dialog ref={dialogEditRef}>
        <EditRouteForm ref={routeEditFormRef} onSubmit={handleEditFormSubmit} onCancel={() => {dialogEditRef.current?.close()}} onDelete={handleDelete} />
      </dialog>

    </main>
  );
};

export default RoutesPage;
