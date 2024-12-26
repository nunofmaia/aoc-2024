import { createReadStream } from "node:fs";
import readline from "node:readline";

const MUL = /mul\((\d+,\d+)\)/g;

async function main() {
  const inputStream = createReadStream("./input.txt", "utf8");
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });

  let result = 0;

  for await (const line of rl) {
    const match = line.matchAll(MUL);

    if (!match) {
      continue;
    }

    for (const m of match) {
      const value = m[1];

      if (!value) {
        continue;
      }

      const [a, b] = value.split(",").map(Number);

      if (!a || !b) {
        continue;
      }

      result += a * b;
    }
  }

  console.log(result);
}

main();
