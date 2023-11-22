
import React from 'react';
import './Card.scss';

interface CardProps {
  title: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, onClick, children }) => {
  return (
    <div className="c-card" onClick={onClick}>
      <h2>{title}</h2>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;
