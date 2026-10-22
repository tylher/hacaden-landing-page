import { ImageResponse } from "next/og";

// Browser tab icon. To use your real logo instead, delete this file and put
// a square icon.png (at least 64 x 64) in the app/ folder.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FF6B4A",
        border: "5px solid #2B1A17",
        borderRadius: 18,
        color: "#2B1A17",
        fontSize: 42,
        fontWeight: 800,
      }}
    >
      h
    </div>,
    { ...size },
  );
}
