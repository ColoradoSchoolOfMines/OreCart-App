import { type Coordinate } from "./locationSlice";

interface ClosestCoordinate<O extends Coordinate> {
  inner: O
  distance: number;
}

export function closest<O extends Coordinate, T extends Coordinate, >(ofAll: O[], to: T): ClosestCoordinate<O> | undefined {
  if (ofAll.length === 0) {
    return undefined;
  }

  const closest: ClosestCoordinate<O> = {
    inner: ofAll[0],
    distance: distance(ofAll[0], to),
  };

  for (const o of ofAll) {
    const d = distance(o, to);
    if (d < closest.distance) {
      closest.inner = o;
      closest.distance = d;
    }
  }

  return closest;
}

export function distance(a: Coordinate, b: Coordinate): number {
  const latDiff = a.latitude - b.latitude;
  const lonDiff = a.longitude - b.longitude;
  return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
}

export function geoDistanceToMiles(distance: number): number {
  return distance * 69.0;
}
