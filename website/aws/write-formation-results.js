#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Writes CloudFormation stack Outputs to an env file.
 *
 * Usage:
 *   node aws/write-formation-results.js --stage=staging
 *   node aws/write-formation-results.js --stage=prod
 *
 * Reads PROJECT_NAME from ./cloud.env (same convention as existing npm scripts).
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs(argv) {
  const out = {};
  for (const arg of argv) {
    if (!arg.startsWith("--")) continue;
    const [k, ...rest] = arg.slice(2).split("=");
    out[k] = rest.length ? rest.join("=") : "true";
  }
  return out;
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    if (!key) continue;
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function toDotenvLine(key, value) {
  // Always quote via JSON for safe shell + dotenv parsing.
  return `${key}=${JSON.stringify(String(value ?? ""))}`;
}

function main() {
  const { stage, out } = parseArgs(process.argv.slice(2));
  if (!stage) {
    console.error("Missing --stage=staging or --stage=prod");
    process.exit(1);
  }

  const repoRoot = path.resolve(__dirname, "..");
  loadEnvFile(path.join(repoRoot, "aws", "cloud.env"));

  const stackNamePrefix = process.env.StackName || process.env.PROJECT_NAME;
  if (!stackNamePrefix) {
    console.error('Missing StackName (or PROJECT_NAME). Set it in "cloud.env" (or env).');
    process.exit(1);
  }

  const stackName = `${stackNamePrefix}-${stage}`;

  let parsed;
  try {
    const stdout = execFileSync(
      "aws",
      [
        "cloudformation",
        "describe-stacks",
        "--stack-name",
        stackName,
        "--output",
        "json",
      ],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
    );
    parsed = JSON.parse(stdout);
  } catch (err) {
    const msg = err && err.stderr ? String(err.stderr) : String(err);
    console.error(`Failed to read stack outputs for "${stackName}".`);
    console.error(msg.trim());
    process.exit(1);
  }

  const outputs = parsed?.Stacks?.[0]?.Outputs ?? [];
  const lines = [
    `# Generated from CloudFormation stack outputs`,
    `# stack=${stackName}`,
    `# stage=${stage}`,
    `# generatedAt=${new Date().toISOString()}`,
    "",
    ...outputs.map((o) => toDotenvLine(o.OutputKey, o.OutputValue)),
    "",
  ];

  const outFile = out || `${os.homedir()}/.aws-stacks/${stackName}.env`;
  const outPath = path.resolve(repoRoot, outFile);
  fs.writeFileSync(outPath, lines.join("\n"), "utf8");

  console.log(`Wrote ${outputs.length} outputs to ${outPath}`);
}

main();
