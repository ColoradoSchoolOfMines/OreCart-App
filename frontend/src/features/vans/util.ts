const AVERAGE_VAN_SPEED_MPH = 20.0;

export function estimateTime(distanceLatLon: number): number {
  // Convert latlon-based distance to miles distance
  const distance = distanceLatLon * 69.0;
  return distance / AVERAGE_VAN_SPEED_MPH;
}