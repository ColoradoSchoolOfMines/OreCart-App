import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
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
}

interface AddVanFormProps {
  onSubmit: (data: VanData) => void; // or Promise<void> if async
  onCancel: () => void;
}

interface EditVanProps {
  onSubmit: (data: VanData) => void; // or Promise<void> if async
  onDelete: () => void;
  onCancel: () => void;
}

interface VanEditFormMethods {
  setData: (van: Van) => void;
}

const fetchVans = async () => {
  const response = await fetch('http://localhost:8000/vans/');
  const data = await response.json();
  const van_data = data["vans"] as Van[];
  return van_data;
};

const VanPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: vans, isLoading, error } = useQuery('vans', fetchVans);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogEditRef = useRef<HTMLDialogElement>(null);
  const [ currentVanId, setCurrentVanId ] = useState<number>(-1);
  const vanEditFormRef = useRef<VanEditFormMethods>(null);

  const handleAddVanClick = () => {
    dialogRef.current?.showModal();
  };

  const createVan = async (vanData: VanData) => {
    // Convert the routeId to an integer
    try {
      console.log(JSON.stringify(vanData));
      await fetch('http://localhost:8000/vans/', {
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

  const openVanEditForm = (vanId: number) => {
    dialogEditRef.current?.showModal();
    setCurrentVanId(vanId);
    const van = vans?.find((van) => van.vanId === vanId);
    if (van) {
      vanEditFormRef.current?.setData(van);
    }
  };

  const editVanSubmit = async (vanData: VanData) => {
    // Convert the routeId to an integer
    try {
      console.log(JSON.stringify(vanData));
      await fetch(`http://localhost:8000/vans/${currentVanId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vanData),
      });
      await queryClient.invalidateQueries('vans');

      setCurrentVanId(-1);
      dialogEditRef.current?.close();
      // ... Handle the response ...
    } catch (error) {
      console.error('Error creating van:', error);
    }
  };

  const deleteVan = async () => {
    try {
      await fetch(`http://localhost:8000/vans/${currentVanId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      await queryClient.invalidateQueries('vans');

      setCurrentVanId(-1);
      dialogEditRef.current?.close();
  
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
          <Card title={`Van #${van.vanId}`} onClick={() => {openVanEditForm(van.vanId)}} key={van.vanId}></Card>
        ))}
      </div>

      <button onClick={handleAddVanClick}>
        Add Van
      </button>
      <dialog ref={dialogRef}><AddVanForm onSubmit={createVan} onCancel={() => {dialogRef.current?.close()}} /></dialog>
      <dialog ref={dialogEditRef}>
        <VanEditForm ref={vanEditFormRef} onSubmit={editVanSubmit} onCancel={() => {dialogEditRef.current?.close()}} onDelete={deleteVan}></VanEditForm>
      </dialog>
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

interface VanEditFormRef {
  setData: (van: Van) => void;
}

const VanEditForm = forwardRef<VanEditFormRef, EditVanProps>( ({ onSubmit, onDelete, onCancel}, ref) => {

  const routeIdRef = useRef<HTMLInputElement>(null);
  const wheelchairRef = useRef<HTMLInputElement>(null);

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

  const setData = (van: Van) => {
    routeIdRef.current!.value = van.routeId.toString();
    wheelchairRef.current!.checked = van.wheelchair;
  };

  useImperativeHandle(ref, () => ({
    setData
  }));

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Route ID:
          <input type="number" name="routeId" ref={routeIdRef} required />
        </label>
        <br />
        <label>
          Wheelchair Accessible:
          <input type="checkbox" name="wheelchair" ref={wheelchairRef} />
        </label>
        <br />
        <button type="submit">Change Van</button>
        <button type="button" onClick={onDelete}>Delete Van</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
});


export default VanPage;
