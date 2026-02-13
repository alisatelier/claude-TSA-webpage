import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function Icon() {
  const logoPath = join(process.cwd(), "public", "images", "logo-favicon.png");
  const logoData = readFileSync(logoPath);
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <img
          src={logoBase64}
          alt=""
          width={250}
          height={250}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    { ...size }
  );
}
