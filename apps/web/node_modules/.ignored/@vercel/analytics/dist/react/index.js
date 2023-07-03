"use client";

// src/react.tsx
import { useEffect } from "react";

// package.json
var name = "@vercel/analytics";
var version = "1.0.1";

// src/queue.ts
var initQueue = () => {
  if (window.va)
    return;
  window.va = function a(...params) {
    (window.vaq = window.vaq || []).push(params);
  };
};

// src/utils.ts
function isBrowser() {
  return typeof window !== "undefined";
}
function detectEnvironment() {
  try {
    const env = process.env.NODE_ENV;
    if (env === "development" || env === "test") {
      return "development";
    }
  } catch (e) {
  }
  return "production";
}
function setMode(mode = "auto") {
  if (mode === "auto") {
    window.vam = detectEnvironment();
    return;
  }
  window.vam = mode;
}
function getMode() {
  return window.vam || "production";
}
function isProduction() {
  return getMode() === "production";
}
function isDevelopment() {
  return getMode() === "development";
}
function removeKey(key, { [key]: _, ...rest }) {
  return rest;
}
function parseProperties(properties, options) {
  let props = properties;
  const errorProperties = [];
  for (const [key, value] of Object.entries(properties)) {
    if (typeof value === "object" && value !== null) {
      if (options.strip) {
        props = removeKey(key, props);
      } else {
        errorProperties.push(key);
      }
    }
  }
  if (errorProperties.length > 0 && !options.strip) {
    throw Error(
      `The following properties are not valid: ${errorProperties.join(
        ", "
      )}. Only strings, numbers, booleans, and null are allowed.`
    );
  }
  return props;
}

// src/generic.ts
function inject(props = {
  debug: true
}) {
  var _a;
  if (!isBrowser())
    return;
  setMode(props.mode);
  initQueue();
  if (props.beforeSend) {
    (_a = window.va) == null ? void 0 : _a.call(window, "beforeSend", props.beforeSend);
  }
  const src = isDevelopment() ? "https://va.vercel-scripts.com/v1/script.debug.js" : "/_vercel/insights/script.js";
  if (document.head.querySelector(`script[src*="${src}"]`))
    return;
  const script = document.createElement("script");
  script.src = src;
  script.defer = true;
  script.setAttribute("data-sdkn", name);
  script.setAttribute("data-sdkv", version);
  if (isDevelopment() && props.debug === false) {
    script.setAttribute("data-debug", "false");
  }
  document.head.appendChild(script);
}
function track(name2, properties) {
  var _a, _b;
  if (!isBrowser()) {
    console.warn(
      "[Vercel Web Analytics] Server-side execution of `track()` is currently not supported."
    );
    return;
  }
  if (!properties) {
    (_a = window.va) == null ? void 0 : _a.call(window, "event", { name: name2 });
    return;
  }
  try {
    const props = parseProperties(properties, {
      strip: isProduction()
    });
    (_b = window.va) == null ? void 0 : _b.call(window, "event", {
      name: name2,
      data: props
    });
  } catch (err) {
    if (err instanceof Error && isDevelopment()) {
      console.error(err);
    }
  }
}

// src/react.tsx
function Analytics({
  beforeSend,
  debug = true,
  mode = "auto"
}) {
  useEffect(() => {
    inject({ beforeSend, debug, mode });
  }, [beforeSend, debug, mode]);
  return null;
}
var react_default = {
  Analytics,
  track
};
export {
  Analytics,
  react_default as default,
  track
};
//# sourceMappingURL=index.js.map