import { Select, Stack, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { fetchRoutes } from "../../api/routes.ts";
import { Van } from "../../api/types.ts";
import Card from "../../components/card/card.tsx";
import "./vans-page.scss";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const fetchVans = async () => {
  const response = await fetch(`${baseUrl}/vans/`);
  const data = await response.json();
  const van_data = (data as Van[]) || [];
  return van_data;
};

const VanPage: React.FC = () => {
  const {
    data: vans,
    isLoading: vansLoading,
    error: vansError,
  } = useQuery({ queryKey: ["vans"], queryFn: fetchVans });
  const {
    data: routes,
    isLoading: routesLoading,
    error: routesError,
  } = useQuery({ queryKey: ["routes"], queryFn: fetchRoutes });

  if (vansLoading || routesLoading) return <div>Loading...</div>;
  if (vansError || routesError)
    return <div>An error occurred: {(vansError as Error).message}</div>;

  return (
    <main className="p-van-page">
      <Stack gap="md">
        <Title> Vans</Title>
        <div className="van-grid">
          {vans?.map((van: Van) => (
            <Card>
              <Title order={2}>Van #{van.id}</Title>
              <Select
                label="Assign route"
                placeholder="Pick value"
                value={routes?.find((route) => route.id === van.routeId)?.name}
                data={routes?.map((route) => route.name)}
              />
            </Card>
          ))}
        </div>
      </Stack>
    </main>
  );
};

export default VanPage;
