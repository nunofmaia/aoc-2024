import { createReadStream } from "node:fs";
import readline from "node:readline";

/** @typedef {"asc" | "desc"} Direction */

async function main() {
  const inputStream = createReadStream("./input.txt", "utf8");
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });

  let result = 0;

  for await (const line of rl) {
    const [a, ...levels] = line.split(" ");

    let previous = parseInt(/** @type {string} */ (a));
    /** @type {Direction | undefined} */
    let direction;
    let safe = true;

    for (const level of levels) {
      const parsedLevel = parseInt(level);
      const currentDirection = getDirection(previous, parsedLevel);
      const close = isClose(previous, parsedLevel);

      if ((direction && direction !== currentDirection) || !close) {
        safe = false;
        break;
      }

      direction = currentDirection;
      previous = parsedLevel;
    }

    if (safe) {
      result++;
    }
  }

  console.log(result);
}

/**
 * @param {number} a
 * @param {number} b
 * @returns {Direction}
 */
function getDirection(a, b) {
  return a < b ? "asc" : "desc";
}

/**
 * @param {number} a
 * @param {number} b
 * @returns {boolean}
 */
function isClose(a, b) {
  const diff = Math.abs(a - b);
  return diff >= 1 && diff <= 3;
}

main();
