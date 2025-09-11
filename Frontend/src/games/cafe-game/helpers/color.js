// Darken màu theo tỷ lệ (0.0–1.0). Ví dụ: amount = 0.2 => đậm hơn 20%
export function darken(color, amount = 0.15) {
  const { h, s, l, a } = toHSL(color);
  const l2 = clamp01(l - l * amount);
  return fromHSL({ h, s, l: l2, a });
}

/* ----------------- Helpers ----------------- */
function toHSL(input) {
  input = input.trim();

  // #RGB / #RRGGBB
  if (input.startsWith("#")) {
    let hex = input.slice(1);
    if (hex.length === 3)
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return rgbToHsl(r, g, b, 1);
  }

  // rgb / rgba
  let m = input.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i
  );
  if (m) {
    const r = +m[1],
      g = +m[2],
      b = +m[3],
      a = m[4] !== undefined ? +m[4] : 1;
    return rgbToHsl(r, g, b, a);
  }

  // hsl / hsla
  m = input.match(
    /^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)$/i
  );
  if (m) {
    const h = ((+m[1] % 360) + 360) % 360;
    const s = clamp01(+m[2] / 100);
    const l = clamp01(+m[3] / 100);
    const a = m[4] !== undefined ? +m[4] : 1;
    return { h, s, l, a };
  }

  throw new Error("Unsupported color format: " + input);
}

function fromHSL({ h, s, l, a = 1 }) {
  // Trả về dạng cùng hệ với input? Đơn giản: chuẩn hoá ra hex/rgba
  const { r, g, b } = hslToRgb(h, s, l);
  if (a >= 1) return rgbToHex(r, g, b);
  return `rgba(${r}, ${g}, ${b}, ${round(a, 3)})`;
}

function rgbToHsl(r, g, b, a = 1) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  return { h, s, l, a };
}

function hslToRgb(h, s, l) {
  const C = (1 - Math.abs(2 * l - 1)) * s;
  const X = C * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - C / 2;
  let r1 = 0,
    g1 = 0,
    b1 = 0;
  if (0 <= h && h < 60) {
    r1 = C;
    g1 = X;
    b1 = 0;
  } else if (60 <= h && h < 120) {
    r1 = X;
    g1 = C;
    b1 = 0;
  } else if (120 <= h && h < 180) {
    r1 = 0;
    g1 = C;
    b1 = X;
  } else if (180 <= h && h < 240) {
    r1 = 0;
    g1 = X;
    b1 = C;
  } else if (240 <= h && h < 300) {
    r1 = X;
    g1 = 0;
    b1 = C;
  } else {
    r1 = C;
    g1 = 0;
    b1 = X;
  }
  const r = Math.round((r1 + m) * 255);
  const g = Math.round((g1 + m) * 255);
  const b = Math.round((b1 + m) * 255);
  return { r, g, b };
}

function rgbToHex(r, g, b) {
  const toHex = (v) => v.toString(16).padStart(2, "0");
  return "#" + toHex(r) + toHex(g) + toHex(b);
}

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const round = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
