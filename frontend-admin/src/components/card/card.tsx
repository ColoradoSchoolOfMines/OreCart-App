import { Paper } from "@mantine/core";
import React from "react";
import "./card.scss";

interface CardProps {
  onClick?: () => void;
  children?: React.ReactNode;
}
const Card: React.FC<CardProps> = ({ children, onClick }) => {
  return (
    <Paper p="md" className="c-card" onClick={onClick}>
      <div className="card-content">{children}</div>
    </Paper>
  );
};

export default Card;
