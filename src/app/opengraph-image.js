import { ImageResponse } from "next/og";

// Social share image (1200 x 630), generated at build time.
export const alt = "Hacaden: one gift, every hand in it.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#2B1A17";
const CORAL = "#FF6B4A";
const GOLD = "#FFC233";
const TEAL = "#1A6B6B";
const BERRY = "#D6336C";
const SKY = "#8FD3F4";

export default function OpengraphImage() {
  const dots = [GOLD, CORAL, TEAL, BERRY, SKY];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#FFF6E8",
        padding: 64,
        color: INK,
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 54,
          fontWeight: 800,
          letterSpacing: -2,
        }}
      >
        haca<span style={{ color: CORAL }}>den</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 108,
            fontWeight: 800,
            letterSpacing: -4,
            lineHeight: 1,
          }}
        >
          One gift.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 108,
            fontWeight: 800,
            letterSpacing: -4,
            lineHeight: 1.05,
          }}
        >
          Every&nbsp;
          <span
            style={{
              display: "flex",
              background: GOLD,
              padding: "0 18px",
              borderRadius: 14,
            }}
          >
            hand
          </span>
          &nbsp;in it.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: TEAL,
            fontWeight: 700,
          }}
        >
          Group gifts, made together.
        </div>
        <div style={{ display: "flex" }}>
          {dots.map((c, i) => (
            <div
              key={i}
              style={{
                width: 64,
                height: 64,
                borderRadius: 64,
                background: c,
                border: `5px solid ${INK}`,
                marginLeft: i === 0 ? 0 : -16,
              }}
            />
          ))}
        </div>
      </div>
    </div>,
    { ...size },
  );
}
