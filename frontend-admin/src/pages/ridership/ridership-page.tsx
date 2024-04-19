import React from "react";
import "./ridership-page.scss";
import useWebSocket, { ReadyState } from "react-use-websocket";

const RidershipPage: React.FC = () => {
  const WS_URL = import.meta.env.VITE_WEBSOCKET_URL;
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: true,
      shouldReconnect: () => true,
    }
  );

  // Run when the connection state (readyState) changes
  React.useEffect(() => {
    console.log("Connection state changed");
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        event: "subscribe",
        data: {
          channel: "ridership",
        },
      });
    }
  }, [readyState]);
  // Run when a new WebSocket message is received (lastJsonMessage)
  React.useEffect(() => {
    console.log(`Got a new message: ${lastJsonMessage}`);
  }, [lastJsonMessage]);

  return (
    <main className="p-ridership-page">
      <h1>Ridership</h1>
    </main>
  );
};

export default RidershipPage;
