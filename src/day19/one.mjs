import { createReadStream } from "node:fs";
import readline from "node:readline";
import { assert } from "../utils.mjs";

async function main() {
  const inputStream = createReadStream("./input.txt", "utf8");
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });

  let result = 0;

  /** @type {string[]} */
  let patterns = [];

  for await (const line of rl) {
    if (line === "") {
      continue;
    }

    if (patterns.length === 0) {
      patterns = line.split(", ");
      continue;
    }

    const open = [line];
    /** @type {Record<string, boolean>} */
    const visited = {};

    while (open.length > 0) {
      const design = open.shift();
      assert(design);

      visited[design] = true;

      if (design === "") {
        result++;
        break;
      }

      const start = patterns.filter((p) => design.startsWith(p));

      for (const s of start) {
        const next = design.substring(s.length);

        if (visited[next]) {
          continue;
        }

        const i = open.findIndex((o) => o.length > next.length);

        if (i === -1) {
          open.push(next);
          continue;
        }

        open.splice(i, 0, next);
      }
    }
  }

  console.log(result);
}

main();
