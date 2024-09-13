import { useCallback, useEffect, useRef, useState } from "react";

type RGB = { r: number; g: number; b: number };
type HSL = { h: number; s: number; l: number };

const hexToRgb = (hex: string): RGB => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

const rgbToHsl = ({ r, g, b }: RGB): HSL => {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0; // Initialized to 0
    let s: number;
    let l = (max + min) / 2;
  
    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6; // Assigning a value to 'h' in every possible branch
    }
  
    return { h, s, l };
};

const hslToRgb = ({ h, s, l }: HSL): RGB => {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
};

const rgbToHex = ({ r, g, b }: RGB): string => {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
};


const modifyColorLuminance = (hexValue: string, luminance: number) => {
  const rgb = hexToRgb(hexValue);
  const hsl = rgbToHsl(rgb);
  hsl.l = luminance;
  const newRgb = hslToRgb(hsl);
  return rgbToHex(newRgb);
};

const modifyColorSaturation = (hexValue: string, modifier: (p: number) => number) => {
  const rgb = hexToRgb(hexValue);
  const hsl = rgbToHsl(rgb);
  hsl.s = modifier(hsl.s);
  const newRgb = hslToRgb(hsl);
  return rgbToHex(newRgb);
};

const modifyColorHue = (hexValue: string, hue: number) => {
  const rgb = hexToRgb(hexValue);
  const hsl = rgbToHsl(rgb);
  hsl.h = hue; // clamping the hue to valid range [0, 1]
  const newRgb = hslToRgb(hsl);
  return rgbToHex(newRgb);
};


type ColorPalette = {
    default: string;
    light: string;
    lightest: string;
    dark: string;
    darkest: string;
    lightText: string;
    darkText: string;
    mutedLight: string;
    mutedDark: string;
    mutedMedium: string;
    mutedLightMedium: string;
    mutedDarkMedium: string;
};
  
export const getColorPalette = (baseColor: string): ColorPalette => {
    return {
        default: baseColor,
        light: modifyColorLuminance(baseColor, 0.9), // slightly lighter
        lightest: modifyColorLuminance(baseColor, 0.7), // much lighter
        dark: modifyColorLuminance(baseColor, 0.3), // slightly darker
        darkest: modifyColorLuminance(baseColor, 0.1), // much darker
        lightText: modifyColorLuminance(baseColor, 0.95), // text color
        darkText: modifyColorLuminance(baseColor, 0.05), // text color
        mutedLight:modifyColorLuminance(modifyColorSaturation(baseColor, (p) => p * 0.2), 0.9), // muted light
        mutedLightMedium: modifyColorLuminance(modifyColorSaturation(baseColor, (p) => p * 0.2), 0.75), // muted light medium
        mutedDark: modifyColorLuminance(modifyColorSaturation(baseColor, (p) => p * 0.2), 0.1), // muted dark
        mutedDarkMedium: modifyColorLuminance(modifyColorSaturation(baseColor, (p) => p * 0.2), 0.25), // muted dark medium
        mutedMedium: modifyColorLuminance(modifyColorSaturation(baseColor, (p) => p * 0.2), 0.5) // muted medium
    };
};

export enum Language {
    English = "eng",
    Hindi = "hin",
    French = "fre",
    Spanish = "spa",
    Chinese = "chi"
}

export const Languages = [
    Language.English,
    Language.Hindi,
    Language.French,
    Language.Spanish,
    Language.Chinese
];

export const getLanguageName = (languageCode: string): string => {
    switch (languageCode) {
        case "eng":
            return "English";
        case "hin":
            return "हिंदी";
        case "fre":
            return "Français";
        case "spa":
            return "Español";
        case "chi":
            return "普通话";
        default:
            return "English";
    }
}

export const useThrottle = <T>(value: T, delay: number): T => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now() - delay);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= delay) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, delay - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
};