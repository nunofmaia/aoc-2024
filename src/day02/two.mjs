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
    if (isSafe(line)) {
      result++;
    }
  }

  console.log(result);
}

/**
 * @param {string} line
 */
function isSafe(line) {
  const levels = line.split(" ");

  for (let i = 1; i < levels.length + 1; i++) {
    const left = levels.slice(0, i - 1);
    const right = levels.slice(i);

    const [a, ...values] = [...left, ...right];

    let previous = parseInt(/** @type {string} */ (a));
    /** @type {Direction | undefined} */
    let direction;
    let safe = true;

    for (const level of values) {
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

    if (!safe) {
      continue;
    }

    return safe;
  }

  return false;
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
