import { createReadStream } from "node:fs";
import readline from "node:readline";
import { assert } from "../utils.mjs";

const BLINKS = 25;

async function main() {
  const inputStream = createReadStream("./input.txt", "utf8");
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });

  let result = 0;

  for await (const line of rl) {
    let stones = line.split(" ").map(Number);

    for (let i = 0; i < BLINKS; i++) {
      /** @type {typeof stones} */
      let next = [];

      for (const stone of stones) {
        const stoneStr = `${stone}`;
        assert(stone);

        if (stone === 0) {
          next.push(1);
        } else if (stoneStr.length % 2 === 0) {
          const left = +stoneStr.slice(0, stoneStr.length / 2);
          const right = +stoneStr.slice(stoneStr.length / 2);

          next.push(left, right);
        } else {
          next.push(stone * 2024);
        }
      }

      stones = next;
    }

    result += stones.length;
  }

  console.log(result);
}

main();
