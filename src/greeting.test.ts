import { describe, expect, it } from "vitest";
import { greet } from "./greeting.js";

describe("greet", () => {
  it("includes the name", () => {
    expect(greet("Ani")).toContain("Ani");
  });
});
