import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { PYTHON_STARTER_EXAMPLES } from "../src/lib/python/templates.ts";
import { ExecutionApiError } from "../src/lib/api/execution-client.ts";

describe("Python Starter Examples Architecture", () => {
  test("contains all 10 required beginner-friendly starter examples", () => {
    assert.equal(
      PYTHON_STARTER_EXAMPLES.length,
      10,
      "Must provide exactly 10 Python starter examples"
    );

    const expectedIds = [
      "hello-world",
      "variables-and-types",
      "if-else-conditions",
      "loops",
      "functions",
      "lists",
      "dictionaries",
      "standard-input",
      "error-handling",
      "simple-calculations",
    ];

    expectedIds.forEach((expectedId) => {
      const found = PYTHON_STARTER_EXAMPLES.find((e) => e.id === expectedId);
      assert.ok(found, `Must contain starter example '${expectedId}'`);
      assert.ok(found.name.length > 0, `Example '${expectedId}' must have a name`);
      assert.ok(
        found.description.length > 10,
        `Example '${expectedId}' must have an informative description`
      );
      assert.ok(
        found.code.length > 20,
        `Example '${expectedId}' must have meaningful Python code`
      );
    });
  });

  test("standard input template supplies default stdin stream", () => {
    const stdinExample = PYTHON_STARTER_EXAMPLES.find(
      (e) => e.id === "standard-input"
    );
    assert.ok(stdinExample, "Must contain standard-input example");
    assert.ok(
      stdinExample.defaultStdin && stdinExample.defaultStdin.length > 0,
      "standard-input example must have defaultStdin defined"
    );
    assert.ok(
      stdinExample.code.includes("input("),
      "Code must call input() to read from STDIN"
    );
  });

  test("all templates have non-empty syntax and clean indentation", () => {
    for (const example of PYTHON_STARTER_EXAMPLES) {
      assert.ok(
        example.code.includes("print("),
        `Example '${example.id}' should output to stdout via print()`
      );
      // Verify no tabs mixed with spaces
      assert.ok(
        !example.code.includes("\t"),
        `Example '${example.id}' should use standard PEP 8 4-space indentation without tabs`
      );
    }
  });

  test("template categories cover beginner and intermediate concepts", () => {
    const categories = new Set(PYTHON_STARTER_EXAMPLES.map((e) => e.category));
    assert.ok(categories.has("Beginner"), "Must have Beginner category");
    assert.ok(categories.has("Intermediate"), "Must have Intermediate category");
  });
});

describe("Execution API Client Contracts & Error Handling", () => {
  test("instantiates ExecutionApiError with code, message, and HTTP status", () => {
    const err = new ExecutionApiError("network_error", "Failed to connect", 0);
    assert.equal(err.name, "ExecutionApiError");
    assert.equal(err.code, "network_error");
    assert.equal(err.message, "Failed to connect");
    assert.equal(err.status, 0);

    const serverErr = new ExecutionApiError(
      "feature_unavailable",
      "Execution disabled",
      503
    );
    assert.equal(serverErr.status, 503);
    assert.equal(serverErr.code, "feature_unavailable");
  });

  test("ExecutionApiError preserves standard Error prototype and stack trace", () => {
    const err = new ExecutionApiError("validation_error", "Invalid source code", 422);
    assert.ok(err instanceof Error, "Must be an instance of Error");
    assert.ok(err.stack && err.stack.length > 0, "Must contain a valid stack trace");
  });
});
