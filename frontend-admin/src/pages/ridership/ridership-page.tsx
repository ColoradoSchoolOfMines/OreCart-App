import React from "react";
import "./ridership-page.scss";
import { RidershipCard } from "../../components/ridership-card/ridership-card";
import { Flex } from "@mantine/core";
// import useWebSocket, { ReadyState } from "react-use-websocket";

const RidershipPage: React.FC = () => {
  // const baseSocketUrl = import.meta.env.VITE_WEBSOCKET_URL + "/ridership";
  // const [socketUrl, setSocketUrl] = React.useState(baseSocketUrl + "/subscribe");
  // const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
  //   socketUrl,
  //   {
  //     share: true,
  //     shouldReconnect: () => true,
  //   }
  // );

  // // Run when the connection state (readyState) changes
  // React.useEffect(() => {
  //   console.log("Connection state changed");
  //   if (readyState === ReadyState.OPEN) {
  //     sendJsonMessage({
  //       event: "subscribe"
  //     });
  //   }
  // }, [readyState]);
  // // Run when a new WebSocket message is received (lastJsonMessage)
  // React.useEffect(() => {
  //   console.log(`Got a new message: ${lastJsonMessage}`);
  // }, [lastJsonMessage]);

  const [ridership, setRidership] = React.useState({
    routes: [
      {
        id: 3,
        name: "Golden Route",
        numPassengers: 6,
        numVans: 1,
      },
      {
        id: 3,
        name: "Mines Park",
        numVans: 0,
      },
      {
        id: 3,
        name: "Loop de Loop",
        numPassengers: 20,
        numVans: 5,
      },
    ],
  });

  return (
    <main className="p-ridership-page">
      <h1>Ridership</h1>
      <Flex wrap="wrap" direction="row" gap="md" justify="center">
        {ridership.routes.map((route) => (
          <RidershipCard
            key={route.id}
            name={route.name}
            numVans={route.numVans}
            numPassengers={route.numPassengers}
          />
        ))}
      </Flex>
    </main>
  );
};

export default RidershipPage;
