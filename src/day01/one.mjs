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
  /** @type {number[]} */
  let y = [];
  for await (const line of rl) {
    const [a, b] = line.split("   ")

    if (!a || !b) {
      throw new Error("Invalid input");
    }

    x.push(parseInt(a));
    y.push(parseInt(b));
  }

  const sortedX = x.sort()
  const sortedY = y.sort()

  const result = sortedX.reduce((acc, v, i) => {
    return acc + Math.abs(v - (sortedY[i] || 0))
  }, 0)

  console.log(result);
}

main();
