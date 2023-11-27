import React from 'react';
import { useQuery } from 'react-query';
import Card from '../../components/card/card';
import './vans-page.scss';

interface Van {
  vanId: number;
  routeId: number;
  wheelchair: boolean;
}

const fetchVans = async () => {
  const response = await fetch('http://localhost:8000/vans');
  const data = await response.json();
  const van_data = data["vans"] as Van[];
  return van_data;
};

const VanPage: React.FC = () => {
  const { data: vans, isLoading, error } = useQuery('vans', fetchVans);

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
    </main>
  );
};

export default VanPage;
