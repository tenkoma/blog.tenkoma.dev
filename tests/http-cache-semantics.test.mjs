import assert from "node:assert/strict";
import test from "node:test";
import CachePolicy from "http-cache-semantics";

const request = {
  url: "https://example.com/account",
  method: "GET",
  headers: { host: "example.com" },
};

// GHSA-ch52-4w7c-c8xp: client directives must not override cache reuse prohibitions.
for (const headers of [
  { "cache-control": "max-age=3600", "set-cookie": "session=secret" },
  { "cache-control": "max-age=3600, proxy-revalidate" },
  { "cache-control": "max-age=3600, no-cache" },
  { "cache-control": "max-age=3600, proxy-revalidate, stale-while-revalidate=86400" },
  { "cache-control": "max-age=3600, no-cache, stale-while-revalidate=86400" },
  {
    "cache-control": "max-age=3600, stale-while-revalidate=86400",
    "set-cookie": "session=secret",
  },
]) {
  for (const directive of ["max-stale", "max-stale=999999", ""]) {
    test(`requires revalidation for ${JSON.stringify(headers)} with ${directive}`, () => {
      const policy = new CachePolicy(request, { status: 200, headers }, { shared: true });
      const incoming = {
        ...request,
        headers: { ...request.headers, "cache-control": directive },
      };
      assert.equal(policy.maxAge(), 0);
      assert.equal(policy.satisfiesWithoutRevalidation(incoming), false);
      const result = policy.evaluateRequest(incoming);
      assert.equal(result.response, undefined);
      assert.equal(result.revalidation.synchronous, true);
    });
  }
}

test("ordinary stale public responses still honor max-stale", () => {
  const policy = new CachePolicy(request, {
    status: 200,
    headers: { "cache-control": "public, max-age=60", age: "120" },
  });
  assert.equal(policy.stale(), true);
  assert.equal(
    policy.satisfiesWithoutRevalidation({
      ...request,
      headers: { ...request.headers, "cache-control": "max-stale=3600" },
    }),
    true,
  );
});

test("fresh explicitly public responses with cookies remain reusable", () => {
  const policy = new CachePolicy(request, {
    status: 200,
    headers: { "cache-control": "public, max-age=3600", "set-cookie": "preference=light" },
  });
  assert.equal(policy.satisfiesWithoutRevalidation(request), true);
});

test("private caches can reuse fresh responses with cookies", () => {
  const policy = new CachePolicy(
    request,
    { status: 200, headers: { "cache-control": "max-age=3600", "set-cookie": "session=secret" } },
    { shared: false },
  );
  assert.equal(policy.satisfiesWithoutRevalidation(request), true);
});
