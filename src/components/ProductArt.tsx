/**
 * Simple flat illustrations used as product imagery until real photography is added.
 * Drop a photo in /public and set `image` on the product to replace them.
 */
export type ArtKind =
  | "apron-bib"
  | "apron-cross"
  | "apron-waist"
  | "jacket"
  | "jacket-short"
  | "pants"
  | "hat"
  | "knife"
  | "knife-roll"
  | "whisk"
  | "tongs"
  | "spatula"
  | "ladle";

function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const f = (c: number) => clamp(amount < 0 ? c * (1 + amount) : c + (255 - c) * amount);
  const r = f(n >> 16);
  const g = f((n >> 8) & 255);
  const b = f(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const lum = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return lum > 170;
}

const STEEL = "#b9bdc2";
const STEEL_DARK = "#8a8f95";
const LEATHER = "#8a5a36";
const BRASS = "#c39a4a";

export default function ProductArt({
  kind,
  color,
  className,
}: {
  kind: ArtKind;
  color: string;
  className?: string;
}) {
  const dark = shade(color, -0.25);
  const line = isLight(color) ? shade(color, -0.2) : shade(color, 0.25);
  const stitch = { stroke: line, strokeWidth: 2, strokeDasharray: "5 5", fill: "none" } as const;

  let body: React.ReactNode;

  switch (kind) {
    case "apron-bib":
    case "apron-cross": {
      const cross = kind === "apron-cross";
      body = (
        <>
          {cross ? (
            <g stroke={LEATHER} strokeWidth="12" strokeLinecap="round" fill="none">
              <path d="M172 82 L150 30" />
              <path d="M228 82 L250 30" />
            </g>
          ) : (
            <path d="M172 82 C168 22 232 22 228 82" stroke={dark} strokeWidth="10" fill="none" />
          )}
          {!cross && <rect x="218" y="40" width="16" height="12" rx="2" fill={BRASS} />}
          <path d="M108 168 C80 176 66 196 58 228" stroke={dark} strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M292 168 C320 176 334 196 342 228" stroke={dark} strokeWidth="8" fill="none" strokeLinecap="round" />
          <path
            d="M162 78 L238 78 L244 152 C268 158 290 162 302 168 L292 352 Q200 366 108 352 L98 168 C110 162 132 158 156 152 Z"
            fill={color}
          />
          <path
            d="M170 88 L230 88 L235 158 C260 164 280 168 291 174 L282 342 Q200 354 118 342 L109 174 C120 168 140 164 165 158 Z"
            {...stitch}
          />
          <rect x="150" y="226" width="100" height="62" rx="6" fill={dark} opacity="0.35" />
          <line x1="200" y1="226" x2="200" y2="288" stroke={line} strokeWidth="2" />
          <rect x="182" y="104" width="36" height="30" rx="4" fill={dark} opacity="0.3" />
          {cross && <rect x="270" y="190" width="14" height="40" rx="3" fill={LEATHER} />}
        </>
      );
      break;
    }
    case "apron-waist":
      body = (
        <>
          <path d="M88 132 C64 144 54 170 50 200" stroke={dark} strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M312 132 C336 144 346 170 350 200" stroke={dark} strokeWidth="8" fill="none" strokeLinecap="round" />
          <rect x="84" y="118" width="232" height="26" rx="4" fill={dark} />
          <path d="M94 144 L306 144 L298 320 Q200 334 102 320 Z" fill={color} />
          <path d="M104 154 L296 154 L289 310 Q200 322 111 310 Z" {...stitch} />
          <rect x="116" y="196" width="168" height="62" rx="6" fill={dark} opacity="0.35" />
          <line x1="172" y1="196" x2="172" y2="258" stroke={line} strokeWidth="2" />
          <line x1="228" y1="196" x2="228" y2="258" stroke={line} strokeWidth="2" />
        </>
      );
      break;
    case "jacket":
    case "jacket-short": {
      const short = kind === "jacket-short";
      body = (
        <>
          {short ? (
            <>
              <path d="M136 82 L72 126 L88 182 L128 166 Z" fill={dark} />
              <path d="M264 82 L328 126 L312 182 L272 166 Z" fill={dark} />
            </>
          ) : (
            <>
              <path d="M136 82 L76 120 L54 262 L92 270 L112 164 Z" fill={dark} />
              <path d="M264 82 L324 120 L346 262 L308 270 L288 164 Z" fill={dark} />
            </>
          )}
          <path d="M136 82 L172 66 Q200 84 228 66 L264 82 L290 160 L294 342 L106 342 L110 160 Z" fill={color} />
          <path d="M170 64 Q200 82 230 64 L232 50 Q200 68 168 50 Z" fill={dark} />
          {short ? (
            <>
              <line x1="200" y1="78" x2="200" y2="342" stroke={line} strokeWidth="2" />
              {[120, 165, 210, 255, 300].map((y) => (
                <circle key={y} cx="208" cy={y} r="4" fill={line} />
              ))}
            </>
          ) : (
            <>
              <path d="M232 70 L240 342" stroke={line} strokeWidth="2" fill="none" />
              {[118, 162, 206, 250, 294].map((y) => (
                <g key={y}>
                  <circle cx="186" cy={y} r="6" fill={line} />
                  <circle cx="254" cy={y} r="6" fill={line} />
                </g>
              ))}
            </>
          )}
          <rect x="128" y="120" width="34" height="6" rx="3" fill={line} />
        </>
      );
      break;
    }
    case "pants":
      body = (
        <>
          <defs>
            <pattern id={`check-${color.slice(1)}`} width="14" height="14" patternUnits="userSpaceOnUse">
              <rect width="14" height="14" fill="#f2f0ea" />
              <rect width="7" height="7" fill={color} />
              <rect x="7" y="7" width="7" height="7" fill={color} />
            </pattern>
          </defs>
          <path d="M128 78 L272 78 L290 348 L216 348 L200 170 L184 348 L110 348 Z" fill={`url(#check-${color.slice(1)})`} />
          <rect x="126" y="62" width="148" height="24" rx="4" fill={color} />
          <path d="M196 86 L190 120 M204 86 L210 120" stroke="#f2f0ea" strokeWidth="3" strokeLinecap="round" />
        </>
      );
      break;
    case "hat":
      body = (
        <>
          <circle cx="146" cy="150" r="58" fill={color} />
          <circle cx="254" cy="150" r="58" fill={color} />
          <circle cx="200" cy="120" r="70" fill={color} />
          <circle cx="146" cy="150" r="58" fill="none" stroke={line} strokeWidth="2" />
          <circle cx="254" cy="150" r="58" fill="none" stroke={line} strokeWidth="2" />
          <path d="M130 170 L270 170 L262 262 L138 262 Z" fill={color} />
          {[156, 178, 200, 222, 244].map((x) => (
            <line key={x} x1={x} y1="172" x2={x + (x - 200) * 0.05} y2="260" stroke={line} strokeWidth="2" />
          ))}
          <rect x="128" y="258" width="144" height="40" rx="6" fill={shade(color, -0.06)} stroke={line} strokeWidth="2" />
        </>
      );
      break;
    case "knife":
      body = (
        <g transform="rotate(-28 200 200)">
          <defs>
            <linearGradient id="blade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e3e5e8" />
              <stop offset="1" stopColor={STEEL_DARK} />
            </linearGradient>
          </defs>
          <path d="M168 182 L332 192 Q350 194 360 198 Q322 232 228 236 L168 236 Z" fill="url(#blade)" />
          <path d="M168 230 L228 230 Q300 228 350 202" stroke="#f6f7f8" strokeWidth="2" fill="none" />
          <rect x="154" y="186" width="16" height="46" rx="3" fill={STEEL_DARK} />
          <rect x="44" y="192" width="114" height="34" rx="12" fill={color} />
          {[78, 108, 136].map((x) => (
            <circle key={x} cx={x} cy="209" r="4.5" fill={STEEL} />
          ))}
        </g>
      );
      break;
    case "knife-roll":
      body = (
        <>
          {[
            { x: 108, h: 70, c: "#3a2a20" },
            { x: 138, h: 92, c: "#5b3b28" },
            { x: 168, h: 60, c: "#222" },
            { x: 198, h: 104, c: "#5b3b28" },
            { x: 228, h: 78, c: "#3a2a20" },
            { x: 258, h: 66, c: "#222" },
          ].map((k) => (
            <rect key={k.x} x={k.x} y={170 - k.h} width="20" height={k.h + 20} rx="6" fill={k.c} />
          ))}
          <rect x="80" y="160" width="240" height="170" rx="12" fill={color} />
          <rect x="92" y="172" width="216" height="146" rx="8" {...stitch} />
          {[130, 160, 190, 220, 250, 280].map((x) => (
            <line key={x} x1={x - 4} y1="180" x2={x - 4} y2="250" stroke={line} strokeWidth="2" />
          ))}
          <rect x="80" y="262" width="240" height="68" rx="0" fill={dark} opacity="0.3" />
          <path d="M320 220 L356 220 L356 250 L320 250" stroke={LEATHER} strokeWidth="10" fill="none" />
          <circle cx="356" cy="235" r="6" fill={BRASS} />
        </>
      );
      break;
    case "whisk":
      body = (
        <g transform="rotate(-20 200 200)">
          {[16, 32, 48, 62].map((w) => (
            <path
              key={w}
              d={`M200 168 C${200 - w} 238 ${200 - w * 1.2} 330 200 350 C${200 + w * 1.2} 330 ${200 + w} 238 200 168`}
              stroke={STEEL_DARK}
              strokeWidth="3"
              fill="none"
            />
          ))}
          <rect x="186" y="44" width="28" height="134" rx="12" fill={STEEL} />
          <rect x="186" y="44" width="28" height="134" rx="12" fill="none" stroke={STEEL_DARK} strokeWidth="2" />
          <circle cx="200" cy="58" r="5" fill="none" stroke={STEEL_DARK} strokeWidth="2" />
        </g>
      );
      break;
    case "tongs":
      body = (
        <g transform="rotate(-24 200 200)">
          <path d="M184 60 L168 330" stroke={STEEL} strokeWidth="16" strokeLinecap="round" />
          <path d="M216 60 L246 330" stroke={STEEL} strokeWidth="16" strokeLinecap="round" />
          <path d="M184 60 Q200 40 216 60" stroke={STEEL_DARK} strokeWidth="16" fill="none" />
          <rect x="176" y="82" width="48" height="16" rx="6" fill={STEEL_DARK} />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <circle cx={168 - 0.5 + i * 0} cy={310 + i * 10} r="2" fill={STEEL_DARK} />
              <circle cx={246} cy={310 + i * 10} r="2" fill={STEEL_DARK} />
            </g>
          ))}
        </g>
      );
      break;
    case "spatula":
      body = (
        <g transform="rotate(-22 200 200)">
          <rect x="186" y="40" width="28" height="140" rx="12" fill={color} />
          {[70, 110, 150].map((y) => (
            <circle key={y} cx="200" cy={y} r="4" fill={STEEL} />
          ))}
          <path d="M194 178 L206 178 L210 210 L194 210 Z" fill={STEEL_DARK} />
          <path d="M162 210 L246 210 L262 340 Q200 360 150 344 Z" fill={STEEL} />
          {[180, 198, 216, 234].map((x) => (
            <rect key={x} x={x} y="234" width="7" height="86" rx="3.5" fill="#f4f4f4" />
          ))}
        </g>
      );
      break;
    case "ladle":
      body = (
        <g transform="rotate(-18 200 200)">
          <path d="M200 52 L200 262" stroke={STEEL} strokeWidth="14" strokeLinecap="round" />
          <path d="M200 52 Q186 40 196 30" stroke={STEEL_DARK} strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M140 262 L260 262 Q262 330 200 334 Q138 330 140 262 Z" fill={STEEL} />
          <ellipse cx="200" cy="262" rx="60" ry="12" fill={STEEL_DARK} />
          <path d="M256 262 L272 254" stroke={STEEL_DARK} strokeWidth="5" strokeLinecap="round" />
        </g>
      );
      break;
  }

  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-hidden="true">
      <ellipse cx="200" cy="370" rx="120" ry="10" fill="#000" opacity="0.05" />
      {body}
    </svg>
  );
}
