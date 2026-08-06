import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { siteUrl } from "../src/lib/seo";

// Serves the site's social preview card at /opengraph-image. Pages reference it
// explicitly through seo.ts rather than relying on Next's file convention to
// inject it: each page sets its own `openGraph` object, which replaces the
// parent segment's and drops any auto-injected image.
//
// Generated rather than shipped as a PNG so the wording stays editable in code
// and cannot drift out of sync with the copy it advertises.

export const alt = "CargoGrid OS - Sistem Operasi Logistik Enterprise Terintegrasi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Pinned to build time because the card reads the logo off disk: public/ is
// present while building, but not necessarily inside a serverless bundle if
// Next ever decided to render this per-request.
export const dynamic = "force-static";

// Pulled from src/index.css so the card reads as part of the site rather than
// as a separate asset. The surface is the same light neumorphic palette the UI
// is built on -- raised panels lit from the top-left, never a flat dark slab.
const SURFACE = "#eef2f6";
const SHADOW_DARK = "#cdd4db";
const SHADOW_LIGHT = "#ffffff";
const TEAL = "#0097b2";
const ORANGE = "#cb3421";
const INK = "#0f172a";
const MUTED = "#4a5c6e";

const raised = (blur: number, offset: number) =>
  `${offset}px ${offset}px ${blur}px ${SHADOW_DARK}, -${offset}px -${offset}px ${blur}px ${SHADOW_LIGHT}`;

// Split into explicit rows rather than left to wrap: flex-wrap packs these
// 4 + 1, which reads as an afterthought hanging off the end. Short names
// together on top, the two compound ones below, keeps both rows balanced.
const MODULE_ROWS = [
  ["Commercial", "Financial", "HRIS"],
  ["Operation · TMS & WMS", "Executive Dashboard & Analytics"],
];

export default async function Image() {
  // Read at build time (this route is statically prerendered) so the card uses
  // the same logo file the site and the Organization JSON-LD point at.
  const logo = await readFile(path.join(process.cwd(), "public", "cargogrid_vertical.svg"));
  const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: SURFACE,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Same teal-to-emerald rule that caps the lead capture panel. */}
        <div
          style={{
            display: "flex",
            height: 10,
            width: "100%",
            background: `linear-gradient(90deg, ${TEAL} 0%, #34d399 100%)`,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            padding: "34px 68px 50px 68px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <img src={logoSrc} width={208} height={156} alt="" style={{ marginLeft: -14 }} />
            <div
              style={{
                display: "flex",
                padding: "14px 26px",
                borderRadius: 999,
                background: SURFACE,
                boxShadow: raised(14, 6),
                color: MUTED,
                fontSize: 19,
                fontWeight: 700,
                letterSpacing: "0.16em",
              }}
            >
              OPERATING SYSTEM
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 60,
                fontWeight: 800,
                color: INK,
                lineHeight: 1.12,
                letterSpacing: "-0.03em",
              }}
            >
              Sistem Operasi Logistik
            </div>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 60,
                  fontWeight: 800,
                  color: TEAL,
                  lineHeight: 1.12,
                  letterSpacing: "-0.03em",
                }}
              >
                Enterprise
              </div>
              <div
                style={{
                  display: "flex",
                  marginLeft: 16,
                  fontSize: 60,
                  fontWeight: 800,
                  color: INK,
                  lineHeight: 1.12,
                  letterSpacing: "-0.03em",
                }}
              >
                Terintegrasi
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {MODULE_ROWS.map((row, rowIndex) => (
              <div key={rowIndex} style={{ display: "flex", marginBottom: rowIndex === 0 ? 16 : 0 }}>
                {row.map((label, i) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: 16,
                      padding: "16px 28px",
                      borderRadius: 18,
                      background: SURFACE,
                      boxShadow: raised(14, 6),
                      color: INK,
                      fontSize: 25,
                      fontWeight: 700,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        width: 10,
                        height: 10,
                        borderRadius: 999,
                        marginRight: 14,
                        background: (rowIndex + i) % 2 === 0 ? TEAL : ORANGE,
                      }}
                    />
                    {label}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", fontSize: 24, color: MUTED }}>
              Freight Forwarder · 3PL Warehouse · Trucking · Corporate Shipper
            </div>
            <div style={{ display: "flex", fontSize: 25, color: TEAL, fontWeight: 800 }}>
              {new URL(siteUrl).host}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
