import React from 'react';
import Card from '../../components/card/card';

interface VanPageProps {
}

const VanPage: React.FC<VanPageProps> = () => {

  return (
    <main className='p-van-page'>
      <h1>Vans</h1>
      <div className="cards-container">
        <Card title="Van #1"></Card>
        <Card title="Van #2"></Card>
        <Card title="Van #3"></Card>
      </div>
    </main>
  );
};

export default VanPage;
