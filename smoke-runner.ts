import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import dotenv from "dotenv";
import { HyperClient } from "hyperttp";

dotenv.config();

const projectRoot = path.resolve(import.meta.dirname, ".");
const isVerbose = process.argv.includes("--verbose");
const isBun = !!process.versions.bun;

type TestEntry = { label: string; file: string };

// ----------------------------
// SCAN FILES
// ----------------------------
function scanDir(dir: string): TestEntry[] {
  const absDir = path.resolve(projectRoot, dir);
  if (!fs.existsSync(absDir)) return [];

  const entries: TestEntry[] = [];
  const items = fs.readdirSync(absDir, { withFileTypes: true });

  for (const item of items) {
    const absPath = path.join(absDir, item.name);

    if (item.isDirectory()) {
      entries.push(...scanDir(path.relative(projectRoot, absPath)));
    } else if (item.isFile() && item.name.endsWith(".ts")) {
      entries.push({
        label: path.relative(projectRoot, absPath),
        file: absPath
      });
    }
  }

  return entries;
}

const tests: TestEntry[] = [...scanDir("example"), ...scanDir("tests")];

// ----------------------------
// RUN SINGLE TEST
// ----------------------------
async function runOne(test: TestEntry) {
  if (!fs.existsSync(test.file)) {
    console.log(
      `${chalk.dim("→")} ${chalk.bold(test.label)} ${chalk.yellow("⚠ missing")}`
    );
    return { label: test.label, ok: false, ms: 0 };
  }

  const start = performance.now();

  const cmd = isBun ? "bun" : "npx";
  const args = isBun ? ["run", test.file] : ["tsx", test.file];

  const child = spawn(cmd, args, {
    cwd: projectRoot,
    env: {
      ...process.env // 🔥 CRITICAL: YM_ACCESS_TOKEN / YM_UID
    },
    stdio: isVerbose ? "inherit" : ["ignore", "pipe", "pipe"]
  });

  let output = "";

  if (!isVerbose) {
    child.stdout?.on("data", (d) => {
      output += d.toString();
    });

    child.stderr?.on("data", (d) => {
      output += d.toString();
    });
  }

  return new Promise((resolve) => {
    child.on("close", (code) => {
      const ms = Math.round(performance.now() - start);
      const ok = code === 0;

      console.log(
        `${chalk.dim("→")} ${chalk.bold(test.label)} ${
          ok ? chalk.green("✔") : chalk.red("✖")
        } ${chalk.gray(`[${ms}ms]`)}`
      );

      if (!ok && output.trim() && !isVerbose) {
        console.log(
          chalk.gray(output.trim().split("\n").slice(-10).join("\n"))
        );
      }

      resolve({ label: test.label, ok, ms });
    });
  });
}

// ----------------------------
// MAIN
// ----------------------------
(async () => {
  const runtime = isBun ? chalk.yellow("Bun") : chalk.green("Node/tsx");
  const core = new HyperClient();

  console.log(chalk.cyan(`\n🚀 Smoke tests (${runtime})\n`));
  console.log(chalk.cyan(`Transport: ${await core.getTransportName()}`));

  const results = [];

  for (const test of tests) {
    results.push(await runOne(test));
  }

  const ok = results.filter((r) => (r as any).ok).length;
  const fail = results.length - ok;

  console.log(chalk.cyan("\n═ Summary ═══════════════════════════"));

  for (const r of results) {
    console.log(
      `${(r as any).ok ? chalk.green("✔") : chalk.red("✖")} ${(r as any).label} ${chalk.gray(
        `[${(r as any).ms}ms]`
      )}`
    );
  }

  console.log(
    `\nTotal: ${results.length} | ${chalk.green(ok)} ok | ${chalk.red(fail)} failed\n`
  );

  process.exit(fail > 0 ? 1 : 0);
})();
