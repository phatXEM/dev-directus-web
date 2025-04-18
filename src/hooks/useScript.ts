import { useEffect } from "react";

export const useScript = (src: string) => {
  useEffect(
    () => {
      // Allow falsy src value if waiting on other data needed for
      // constructing the script URL passed to this hook.
      if (!src) {
        return;
      }

      // Fetch existing script element by src
      // It may have been added by another intance of this hook
      let script = document.querySelectorAll(
        `script[src="${src}"]`
      )[0] as HTMLScriptElement;

      if (!script) {
        // Create script
        script = document.createElement("script");
        (script as HTMLScriptElement).src = src;
        script.async = true;
        // Add script to document body
        document.body.appendChild(script);
      }
    },
    [src] // Only re-run effect if script src changes
  );
};
