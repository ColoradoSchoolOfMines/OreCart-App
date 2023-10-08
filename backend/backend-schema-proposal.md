# Backend Routes

## Hardware->Backend

POST `/location/{van_id}`

- `van_id` is an 8-bit integer
- Message body is `(lat, lon, timestamp)`, where `lat` & `lon` are 64-bit doubles,
  and `timestamp` is a UNIX timestamp in milliseconds
  - This minimizes network usage
- The server should discard any timestamp earlier than the most recent
- The server should discard any timestamp more than 1 min into the future
  (and add admin status message?)
- The handler for this will trigger an SSE sent to all subscribed clients
- Message authentication header is a bearer token that is unique per van
- Communication is HTTPS only

POST `/stats/ridership/{van_id}`

- `van_id` is an 8-bit integer
- Request body is `(ridership, timestamp)`, where `ridership` is an 8-bit int
  and `timestamp` is a UNIX timestamp in milliseconds
- The server should discard any timestamp earlier than the most recent
- The server should discard any timestamp more than 1 min into the future
  (and add admin status message?)
- Message authentication header is a bearer token that is unique per van
- Communication is HTTPS only

GET `/request/{van_id}`

- `van_id` is an 8-bit integer
- Subscribes the hardware to SSE for ADA requests
- Responses are in the format `(lat, lon, timestamp)` where `lat` & `lon` are
  64-bit doubles and `timestamp` is a 64-bit UNIX timestamp in milliseconds
- Message authentication header is a bearer token that is unique per van
- Communication is HTTPS only

## Client->Backend

GET `/location`

- Subscribes the client to SSE triggered by new coordinates to any van
- Any response with an earlier timestamp than the most recent should be discarded
- Excessive time drifting will be detected on backend and reported in admin panel
- Any timestamp more than 1 min in the future should be discarded
- Communication can be HTTP or HTTPS, but HTTPS is already being used
- Response body is defined in JSON as per the following typescript spec:

```typescript
interface Location {
  vanId: number;
  routeId: number;
  location: Coordinate;
  timestamp: Date;
}
```

GET `/dashboard`

- Retrieves all data to show on the main screen of the frontend
- Coordinates are defined in a config file
- Alerts with start times in the future or end times in the past are discarded
- Response body is defined in JSON as per the following typescript spec:

```typescript
interface Dashboard {
  routes: Route[];
  stops: Stop[];
  alert: Alert | null;
}

interface Alert {
  body: string;
  startTimestamp: Date;
  endTimestamp: Date;
}

interface Route {
  id: number;
  name: string;
  active: boolean;
  waypoints: Coordinate[]; // Already ordered by index in backend
}

interface Stop {
  id: number;
  name: string;
  active: boolean;
  location: Coordinate;
}
```

POST `/request`

- Makes ADA request for the driver
- The handler for this will decide which van is most appropriate and send an SSE
- Any request with a timestamp more than 10 min out-of-date (or in the future)
  should be discarded
- Communication is HTTPS only
- Request body is defined in JSON as per the following typescript spec:

```typescript
interface Request {
  location: Coordinate;
  timestamp: Date;
}
```

## Outages

GET `/admin/outage`

- Gets all scheduled route/stop outages to occur at some point in the future
- Stops reporting the location of all vans registered to a route
- Requests to a route will override any previous requests
- Adds message to all status requests
- Message authentication header is a bearer token with specific permissions
  allowing admin actions
- Can schedule an outage into the future, or schedule one now
- Response body is defined in JSON as per the following typescript spec:

```typescript
type Outages = Outage[];

interface Outage {
  id: number;
  body: string;
  startTimestamp: Date;
  endTimestamp: Date;
  routesDisabled: number[]; // Route ID list
  stopsDisabled: number[]; // Stop ID list
}
```

POST `/admin/outages/`

- Schedules a route/stop outage to occur at some point in the future
- Stops reporting the location of all vans registered to a route or stop
- Requests to a route will override any previous requests
- Adds message to all status requests
- Message authentication header is a bearer token with specific permissions
  allowing admin actions
- Communication is HTTPS only
- Can schedule an outage into the future, or schedule one now
- Request body is defined in JSON as per the following typescript spec:

```typescript
interface Outage {
  body: string;
  startTimestamp: Date;
  endTimestamp: Date;
  routesDisabled: number[]; // Route ID list
  stopsDisabled: number[]; // Stop ID list
}
```

DELETE `/admin/outages/{outage_id}`

- `outage_id` is an 8-bit integer
- Stops reporting the location of all vans registered to a route
- Adds message to all status requests
- Message authentication header is a bearer token with specific permissions
  allowing admin actions
- Communication is HTTPS only

## Vans

GET `/admin/vans`

- Reports current active vans (and assigned route IDs)
- Message authentication header is a bearer token with specific permissions
  allowing admin actions
- Communication is HTTPS only
- Response body is defined in JSON as per the following typescript spec:

```typescript
type Vans = Van[];

interface Van {
  id: number;
  routes: number[]; // Route ID list, empty if not running
}
```

POST `/admin/vans/{van_id}`

- Change assigned routes of specified van
- Message authentication header is a bearer token with specific permissions
  allowing admin actions
- Communication is HTTPS only
- Request body is defined in JSON as per the following typescript spec:

```typescript
type Van = number[]; // Route ID list, empty if not running
```

GET `/stats/ridership/{van_id}`

- Gets ridership information from the van with the specified ID
- This is likely an expensive calculation, hence why it's in its own route
- Message authentication header is a bearer token with specific permissions
  allowing admin actions
- Communication is HTTPS only
- Response body is defined in JSON as per the following typescript spec:

```typescript
// NOTE: Not final format, unsure exactly what we should be calculating or
whether we want to directly provide each datapoint to stakeholders
type Ridership = RidershipLog[];

interface RidershipEntry {
  timestamp: Date;
  location: Coordinate;
  entered: number;
  exited: number;
}
```

## Status

GET `/admin/status`

- Reports status + server health info
  - Uptime
  - Current number of clients subscribed
- Response body is serialized JSON w/ an array holding data per van
- Message authentication header is a bearer token with specific permissions
  allowing admin actions
- Communication is HTTPS only
