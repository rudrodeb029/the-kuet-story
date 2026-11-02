import { rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { getRouter } from "@/router";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = getRouter();

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches a page for /admin instead of falling back to not found", () => {
    const router = getRouter();

    const matches = router.matchRoutes("/admin");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(matches.at(-1)?.routeId).toBe("/admin");
  });

  it("matches a page for /admin/ with trailing slash instead of falling back to not found", () => {
    const router = getRouter();

    const matches = router.matchRoutes("/admin/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(matches.at(-1)?.routeId).toBe("/admin");
  });
});
