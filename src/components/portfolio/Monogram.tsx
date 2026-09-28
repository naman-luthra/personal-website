import type { SVGProps } from "react";
import { monogramPaths, monogramViewBox } from "./monogramPaths";

export default function Monogram(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox={monogramViewBox}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      {monogramPaths.map((path, index) => (
        <path key={index} {...path} />
      ))}
    </svg>
  );
}
