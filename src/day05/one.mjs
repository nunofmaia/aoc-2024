import { createReadStream } from "node:fs";
import readline from "node:readline";

async function main() {
  const inputStream = createReadStream("./input.txt", "utf8");
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });

  let result = 0;
  /** @type {Record<string, string[]>} */
  let deps = {};
  let ready = false;

  for await (const line of rl) {
    if (line === "") {
      ready = true;
      continue;
    }

    if (!ready) {
      const [a, b] = line.split("|");
      if (!a || !b) {
        throw new Error(`Invalid line`);
      }

      deps[a] ||= [];
      deps[a].push(b);

      continue;
    }

    const pages = line.split(",");

    /** @type {string[]} */
    let update = [];
    for (const page of pages) {
      const hasMissingDeps = deps[page]?.some((p) => update.includes(p));

      if (hasMissingDeps) {
        update = [];
        break;
      }

      update.push(page);
    }

    if (update.length === 0) {
      continue;
    }

    result += +(update[(update.length - 1) / 2] || "0");
  }

  console.log(result);
}

main();
