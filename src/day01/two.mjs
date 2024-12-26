import { createReadStream } from "node:fs";
import readline from "node:readline";

async function main() {
  const inputStream = createReadStream("./input.txt", "utf8");
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });

  /** @type {number[]} */
  let x = [];
  /** @type {Record<number, number>} */
  let y = {};
  for await (const line of rl) {
    const [a, b] = line.split("   ")

    if (!a || !b) {
      throw new Error("Invalid input");
    }

    x.push(parseInt(a));

    const pb = parseInt(b);
    y[pb] ||= 0;
    y[pb]++;
  }

  const result = x.reduce((acc, v) => {
    return acc + v * (y[v] || 0)
  }, 0)

  console.log(result);
}

main();
