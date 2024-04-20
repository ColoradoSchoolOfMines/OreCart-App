import React from "react";
import "./ridership-page.scss";
import { RidershipCard } from "../../components/ridership-card/ridership-card";
import {
  Button,
  Container,
  Flex,
  Group,
  MantineProvider,
  VariantColorsResolver,
  defaultVariantColorsResolver,
} from "@mantine/core";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
        id: 0,
        name: "Golden Route",
        numPassengers: 6,
        numVans: 1,
      },
      {
        id: 1,
        name: "Mines Park",
        numVans: 0,
      },
      {
        id: 2,
        name: "Loop de Loop",
        numPassengers: 20,
        numVans: 5,
      },
    ],
    historic: [
      {
        timestamp: "August 19, 1975 23:15:30",
        "Golden Route": 10,
        "Mines Park": 5,
        "Loop de Loop": 14,
      },
      {
        timestamp: "April 19, 1975 23:15:30",
        "Golden Route": 20,
        "Mines Park": 1,
        "Loop de Loop": 14,
      },
      {
        timestamp: "April 19, 2024 5:15AM",
        "Golden Route": 30,
        "Mines Park":22,
        "Loop de Loop": 8,
      },
      {
        timestamp: "April 19, 2024 8:15AM",
        "Golden Route": 10,
        "Mines Park": 14,
        "Loop de Loop": 1,
      },
      {
        timestamp: "April 19, 2024 10:15AM",
        "Golden Route": 23,
        "Mines Park": 5,
        "Loop de Loop": 2,
      },
      {
        timestamp: "April 19, 2024 3:30PM",
        "Golden Route": 6,
        "Mines Park": 6,
        "Loop de Loop": 9,
      },
    ],
  });

  const variantColorResolver: VariantColorsResolver = (input: any) => {
    const defaultResolvedColors = defaultVariantColorsResolver(input);

    if (input.variant === "light") {
      return {
        ...defaultResolvedColors,
        color: "var(--mantine-color-black)",
      };
    }

    return defaultResolvedColors;
  };

  const [trendRange, setTrendRange] = React.useState(-1);
  const [trends, setTrends] = React.useState(new Array());

  React.useEffect(() => {
    switch (trendRange) {
      case 0:
        setTrends(
          ridership.historic.filter((current: any) => {
            return (
              new Date(current.timestamp).setHours(0, 0, 0, 0) ==
              new Date().setHours(0, 0, 0, 0)
            );
          }, [])
        );
        break;
      default:
        setTrends(ridership.historic);
    }
  }, [trendRange]);

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
      <h1>Trends</h1>
      <MantineProvider theme={{ variantColorResolver }}>
        <Group gap="xs">
          <Button
            variant={trendRange === 0 ? "light" : "default"}
            onClick={() => setTrendRange(0)}
          >
            Today
          </Button>
          <Button
            variant={trendRange === 1 ? "light" : "default"}
            onClick={() => setTrendRange(1)}
          >
            This Week
          </Button>
          <Button
            variant={trendRange === 2 ? "light" : "default"}
            onClick={() => setTrendRange(2)}
          >
            This Month
          </Button>
          <Button
            variant={trendRange === 3 ? "light" : "default"}
            onClick={() => setTrendRange(3)}
          >
            This Year
          </Button>
          <Button
            variant={trendRange === 4 ? "light" : "default"}
            onClick={() => setTrendRange(4)}
          >
            Custom
          </Button>
        </Group>
      </MantineProvider>
      <Container size="responsive" m="10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={trends}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Golden Route"
              stroke="green"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="Mines Park"
              stroke="blue"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="Loop de Loop"
              stroke="red"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Container>
    </main>
  );
};

export default RidershipPage;
