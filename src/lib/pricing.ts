import type { PackageItem } from "../types";

export function formatIDRPrice(value: number): string {
  const million = value / 1000000;
  return `${million.toFixed(1).replace(".0", "")} Juta`;
}

export function getPricingCtaLabel(pkg: PackageItem, isEn: boolean): string {
  const isEnterprise = pkg.id === "enterprise";
  return isEnterprise
    ? isEn
      ? "Contact Enterprise Sales"
      : "Hubungi Enterprise Sales"
    : isEn
      ? "Start 30-Day Paid Pilot"
      : "Mulai 30 Hari Pilot Kerja";
}
