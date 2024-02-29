export interface ADARequest {
  id: number;
  pickup_time: number;
  pickup_spot: PickupSpot;
  wheelchair: boolean;
}

export interface PickupSpot {
  id: number;
  name: string;
  lat: number;
  lon: number;
}
