import { QueryClient } from "@tanstack/react-query";
import { Stop } from "../pages/routes/route-types";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

export const getKML = async () => {
  const response = await fetch(`${baseUrl}/routes/kmlfile`);
  const data = await response.json();
  const kml = atob(data.base64);

  const element = document.createElement("a");
  const file = new Blob([kml], {
    type: "application/vnd.google-earth.kml+xml",
  });
  element.href = URL.createObjectURL(file);
  element.download = "routes.kml";
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
};

export const clearRoutes = async (queryClient: QueryClient) => {
  try {
    const response = await fetch(`${baseUrl}/routes/`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    // Handle the successful response
    await queryClient.invalidateQueries({ queryKey: ["routes"] });
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

export const fetchStops = async (routeId: number) => {
  const response = await fetch(`${baseUrl}/routes/${routeId}/stops`);
  const data = await response.json();
  const stops_data = (data as Stop[]) || [];
  return stops_data;
};
