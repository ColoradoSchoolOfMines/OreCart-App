import React, { useState } from 'react';
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
  const [isPopupOpen, setPopupOpen] = useState(false);

  const handleAddVanClick = () => {
    setPopupOpen(true);
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
      setPopupOpen(false);
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
      {isPopupOpen && <AddVanForm onSubmit={createVan} />}
    </main>
  );
};

const AddVanForm: React.FC<AddVanFormProps> = ({ onSubmit }) => {
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
        <label>
          Wheelchair Accessible:
          <input type="checkbox" name="wheelchair" />
        </label>
        <button type="submit">Create Van</button>
      </form>
    </div>
  );
};


export default VanPage;
