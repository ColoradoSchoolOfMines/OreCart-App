import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
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

interface RouteEditProps {
  onSubmit: (data: FormData) => void; // or Promise<void> if async
  onDelete: () => void;
  onCancel: () => void;
}

const fetchRoutes = async () => {
  const response = await fetch('http://localhost:8000/routes/');
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
      const response = await fetch('http://localhost:8000/routes/', {
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
      const response = await fetch(`http://localhost:8000/routes/${currentRouteId}`, {
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
      const response = await fetch(`http://localhost:8000/routes/${currentRouteId}`, {
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

interface RouteEditFormRef {
  setData: (van: Route) => void;
  clearForm: () => void;
}

const EditRouteForm = forwardRef<RouteEditFormRef, RouteEditProps>(({onSubmit, onDelete, onCancel}, ref) => {

  const nameRef = useRef<HTMLInputElement>(null);
  const kmlRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    onSubmit(formData);
  };

  const setData = (data: Route) => {
    if (nameRef.current && kmlRef.current) {
      nameRef.current.value = data.name;
    }
  }

  const clearForm = () => {
    nameRef.current!.value = '';
    kmlRef.current!.value = '';
  };

  useImperativeHandle(ref, () => ({
    setData,
    clearForm,
  }));

  return (
    <form className="edit-form" onSubmit={handleSubmit}>
      <h2>Edit Route</h2>
      <label htmlFor="name">Name</label>
      <input type="text" id="name" name="name" ref={nameRef} />
      <br />
      <label htmlFor="kml">KML File</label>
      <input type="file" id="kml" name="kml" ref={kmlRef} />
      <br />
      <button type="submit">Submit</button>
      <button type="button" onClick={onDelete}>Delete</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
});

export default RoutesPage;
