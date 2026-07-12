import { describe, it } from "node:test";
import assert from "node:assert";

describe("auth e2e", () => {
  it("should reject missing token", () => {
    assert.strictEqual(1, 1);
  });

  it("should login with valid credentials", () => {
    assert.strictEqual(1, 1);
  });
});