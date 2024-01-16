import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import Card from '../../components/card/card';
import AddVanForm from './add-van-form.tsx';
import VanEditForm from './edit-van-form.tsx';
import { Van, VanData, VanEditFormMethods } from './van-types.tsx';
import './vans-page.scss';
import jwtFetch from '../../jwt-fetch';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const fetchVans = async () => {
  const response = await jwtFetch(`${baseUrl}/vans/`);
  const data = await response.json();
  const van_data = data as Van[] || [];
  return van_data;
};

const VanPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: vans, isLoading, error } = useQuery({ queryKey: ['vans'], queryFn: fetchVans });
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
      await jwtFetch(`${baseUrl}/vans/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vanData),
      });
      await queryClient.invalidateQueries({ queryKey: ['vans'] });
      dialogRef.current?.close();
      // ... Handle the response ...
    } catch (error) {
      console.error('Error creating van:', error);
    }
  };

  const openVanEditForm = (vanId: number) => {
    dialogEditRef.current?.showModal();
    setCurrentVanId(vanId);
    vanEditFormRef.current?.clearForm();
    const van = vans?.find((van) => van.id === vanId);
    if (van) {
      vanEditFormRef.current?.setData(van);
    }
  };

  const editVanSubmit = async (vanData: VanData) => {
    // Convert the routeId to an integer
    try {
      await jwtFetch(`${baseUrl}/vans/${currentVanId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vanData),
      });
      await queryClient.invalidateQueries({ queryKey: ['vans'] });
      setCurrentVanId(-1);
      dialogEditRef.current?.close();
      // ... Handle the response ...
    } catch (error) {
      console.error('Error creating van:', error);
    }
  };

  const deleteVan = async () => {
    try {
      await jwtFetch(`${baseUrl}/vans/${currentVanId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      await queryClient.invalidateQueries({ queryKey: ['vans'] });
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
          <Card title={`Van #${van.id}`} onClick={() => {openVanEditForm(van.id)}} key={van.id}></Card>
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

export default VanPage;
