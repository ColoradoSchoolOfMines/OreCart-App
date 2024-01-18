import * as d3 from "d3";
import React from "react";
import { Path, Svg } from "react-native-svg";

/**
 * Props for the {@class Pie} component.
 */
interface PieProps {
  /** The colors to display in the view. */
  colors: string[];
}

/**
 * Displays a pie chart-like view with equal-size portions consisting of the given colors.
 */
const Pie = ({ colors }: PieProps): React.JSX.Element => {
  const pie = d3.pie()(colors.map(() => 1 / colors.length));
  const arcGenerator: (color: string) => string | undefined = d3
    .arc()
    .innerRadius(0)
    .outerRadius(50);

  return (
    <Svg height="100%" width="100%" viewBox="-50 -50 100 100">
      {pie.map((arc: string, index: number) => (
        <Path key={index} d={arcGenerator(arc)} fill={colors[index]} />
      ))}
    </Svg>
  );
};

export default Pie;
