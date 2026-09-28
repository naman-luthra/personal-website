"use client";

import dynamic from "next/dynamic";
import type { CSSProperties } from "react";
import { techStackItems } from "./techStackItems";

const Sculpture = dynamic(() => import("./Sculpture"), { ssr: false });

export default function TechStack({ enabled }: { enabled: boolean }) {
  return (
    <div className="intro-art" aria-hidden="true">
      <div className="tech-stack-fallback">
        {techStackItems.map(({ id, name, Icon, color, x, y, size, tilt }) => (
          <span
            key={id}
            className="tech-stack-icon"
            data-tech={id}
            title={name}
            style={
              {
                "--tech-x": `${x * 100}%`,
                "--tech-y": `${y * 100}%`,
                "--tech-size": `${size}px`,
                "--tech-tilt": `${tilt}deg`,
                "--tech-color": color,
              } as CSSProperties
            }
          >
            <Icon />
          </span>
        ))}
      </div>
      <Sculpture enabled={enabled} />
    </div>
  );
}
