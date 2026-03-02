"use client";

import { useState, useEffect } from "react";

export type DevicePlatform = "ios" | "android" | "macos" | "windows" | "unknown";

const platformLabels: Record<DevicePlatform, string> = {
  ios: "iOS",
  android: "Android",
  macos: "macOS",
  windows: "Windows",
  unknown: "your device",
};

const platformIcons: Record<DevicePlatform, string> = {
  ios: "🍎",
  android: "🤖",
  macos: "🖥️",
  windows: "🪟",
  unknown: "📱",
};

export function detectPlatform(userAgent: string): DevicePlatform {
  const ua = userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  if (/macintosh|mac os x/.test(ua) && !/iphone/.test(ua)) return "macos";
  if (/windows/.test(ua)) return "windows";
  return "unknown";
}

export function useDeviceDetect() {
  const [platform, setPlatform] = useState<DevicePlatform>("unknown");

  useEffect(() => {
    setPlatform(detectPlatform(navigator.userAgent));
  }, []);

  return {
    platform,
    label: platformLabels[platform],
    icon: platformIcons[platform],
    allPlatforms: ["ios", "android", "macos", "windows"] as DevicePlatform[],
    getLabel: (p: DevicePlatform) => platformLabels[p],
    getIcon: (p: DevicePlatform) => platformIcons[p],
  };
}
