import { randomInt } from "node:crypto";

export function generateAccountNumber(): string {
  const group = () => randomInt(0, 1000).toString().padStart(3, "0");
  return `${group()} ${group()} ${group()}`;
}

export function generateOtp(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function generateCardLast4(): string {
  return randomInt(0, 10_000).toString().padStart(4, "0");
}
