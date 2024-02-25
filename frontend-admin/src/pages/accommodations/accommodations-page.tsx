import { Select, Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import "./accommodations-page.scss";
import { ADARequest } from "./accomodations-types";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const fetchTodayADARequests = async () => {
  const response = await fetch(
    `${baseUrl}/ada/requests?filter=today&include=pickup_spot`
  );
  const data = await response.json();
  const alert_data = data as ADARequest[];
  return alert_data;
};

const fetchLaterADARequests = async () => {
  const response = await fetch(
    `${baseUrl}/ada/requests?filter=future&include=pickup_spot`
  );
  const data = await response.json();
  const alert_data = data as ADARequest[];
  return alert_data;
};

const AccommodationsPage: React.FC = () => {
  const [filter, setFilter] = useState("Today");
  const {
    data: todayRequests,
    isLoading: todayIsLoading,
    error: todayError,
  } = useQuery({
    queryKey: ["today-ada-requests"],
    queryFn: fetchTodayADARequests,
  });
  const {
    data: futureRequests,
    isLoading: futureIsLoading,
    error: futureError,
  } = useQuery({
    queryKey: ["future-ada-requests"],
    queryFn: fetchLaterADARequests,
  });
  if (todayIsLoading || futureIsLoading) return <div>Loading...</div>;
  if (todayError || futureError)
    return (
      <div>
        An error occurred: {(todayError ?? (futureError as Error)).message}
      </div>
    );

  const todayRows = todayRequests?.map((request: ADARequest) => (
    <Table.Tr key={request.id}>
      <Table.Td>
        {new Date(request.pickup_time * 1000).toLocaleString()}
      </Table.Td>
      <Table.Td>{request.pickup_spot.name}</Table.Td>
      <Table.Td>{request.wheelchair ? "Yes" : "No"}</Table.Td>
    </Table.Tr>
  ));

  const futureRows = futureRequests?.map((request: ADARequest) => (
    <Table.Tr key={request.id}>
      <Table.Td>
        {new Date(request.pickup_time * 1000).toLocaleString()}
      </Table.Td>
      <Table.Td>{request.pickup_spot.name}</Table.Td>
      <Table.Td>{request.wheelchair ? "Yes" : "No"}</Table.Td>
    </Table.Tr>
  ));

  return (
    <main className="p-accommodations-page">
      <h1>Accommodations</h1>
      <Select
        data={["Today", "Future"]}
        value={filter}
        onChange={(value) => setFilter(value ?? "Today")}
        allowDeselect={false}
      />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Pickup Time</Table.Th>
            <Table.Th>Pickup Spot</Table.Th>
            <Table.Th>Wheelchair Required</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{filter === "Today" ? todayRows : futureRows}</Table.Tbody>
      </Table>
    </main>
  );
};

export default AccommodationsPage;
