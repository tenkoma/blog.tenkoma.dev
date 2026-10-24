# http-cache-semantics security patch

`http-cache-semantics` 4.3.0 still allows client `max-stale` directives to reuse
shared cache entries whose lifetime was set to zero because of `Set-Cookie` or
`proxy-revalidate`. This reproduces
[GHSA-ch52-4w7c-c8xp](https://github.com/advisories/GHSA-ch52-4w7c-c8xp),
even though 4.3.0 is outside the advisory's affected version range.

The patch requires synchronous revalidation for these entries and `no-cache`
responses before either `max-stale` or `stale-while-revalidate` can reuse them.
Explicitly public responses and private caches retain their existing behavior.

`npm ci` / `npm install` apply the patch through the `postinstall` script and fail
if it cannot be applied. The override pins the patched package to 4.3.0 until an
upstream fix is available. Keep development dependencies installed when building
this static site so `patch-package` is available.

Run `npm run test:security` to check the regression. When upgrading this package,
verify that the tests pass without the patch before removing the override, patch,
and installation hook.
