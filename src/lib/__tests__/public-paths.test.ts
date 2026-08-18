import { describe, expect, it } from "vitest";
import { isPublicMarketingPath } from "@/lib/public-paths";

describe("isPublicMarketingPath", () => {
  it("reconoce la landing y los hubs /u/", () => {
    expect(isPublicMarketingPath("/")).toBe(true);
    expect(isPublicMarketingPath("/u/unsa")).toBe(true);
    expect(isPublicMarketingPath("/u/ucasal")).toBe(true);
  });

  it("no trata como marketing las rutas de la app", () => {
    expect(isPublicMarketingPath("/login")).toBe(false);
    expect(isPublicMarketingPath("/dashboard")).toBe(false);
    expect(isPublicMarketingPath("/universidad")).toBe(false);
  });
});
