import { ImageResponse } from "next/og";

export const alt =
  "Naman Luthra — Software Engineer at Rubrik. BITS Pilani graduate.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function SocialImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#1e1e1e",
        color: "#eceff3",
        width: "100%",
        height: "100%",
        padding: "58px 70px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 20,
        }}
      >
        <span style={{ fontSize: 35, fontWeight: 700, letterSpacing: "-2px" }}>
          Naman Luthra
        </span>
        <span style={{ color: "#a6aeb8", fontSize: 15 }}>
          SOFTWARE ENGINEER / RUBRIK
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 80,
          letterSpacing: "-4px",
          lineHeight: 1.03,
          marginTop: 64,
        }}
      >
        <span>
          Hi, I’m Naman<span style={{ color: "#3794ff" }}>.</span>
        </span>
        <span
          style={{
            fontSize: 34,
            letterSpacing: "-1px",
            color: "#a6aeb8",
            marginTop: 22,
          }}
        >
          Infrastructure, developer experience & applied AI.
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 18,
          color: "#a6aeb8",
          marginTop: 57,
          borderTop: "1px solid #ffffff30",
          paddingTop: 25,
        }}
      >
        <span>Rubrik · Previously Whatfix · BITS Pilani</span>
        <span style={{ color: "#3794ff" }}>namanluthra.me</span>
      </div>
    </div>,
    { ...size },
  );
}
