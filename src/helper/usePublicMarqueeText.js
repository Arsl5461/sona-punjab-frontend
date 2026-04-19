import { useEffect, useState } from "react";
import {
  getAllMarquees,
  buildPublicMarqueeText,
} from "../Component/adminPanal/Marquee/__request/MarqueeRequest";

const DEFAULT_FALLBACK =
  "خوش آمدید — Sona Punjab | Best of luck to all flyers. Committee updates and offers will appear here.";

/**
 * Loads headline lines from GET /sona-punjab/get-all-marquee and joins them.
 * Falls back to `fallback` option, then REACT_APP_NEWS_TICKER, then default string.
 * @param {{ fallback?: string }} [options]
 */
export function usePublicMarqueeText(options = {}) {
  const envFallback =
    (typeof process !== "undefined" &&
      process.env.REACT_APP_NEWS_TICKER?.trim()) ||
    "";

  const initial =
    (options.fallback && String(options.fallback).trim()) ||
    envFallback ||
    DEFAULT_FALLBACK;

  const [text, setText] = useState(initial);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getAllMarquees();
        const joined = buildPublicMarqueeText(res);
        if (!cancelled && joined) {
          setText(joined);
        }
      } catch {
        /* keep initial fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return text;
}
