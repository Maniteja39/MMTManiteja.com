/**
 * Friendly console message for anyone who opens DevTools on the live site.
 * No-op in dev (so it doesn't pollute the local console during HMR cycles)
 * and runs at most once per page load.
 *
 * Lives as a module-level side-effect rather than a component so it doesn't
 * leak into React's render tree.
 */

let printed = false;

export const printDevConsoleMessage = () => {
  if (printed) return;
  printed = true;

  // Skip in dev so HMR-triggered remounts don't spam the console.
  if (import.meta.env.DEV) return;
  if (typeof console === "undefined") return;

  const banner = `
   __  __ __  __ _____
  |  \\/  |  \\/  |_   _|
  | |\\/| | |\\/| | | |
  | |  | | |  | | | |
  |_|  |_|_|  |_| |_|
`;
  const heading = "Hi, you found the source.";
  const body =
    "If you're hiring, collaborating, or just want to nerd out about agentic AI / distributed systems —";
  const email = "manitejajavadev@gmail.com";

  console.log(
    `%c${banner}%c${heading}\n%c${body}\n%c${email}`,
    "color: #F5B820; font-family: monospace; font-size: 11px; line-height: 1.2;",
    "color: #F5B820; font-size: 16px; font-weight: bold; padding-top: 4px;",
    "color: #e2e8f0; font-size: 13px; padding-top: 6px;",
    "color: #6366f1; font-size: 13px; font-weight: bold; padding-top: 4px;",
  );
};
