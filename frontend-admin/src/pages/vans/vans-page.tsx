import { Paper, Stack, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Van } from "./van-types.tsx";
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
    isLoading,
    error,
  } = useQuery({ queryKey: ["vans"], queryFn: fetchVans });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <main className="p-van-page">
      <Stack gap="md">
        <Title> Vans</Title>
        <div className="van-grid">
          {vans?.map((van: Van) => (
            <Paper
              p="md"
              shadow="xs"
              className="van-card"
            >
              <Title order={2}>Van #{van.id}</Title>
            </Paper>
          ))}
        </div>
      </Stack>
    </main>
  );
};

export default VanPage;
