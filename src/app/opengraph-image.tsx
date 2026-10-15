import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "OneCompilerHub — Online Code Editor & Developer Workspace";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B0F19",
          backgroundImage:
            "linear-gradient(to bottom, #0E1626, #0B0F19)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "60px 80px",
          position: "relative",
        }}
      >
        {/* Brand Pill Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "rgba(67, 91, 255, 0.15)",
            border: "1px solid rgba(67, 91, 255, 0.4)",
            borderRadius: "9999px",
            padding: "8px 20px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#435BFF",
            }}
          />
          <span
            style={{
              color: "#93A5FF",
              fontSize: "18px",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Developer Platform &amp; Workspaces
          </span>
        </div>

        {/* Main Logo & Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <span
            style={{
              fontSize: "64px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
            }}
          >
            OneCompiler
          </span>
          <span
            style={{
              fontSize: "64px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#8B5CF6",
            }}
          >
            Hub
          </span>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "26px",
            color: "#94A3B8",
            textAlign: "center",
            maxWidth: "850px",
            lineHeight: 1.4,
            margin: 0,
            marginBottom: "40px",
          }}
        >
          Online Code Editor &amp; Developer Workspace across 18 Programming
          Languages, Web Stacks &amp; Databases.
        </p>

        {/* Feature Pills */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            alignItems: "center",
          }}
        >
          {[
            "18 Languages & Stacks",
            "HTML/CSS/JS Live Preview",
            "Monaco Code Editor",
            "Zero Installation",
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "rgba(30, 41, 59, 0.8)",
                border: "1px solid rgba(51, 65, 85, 0.8)",
                borderRadius: "10px",
                padding: "8px 16px",
                color: "#E2E8F0",
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
