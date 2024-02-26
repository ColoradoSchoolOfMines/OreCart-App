import { Paper } from "@mantine/core";
import React from "react";
import "./card.scss";

interface CardProps {
  title: string;
  onClick?: () => void;
  children?: React.ReactNode;
}
const Card: React.FC<CardProps> = ({ title, onClick, children }) => {
  return (
    <Paper
      withBorder
      onClick={onClick}
      p="md"
      shadow="xs"
      className="c-card
    "
    >
      <h2>{title}</h2>
      <div className="card-content">{children}</div>
    </Paper>
  );
};

export default Card;
