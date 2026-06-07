import { ImageResponse } from "next/og";

// Apple touch icon (and any platform that prefers a raster icon). Rendered as a
// real PNG at request time so we ship a crisp branded mark without committing a
// binary. iOS masks the corners itself, so we fill the full square with the
// brand green and let the lime bolt sit centered.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const bolt =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
  '<path d="M18.6 4.8 L9.4 17.6 H14.9 L13.4 27.2 L22.6 14.4 H17.1 Z" ' +
  'fill="#C8E66A" stroke="#C8E66A" stroke-width="1.1" stroke-linejoin="round"/></svg>';

export default function AppleIcon() {
  const src = `data:image/svg+xml;base64,${Buffer.from(bolt).toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#142210",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width={120} height={120} src={src} alt="" />
      </div>
    ),
    { ...size }
  );
}
