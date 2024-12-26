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
    let fixed = false;
    for (const page of pages) {
      let hasMissingDeps = false;

      for (let i = 0; i < update.length; i++) {
        const p = update[i] || "";
        if (!deps[page]?.includes(p || "")) {
          continue;
        }

        hasMissingDeps = true;
        fixed = true;

        const left = update.slice(0, i);
        const right = update.slice(i + 1);

        update = [...left, page, p, ...right];
        break;
      }

      if (!hasMissingDeps) {
        update.push(page);
      }
    }

    if (!fixed) {
      continue;
    }

    result += +(update[(update.length - 1) / 2] || "0");
  }

  console.log(result);
}

main();
