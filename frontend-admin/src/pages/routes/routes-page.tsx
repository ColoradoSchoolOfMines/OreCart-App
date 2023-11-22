import React from 'react';
import Card from '../../components/card/card';

interface RoutesPageProps {
}

const RoutesPage: React.FC<RoutesPageProps> = () => {

  return (
    <main className='p-routes-page'>
      <h1>Routes</h1>
      <div className="cards-container">
        <Card title="Route #1"></Card>
        <Card title="Route #2"></Card>
        <Card title="Route #3"></Card>
      </div>
    </main>
  );
};

export default RoutesPage;
