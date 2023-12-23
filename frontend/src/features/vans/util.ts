import { geoDistanceToMiles } from "../location/util";

const AVERAGE_VAN_SPEED_MPH = 20.0;

/**
 * Estimate and format the time it would take to travel a
 * latitude-longitude distance, using a guessed average van speed.
 * Note: This is where you probably want to start expanding time
 * estimates if they turn out to be too inaccurate.
 */
export function estimateTime(geoDistance: number): string {
  const distance = geoDistanceToMiles(geoDistance);
  // This is extremely naive, however for the purposes of MVP it should
  // produce... okay results. We're pretty pessimistic about the accuracy
  // here though, so take the ceiling to give us some buffer.
  const time = Math.ceil(distance / AVERAGE_VAN_SPEED_MPH);
  if (time < 1) {
    return "<1 min";
  } else {
    return `${Math.round(time)} min`;
  }
}
