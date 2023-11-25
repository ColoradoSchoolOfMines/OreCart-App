import React from 'react';
import Card from '../../components/card/card';
import './alerts-page.scss';

const AlertsPage: React.FC = () => {
  return (
    <main className='p-alerts-page'>
      <h1>Alerts</h1>
      <div className="cards-container">
        <Card title="Alert #1"></Card>
        <Card title="Alert #2"></Card>
        <Card title="Alert #3"></Card>
      </div>
    </main>
  );
};

export default AlertsPage;
