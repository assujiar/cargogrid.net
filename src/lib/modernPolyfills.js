// Replaces Next's `polyfill-module` (aliased in next.config.ts).
//
// That module patches String.prototype.trimStart/trimEnd, Symbol.description,
// Array.prototype.flat/flatMap/at, Promise.prototype.finally,
// Object.fromEntries/hasOwn and URL.canParse. Every one of those except
// URL.canParse (Chrome 120 / Safari 17) predates this project's browserslist
// floor, so shipping them is dead weight that Lighthouse flags as legacy
// JavaScript. Only the one feature the floor does not guarantee is kept.
if (!("canParse" in URL)) {
  URL.canParse = function canParse(url, base) {
    try {
      return Boolean(new URL(url, base));
    } catch {
      return false;
    }
  };
}
