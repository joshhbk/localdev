import { describe, expect, it } from "vitest";
import { formatUptime } from "./status.js";

describe("formatUptime", () => {
  it("returns seconds only for short durations", () => {
    const now = new Date();
    const startedAt = new Date(now.getTime() - 45_000).toISOString();
    expect(formatUptime(startedAt, now)).toBe("45s");
  });

  it("returns minutes and seconds", () => {
    const now = new Date();
    const startedAt = new Date(now.getTime() - 222_000).toISOString();
    expect(formatUptime(startedAt, now)).toBe("3m 42s");
  });

  it("returns hours and minutes", () => {
    const now = new Date();
    const startedAt = new Date(now.getTime() - 3_900_000).toISOString();
    expect(formatUptime(startedAt, now)).toBe("1h 5m");
  });

  it("returns 0s for zero duration", () => {
    const now = new Date();
    expect(formatUptime(now.toISOString(), now)).toBe("0s");
  });
});
