# Backend Routes

## Hardware->Backend

POST `/location/{van_id}`

- `van_id` is an 8-bit integer
- Message body is `(lat, lon, timestamp)`, where `lat` & `lon` are 64-bit doubles,
  and `timestamp` is a UNIX timestamp
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
  and `timestamp` is a UNIX timestamp
- The server should discard any timestamp earlier than the most recent
- The server should discard any timestamp more than 1 min into the future
  (and add admin status message?)
- Message authentication header is a bearer token that is unique per van
- Communication is HTTPS only

GET `/request/{van_id}`

- `van_id` is an 8-bit integer
- Subscribes the hardware to SSE for ADA requests
- Responses are in the format `(lat, lon)` where `lat` & `lon` are 64-bit doubles
- Message authentication header is a bearer token that is unique per van
- Communication is HTTPS only

## Client->Backend

GET `/location`

- Subscribes the client to SSE triggered by new coordinates to any van
- Any response with an earlier timestamp than the most recent should be discarded
- Any timestamp more than 1 min in the future should be discarded
- Communication can be HTTP or HTTPS, but HTTPS is already being used
- Response body is defined in JSON as per the following typescript spec:

``typescript
interface Location {
    vanId: number,
    routeId: number,
    location: Coordinate,
    timestampMillis: number
}
``

GET `/routes`

- Retrieves a predefined list of routes and their waypoints
- Coordinates are defined in a config file
- Response body is defined in JSON as per the following typescript spec:

```typescript
interface Routes {
    routes: Route[],
    stops: Stop[]
}

interface Route {
    id: number,
    name: string,
    active: boolean,
    waypoints: Coordinate[] // Already ordered by index in backend
}

interface Stop {
    id: number,
    name: string,
    active: boolean,
    location: Coordinate
}
```

GET `/alert`

- Retrieves the currently active alert that may be disabling a stop or route.
- Alerts with start times in the future or end times in the past are discarded.
- Response body is defined in JSON as per the following typescript spec:

```typescript
interface Alert {
    body: string,
    startTimestampSecs: number,
    endTimestampSecs: number
}
```

POST `/request`

- Makes ADA request for the driver
- The handler for this will decide which van is most appropriate and send an SSE
- Any request with a timestamp more than 10 min out-of-date (or in the future)
  should be discarded
- Communication is HTTPS only
- Response body is defined in JSON as per the following typescript spec:

```typescript
interface Request {
    location: Coordinate,
    timestampSecs: number
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
type Outages = Outage[]

interface Outage {
    id: number,
    body: string,
    startTimestampSecs: number,
    endTimestampSecs: number,
    routesDisabled: number[] // Route ID list
    stopsDisabled: number[] // Stop ID list
}
```

POST `/admin/outage/`

- Schedules a route/stop outage to occur at some point in the future
- Stops reporting the location of all vans registered to a route
- Requests to a route will override any previous requests
- Adds message to all status requests
- Message authentication header is a bearer token with specific permissions
  allowing admin actions
- Communication is HTTPS only
- Can schedule an outage into the future, or schedule one now
- Request body is defined in JSON as per the following typescript spec:

```typescript
interface Outage {
    body: string,
    startTimestampSecs: number,
    endTimestampSecs: number,
    routesDisabled: number[] // Route ID list
    stopsDisabled: number[] // Stop ID list
}
```

DELETE `/admin/outage/{outage_id}`

- `outage_id` is an 8-bit integer
- Stops reporting the location of all vans registered to a route
- Adds message to all status requests
- Message authentication header is a bearer token with specific permissions
  allowing admin actions
- Communication is HTTPS only

## Status

GET `/admin/status`

- Reports status + server health info
  - Uptime
  - Current active vans (and IDs)
  - Current number of clients subscribed
  - Current ridership figures from each van
- Response body is serialized JSON w/ an array holding data per van
- Message authentication header is a bearer token with specific permissions
  allowing admin actions
- Communication is HTTPS only

GET `/admin/status/{van_id}`

- Reports detailed van status
  (is the same as `/admin/status`, but only the specified van)
  - Is van active?
  - Current ridership figures from the van
- Response body is serialized JSON
- Message authentication header is a bearer token with specific permissions
  allowing admin actions
- Communication is HTTPS only
