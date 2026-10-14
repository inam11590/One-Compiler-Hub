import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildSandboxedHtml, generateChannelToken } from "../src/lib/preview/bundler.ts";
import { createZipArchive } from "../src/lib/zip.ts";
import { HTML_STARTER_TEMPLATES } from "../src/lib/preview/templates.ts";

describe("Live Preview Engine & Security Bundler", () => {
  test("generates unique random channel tokens", () => {
    const t1 = generateChannelToken();
    const t2 = generateChannelToken();
    assert.ok(t1.length >= 10, "Token should be at least 10 chars");
    assert.notEqual(t1, t2, "Tokens must be unique");
  });

  test("builds sandboxed HTML with strict CSP and message bridge", () => {
    const html = "<h1 id='title'>Test</h1>";
    const css = "body { background: red; }";
    const js = "console.log('hello');";
    const token = "secure-token-12345";

    const assembled = buildSandboxedHtml(html, css, js, token, { cspEnabled: true });

    // Verify CSP
    assert.ok(
      assembled.includes("Content-Security-Policy"),
      "Must include Content Security Policy"
    );
    assert.ok(
      assembled.includes("connect-src 'none'"),
      "CSP must block arbitrary network egress (connect-src 'none')"
    );

    // Verify token injection
    assert.ok(
      assembled.includes("secure-token-12345"),
      "Must embed active cryptographic channel token"
    );

    // Verify CSS injection
    assert.ok(
      assembled.includes("background: red;"),
      "Must inline style.css content"
    );

    // Verify HTML content
    assert.ok(
      assembled.includes("<h1 id='title'>Test</h1>"),
      "Must include original HTML markup"
    );

    // Verify bridge script presence
    assert.ok(
      assembled.includes("onecompiler-preview"),
      "Must include bridge message identifier"
    );
  });

  test("preserves existing head and body tags when present in user HTML", () => {
    const doc = `<!DOCTYPE html><html><head><title>Custom</title></head><body><div id="app"></div></body></html>`;
    const css = "p { color: blue; }";
    const js = "console.info('init');";
    const token = "token-xyz";

    const assembled = buildSandboxedHtml(doc, css, js, token);
    assert.ok(assembled.includes("<title>Custom</title>"));
    assert.ok(assembled.includes("color: blue;"));
    assert.ok(assembled.includes("onecompiler-preview"));
  });
});

describe("Client-Side ZIP Generator", () => {
  test("creates valid PKZIP binary archive", () => {
    const files = [
      { name: "index.html", content: "<h1>Hello</h1>" },
      { name: "style.css", content: "body { margin: 0; }" },
      { name: "script.js", content: "console.log('ready');" },
    ];

    const zipBytes = createZipArchive(files);
    assert.ok(zipBytes instanceof Uint8Array, "Result must be Uint8Array");
    assert.ok(zipBytes.length > 100, "Archive must have non-trivial size");

    // PKZIP magic bytes check: 0x50, 0x4B, 0x03, 0x04 ('PK\x03\x04')
    assert.equal(zipBytes[0], 0x50, "Magic byte 0 must be P");
    assert.equal(zipBytes[1], 0x4b, "Magic byte 1 must be K");
    assert.equal(zipBytes[2], 0x03, "Magic byte 2 must be 0x03");
    assert.equal(zipBytes[3], 0x04, "Magic byte 3 must be 0x04");

    // Check that filenames are contained inside the archive binary
    const textDecoder = new TextDecoder();
    const binaryString = textDecoder.decode(zipBytes);
    assert.ok(binaryString.includes("index.html"));
    assert.ok(binaryString.includes("style.css"));
    assert.ok(binaryString.includes("script.js"));
  });

  test("handles empty and binary files safely", () => {
    const files = [
      { name: "empty.txt", content: "" },
      { name: "binary.bin", content: new Uint8Array([1, 2, 3, 4, 5]) },
    ];
    const zipBytes = createZipArchive(files);
    assert.ok(zipBytes.length > 60);
  });
});

describe("Starter Templates Architecture", () => {
  test("contains all three required starter templates", () => {
    const ids = HTML_STARTER_TEMPLATES.map((t) => t.id);
    assert.ok(ids.includes("hello-world"), "Must have Hello World template");
    assert.ok(ids.includes("portfolio"), "Must have Portfolio template");
    assert.ok(ids.includes("interactive-app"), "Must have Interactive App template");
  });

  test("each template contains index.html, style.css, and script.js", () => {
    for (const tmpl of HTML_STARTER_TEMPLATES) {
      const names = tmpl.files.map((f) => f.name);
      assert.ok(names.includes("index.html"), `${tmpl.id} missing index.html`);
      assert.ok(names.includes("style.css"), `${tmpl.id} missing style.css`);
      assert.ok(names.includes("script.js"), `${tmpl.id} missing script.js`);

      for (const f of tmpl.files) {
        assert.ok(f.content.trim().length > 20, `${tmpl.id}/${f.name} content too short`);
      }
    }
  });
});
