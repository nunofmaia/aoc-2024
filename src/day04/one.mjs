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
      // Row
      if (matchesRow(lines, i, j)) {
        result++;
      }

      // Column
      if (matchesColumn(lines, i, j)) {
        result++;
      }

      // Diagonal down
      if (matchesDiagDown(lines, i, j)) {
        result++;
      }

      // Diagonal up
      if (matchesDiagUp(lines, i, j)) {
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
function matchesRow(lines, i, j) {
  return (
    j + 3 <= lines.length - 1 &&
    ((lines[i]?.[j] === "X" &&
      lines[i]?.[j + 1] === "M" &&
      lines[i]?.[j + 2] === "A" &&
      lines[i]?.[j + 3] === "S") ||
      (lines[i]?.[j] === "S" &&
        lines[i]?.[j + 1] === "A" &&
        lines[i]?.[j + 2] === "M" &&
        lines[i]?.[j + 3] === "X"))
  );
}

/**
 * @param {string[]} lines
 * @param {number} i
 * @param {number} j
 */
function matchesColumn(lines, i, j) {
  return (
    i + 3 <= lines.length - 1 &&
    ((lines[i]?.[j] === "X" &&
      lines[i + 1]?.[j] === "M" &&
      lines[i + 2]?.[j] === "A" &&
      lines[i + 3]?.[j] === "S") ||
      (lines[i]?.[j] === "S" &&
        lines[i + 1]?.[j] === "A" &&
        lines[i + 2]?.[j] === "M" &&
        lines[i + 3]?.[j] === "X"))
  );
}

/**
 * @param {string[]} lines
 * @param {number} i
 * @param {number} j
 */
function matchesDiagDown(lines, i, j) {
  const len = lines.length - 1;

  return (
    i + 3 <= len &&
    j + 3 <= len &&
    ((lines[i]?.[j] === "X" &&
      lines[i + 1]?.[j + 1] === "M" &&
      lines[i + 2]?.[j + 2] === "A" &&
      lines[i + 3]?.[j + 3] === "S") ||
      (lines[i]?.[j] === "S" &&
        lines[i + 1]?.[j + 1] === "A" &&
        lines[i + 2]?.[j + 2] === "M" &&
        lines[i + 3]?.[j + 3] === "X"))
  );
}

/**
 * @param {string[]} lines
 * @param {number} i
 * @param {number} j
 */
function matchesDiagUp(lines, i, j) {
  const len = lines.length - 1;

  return (
        i + 3 <= len &&
        j - 3 >= 0 &&
        ((lines[i]?.[j] === "X" &&
          lines[i + 1]?.[j - 1] === "M" &&
          lines[i + 2]?.[j - 2] === "A" &&
          lines[i + 3]?.[j - 3] === "S") ||
          (lines[i]?.[j] === "S" &&
            lines[i + 1]?.[j - 1] === "A" &&
            lines[i + 2]?.[j - 2] === "M" &&
            lines[i + 3]?.[j - 3] === "X"))
  );
}

main();
