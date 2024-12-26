import { createReadStream } from "node:fs";
import readline from "node:readline";

async function main() {
  const inputStream = createReadStream("./input.txt", "utf8");
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });

  let result = 0;
  /** @type {string[]} */
  let lines = [];

  for await (const line of rl) {
    lines.push(line);
  }

  const len = lines.length - 1;

  for (let i = 0; i <= len; i++) {
    for (let j = 0; j <= len; j++) {
      if (matchesTop(lines, i, j)) {
        result++;
      }

      if (matchesLeft(lines, i, j)) {
        result++;
      }

      if (matchesRight(lines, i, j)) {
        result++;
      }

      if (matchesBottom(lines, i, j)) {
        result++;
      }
    }
  }

  console.log(result);
}

/**
 * @param {string[]} lines
 * @param {number} i
 * @param {number} j
 */
function matchesTop(lines, i, j) {
  const len = lines.length - 1;

  // M M
  //  A
  // S S

  return (
    i + 2 <= len &&
    j + 2 <= len &&
    lines[i]?.[j] === "M" &&
    lines[i]?.[j + 2] === "M" &&
    lines[i + 1]?.[j + 1] === "A" &&
    lines[i + 2]?.[j] === "S" &&
    lines[i + 2]?.[j + 2] === "S"
  );
}

/**
 * @param {string[]} lines
 * @param {number} i
 * @param {number} j
 */
function matchesBottom(lines, i, j) {
  const len = lines.length - 1;

  // S S
  //  A
  // M M

  return (
    i + 2 <= len &&
    j + 2 <= len &&
    lines[i]?.[j] === "S" &&
    lines[i]?.[j + 2] === "S" &&
    lines[i + 1]?.[j + 1] === "A" &&
    lines[i + 2]?.[j] === "M" &&
    lines[i + 2]?.[j + 2] === "M"
  );
}

/**
 * @param {string[]} lines
 * @param {number} i
 * @param {number} j
 */
function matchesLeft(lines, i, j) {
  const len = lines.length - 1;

  // M S
  //  A
  // M S

  return (
    i + 2 <= len &&
    j + 2 <= len &&
    lines[i]?.[j] === "M" &&
    lines[i]?.[j + 2] === "S" &&
    lines[i + 1]?.[j + 1] === "A" &&
    lines[i + 2]?.[j] === "M" &&
    lines[i + 2]?.[j + 2] === "S"
  );
}

/**
 * @param {string[]} lines
 * @param {number} i
 * @param {number} j
 */
function matchesRight(lines, i, j) {
  const len = lines.length - 1;

  // S M
  //  A
  // S M

  return (
    i + 2 <= len &&
    j + 2 <= len &&
    lines[i]?.[j] === "S" &&
    lines[i]?.[j + 2] === "M" &&
    lines[i + 1]?.[j + 1] === "A" &&
    lines[i + 2]?.[j] === "S" &&
    lines[i + 2]?.[j + 2] === "M"
  );
}

main();
