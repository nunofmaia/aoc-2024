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
  /** @type {[string, number, number] | undefined} */
  let guard;
  /** @type {Set<string>} */
  let positions = new Set();

  let y = 0;
  for await (const line of rl) {
    if (!guard) {
      const x = line
        .split("")
        .findIndex((c) => c === "^" || c === ">" || c === "<" || c === "v");

      if (x !== -1 && line[x]) {
        guard = [line[x], x, y];
      }
    }

    lines.push(line);
    y++;
  }

  if (!guard) {
    throw new Error("No guard found");
  }

  positions.add(pos(guard[1], guard[2]));

  while (true) {
    /** @type {[string, number, number] | undefined} */
    let next;
    const [c, x, y] = guard;

    switch (c) {
      case "^": {
        next = walkUp(lines, x, y);
        break;
      }
      case ">":
        next = walkRight(lines, x, y);
        break;
      case "<":
        next = walkLeft(lines, x, y);
        break;
      case "v":
        next = walkDown(lines, x, y);
        break;
      default: {
        next = guard;
        break;
      }
    }

    if (!next) {
      break;
    }

    const [, a, b] = next;

    if (x !== a || y !== b) {
      positions.add(pos(a, b));
    }

    guard = next;
  }

  result = positions.size;

  console.log(result);
}

/**
 * @param {string[]} lines
 * @param {number} x
 * @param {number} y
 *
 * @returns {[string, number, number] | undefined}
 */
function walkUp(lines, x, y) {
  const yy = y - 1;

  if (yy < 0) {
    return;
  }

  if (lines[yy]?.[x] === "#") {
    return [">", x, y];
  }

  return ["^", x, yy];
}

/**
 * @param {string[]} lines
 * @param {number} x
 * @param {number} y
 *
 * @returns {[string, number, number] | undefined}
 */
function walkDown(lines, x, y) {
  const yy = y + 1;

  if (yy >= lines.length) {
    return;
  }

  if (lines[yy]?.[x] === "#") {
    return ["<", x, y];
  }

  return ["v", x, yy];
}

/**
 * @param {string[]} lines
 * @param {number} x
 * @param {number} y
 *
 * @returns {[string, number, number] | undefined}
 */
function walkLeft(lines, x, y) {
  const xx = x - 1;
  if (xx < 0) {
    return;
  }

  if (lines[y]?.[xx] === "#") {
    return ["^", x, y];
  }

  return ["<", xx, y];
}

/**
 * @param {string[]} lines
 * @param {number} x
 * @param {number} y
 *
 * @returns {[string, number, number] | undefined}
 */
function walkRight(lines, x, y) {
  const xx = x + 1;

  if (xx >= lines.length) {
    return;
  }

  if (lines[y]?.[xx] === "#") {
    return ["v", x, y];
  }

  return [">", xx, y];
}

/**
 * @param {number} x
 * @param {number} y
 */
function pos(x, y) {
  return `${x},${y}`;
}

main();
