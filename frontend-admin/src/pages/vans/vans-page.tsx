import React, { useRef } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import Card from '../../components/card/card';
import './vans-page.scss';

interface Van {
  vanId: number;
  routeId: number;
  wheelchair: boolean;
}

interface VanData {
  route_id: number;
  wheelchair: boolean;
  // file: File; // If you're including a file, though handling it in JSON is complex.
}

interface AddVanFormProps {
  onSubmit: (data: VanData) => void; // or Promise<void> if async
  onCancel: () => void;
}

const fetchVans = async () => {
  const response = await fetch('http://localhost:8000/vans');
  const data = await response.json();
  const van_data = data["vans"] as Van[];
  return van_data;
};

const VanPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: vans, isLoading, error } = useQuery('vans', fetchVans);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleAddVanClick = () => {
    dialogRef.current?.showModal();
  };

  const createVan = async (vanData: VanData) => {
    // Convert the routeId to an integer
    try {
      console.log(JSON.stringify(vanData));
      await fetch('http://localhost:8000/vans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vanData),
      });
      await queryClient.invalidateQueries('vans');
      dialogRef.current?.close();
      // ... Handle the response ...
    } catch (error) {
      console.error('Error creating van:', error);
    }
  };
  

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <main className='p-van-page'>
      <h1>Vans</h1>
      <div className="cards-container">
        {vans?.map((van: Van) => (
          <Card title={`Van #${van.vanId}`}></Card>
        ))}
      </div>

      <button onClick={handleAddVanClick}>
        Add Van
      </button>
      <dialog ref={dialogRef}><AddVanForm onSubmit={createVan} onCancel={() => {dialogRef.current?.close()}} /></dialog>
    </main>
  );
};

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


export default VanPage;
