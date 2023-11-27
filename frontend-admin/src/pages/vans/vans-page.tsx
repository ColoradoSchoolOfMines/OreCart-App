import React, { useEffect, useState } from 'react';
import Card from '../../components/card/card';
import './vans-page.scss';

interface Van {
  vanId: number;
  routeId: number;
  wheelchair: boolean;
}

const VanPage: React.FC = () => {
  const [vans, setVans] = useState<Van[]>([]);

  useEffect(() => {
    const fetchVans = async () => {
      const response = await fetch('http://localhost:8000/vans');
      const data = await response.json();
      const van_data = data["vans"] as Van[];
      setVans(van_data);
    };

    fetchVans();
  })


  return (
    <main className='p-van-page'>
      <h1>Vans</h1>
      <div className="cards-container">
        {vans.map((van: Van) => (
          <Card title={`Van #${van.vanId}`}></Card>
        ))}

        {/* <Card title="Van #1"></Card>
        <Card title="Van #2"></Card>
        <Card title="Van #3"></Card> */}
      </div>
    </main>
  );
};

export default VanPage;
