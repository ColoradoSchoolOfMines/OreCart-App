# Backend Routes

## Hardware->Backend

POST `/location/{van_id}`
seperate

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
- Responses are in the format `(lat, lon, route_id, van_id, timestamp)` where
  `van_id` & `route_id` are 8-bit ints, `lat` & `lon` are 64-bit doubles, and
  `timestamp` is a UNIX timestamp
- Any response with an earlier timestamp than the most recent should be discarded
- Any timestamp more than 1 min in the future should be discarded
- Communication can be HTTP or HTTPS, but HTTPS is already being used

GET `/routes`

- Retrieves a predefined list of routes and their waypoints
- Coordinates are defined in a config file
- Responses are a JSON array of routes in the following format:

```json
[{
    name: string
    waypoints: [{
        index: int,
        stop: bool,
        name: string | undefined,
        longitude: double,
        latitude: double,
    }]
}]
```

POST `/request`

- Makes ADA request for the driver
- The handler for this will decide which van is most appropriate and send an SSE
- Request body is in the format `(lat, lon, timestamp)` where `lat` & `lon` are
  64-bit doubles describing the client's coordinates
- Any request with a timestamp more than 10 min out-of-date (or in the future)
  should be discarded
- Communication is HTTPS only

## Outages

POST `/admin/outage/{route_id}/{end_datetime}`

- `route_id` is an 8-bit integer
- `end_datetime` is a UNIX timestamp
  representing the end of the outage
- Stops reporting the location of all vans registered to a route
- Requests to a route will override any previous requests
- Adds message to all status requests
- Message authentication header is a bearer token with specific permissions
  allowing admin actions
- Communication is HTTPS only

DELETE `/admin/outage/{route_id}`

- `route_id` is an 8-bit integer
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
