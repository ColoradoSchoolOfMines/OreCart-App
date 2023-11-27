import React from 'react';
import { useQuery } from 'react-query';
import Card from '../../components/card/card';
import './routes-page.scss';

interface Route {
  id: number;
  name: string;
}

const fetchRoutes = async () => {
  const response = await fetch('http://localhost:8000/routes');
  const data = await response.json();
  const route_data = data as Route[];
  return route_data;
}

const RoutesPage: React.FC = () => {
  const { data: routes, isLoading, error } = useQuery('routes', fetchRoutes);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <main className='p-routes-page'>
      <h1>Routes</h1>
      <div className="cards-container">
        {routes?.map((route: Route) => (
          <Card title={route.name}></Card>
        ))}
      </div>
    </main>
  );
};

export default RoutesPage;
