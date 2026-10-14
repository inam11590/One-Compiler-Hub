/**
 * OneCompilerHub - Live Preview HTML & Security Bundler
 *
 * Compiles user-provided HTML, CSS, and JavaScript into an isolated document
 * with a strictly scoped message bridge and hardened Content Security Policy.
 *
 * SECURITY MODEL:
 * 1. Sandboxed iframe attribute: sandbox="allow-scripts allow-modals" (NO allow-same-origin!).
 * 2. Injected CSP blocks all outgoing network calls (connect-src 'none').
 * 3. Unique random channelToken guarantees parent only accepts events from the active iframe.
 * 4. Safe serialization guards against circular references and massive payload floods.
 */

export interface BundlerOptions {
  cspEnabled?: boolean;
}

export function generateChannelToken(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    Date.now().toString(36)
  );
}

/**
 * Builds the complete HTML document string for the sandboxed iframe.
 */
export function buildSandboxedHtml(
  html: string,
  css: string,
  js: string,
  channelToken: string,
  options: BundlerOptions = {}
): string {
  const { cspEnabled = true } = options;

  const cspMeta = cspEnabled
    ? `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data: blob: https:; font-src data: https:; media-src data: blob:; connect-src 'none';">`
    : "";

  // The client bridge script injected into the preview iframe
  const bridgeScript = `
(function() {
  'use strict';
  var TOKEN = ${JSON.stringify(channelToken)};
  var MAX_LOG_LENGTH = 1500;
  var MAX_LOGS_PER_SEC = 50;
  var logCountThisSec = 0;
  var lastSecReset = Date.now();

  function safeSerialize(arg) {
    if (arg === null) return 'null';
    if (arg === undefined) return 'undefined';
    if (typeof arg === 'string') return arg.length > MAX_LOG_LENGTH ? arg.substring(0, MAX_LOG_LENGTH) + '… [truncated]' : arg;
    if (typeof arg === 'number' || typeof arg === 'boolean') return String(arg);
    if (typeof arg === 'function') return '[Function: ' + (arg.name || 'anonymous') + ']';
    if (arg instanceof Error) return arg.name + ': ' + arg.message + (arg.stack ? '\\n' + arg.stack : '');
    if (typeof Element !== 'undefined' && arg instanceof Element) {
      return '<' + arg.tagName.toLowerCase() + (arg.id ? ' id="' + arg.id + '"' : '') + (arg.className ? ' class="' + arg.className + '"' : '') + '>';
    }

    var seen = [];
    try {
      var json = JSON.stringify(arg, function(key, val) {
        if (typeof val === 'object' && val !== null) {
          if (seen.indexOf(val) !== -1) {
            return '[Circular Reference]';
          }
          seen.push(val);
        }
        if (typeof val === 'string' && val.length > MAX_LOG_LENGTH) {
          return val.substring(0, MAX_LOG_LENGTH) + '… [truncated]';
        }
        return val;
      }, 2);
      return json && json.length > MAX_LOG_LENGTH ? json.substring(0, MAX_LOG_LENGTH) + '… [truncated]' : json;
    } catch (e) {
      return '[Unserializable Object: ' + e.message + ']';
    }
  }

  function sendBridgeMessage(payload) {
    var now = Date.now();
    if (now - lastSecReset > 1000) {
      logCountThisSec = 0;
      lastSecReset = now;
    }
    if (logCountThisSec >= MAX_LOGS_PER_SEC) {
      return; // Rate limit protection
    }
    logCountThisSec++;

    try {
      payload.source = 'onecompiler-preview';
      payload.channelToken = TOKEN;
      payload.timestamp = now;
      window.parent.postMessage(payload, '*');
    } catch (_) {}
  }

  // Intercept standard console methods
  var originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error
  };

  ['log', 'info', 'warn', 'error'].forEach(function(level) {
    console[level] = function() {
      var rawArgs = Array.prototype.slice.call(arguments);
      var serialized = rawArgs.map(safeSerialize);
      sendBridgeMessage({
        type: 'console',
        level: level,
        args: serialized
      });
      if (originalConsole[level]) {
        try { originalConsole[level].apply(console, rawArgs); } catch(_) {}
      }
    };
  });

  // Intercept uncaught runtime errors
  window.addEventListener('error', function(event) {
    sendBridgeMessage({
      type: 'runtime-error',
      level: 'error',
      error: {
        message: event.message || 'Script runtime error',
        filename: event.filename || 'script.js',
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error && event.error.stack ? event.error.stack : null
      },
      args: ['Uncaught Error: ' + (event.message || 'Unknown runtime error')]
    });
  });

  // Intercept unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    var reason = event.reason;
    var msg = reason ? (reason.message || String(reason)) : 'Unhandled Promise rejection';
    sendBridgeMessage({
      type: 'runtime-error',
      level: 'error',
      error: {
        message: msg,
        stack: reason && reason.stack ? reason.stack : null
      },
      args: ['Uncaught (in promise): ' + msg]
    });
  });

  // Ready signal
  sendBridgeMessage({ type: 'ready' });
})();
`;

  // Check whether HTML already has <html> or <head> tags
  const hasHtmlTag = /<html[\s>]/i.test(html);
  const hasHeadTag = /<head[\s>]/i.test(html);
  const hasBodyTag = /<body[\s>]/i.test(html);

  const styleTag = `<style id="onecompiler-styles">\n${css || ""}\n</style>`;
  const scriptTag = `<script>\n${bridgeScript}\n</script>\n<script>\ntry {\n${js || ""}\n} catch (err) {\n  console.error("Runtime execution error:", err.message);\n}\n</script>`;

  if (hasHtmlTag && hasHeadTag) {
    // Inject CSP and styles into existing <head>
    let assembled = html.replace(/<head[\s>]/i, (match) => `${match}\n${cspMeta}\n${styleTag}\n`);
    if (hasBodyTag) {
      assembled = assembled.replace(/<\/body>/i, `${scriptTag}\n</body>`);
    } else {
      assembled += `\n${scriptTag}`;
    }
    return assembled;
  }

  // Wrap partial HTML in standard full document
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${cspMeta}
  ${styleTag}
</head>
<body>
${html || ""}
${scriptTag}
</body>
</html>`;
}
