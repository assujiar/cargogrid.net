import { ImageResponse } from "next/og";
import { siteUrl } from "../src/lib/seo";

// Serves the site's social preview card at /opengraph-image. Pages reference it
// explicitly through seo.ts rather than relying on Next's file convention to
// inject it: each page sets its own `openGraph` object, which replaces the
// parent segment's and drops any auto-injected image.
//
// Generated rather than shipped as a PNG so the wording stays editable in code
// and cannot drift out of sync with the copy it advertises.

export const alt = "CargoGrid OS — Sistem Operasi Logistik Enterprise Terintegrasi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TEAL = "#0097b2";
const ORANGE = "#ff5e14";
const SLATE = "#0f172a";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: `linear-gradient(135deg, ${SLATE} 0%, #14304a 55%, ${TEAL} 100%)`,
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 52, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
            Cargo
          </div>
          <div style={{ display: "flex", fontSize: 52, fontWeight: 800, color: ORANGE, letterSpacing: "-0.02em" }}>
            Grid
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: 20,
              padding: "8px 16px",
              borderRadius: 8,
              background: "rgba(255,255,255,0.14)",
              color: "#ffffff",
              fontSize: 18,
              letterSpacing: "0.18em",
            }}
          >
            OPERATING SYSTEM
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 66,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
            }}
          >
            Sistem Operasi Logistik
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 66,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
            }}
          >
            Enterprise Terintegrasi
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 30, color: "#cbd5e1", lineHeight: 1.4 }}>
            RFQ, Dispatch, Tracking, ePOD, Warehouse & Billing dalam satu alur.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {["Freight Forwarder", "3PL Warehouse", "Trucking"].map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  marginRight: 14,
                  padding: "10px 20px",
                  borderRadius: 999,
                  border: "2px solid rgba(255,255,255,0.28)",
                  color: "#ffffff",
                  fontSize: 22,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#ffffff", fontWeight: 700 }}>
            {new URL(siteUrl).host}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
