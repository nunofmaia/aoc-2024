import { createReadStream } from "node:fs";
import readline from "node:readline";
import { assert } from "../utils.mjs";

/** @typedef {{ x: number; y: number }} Coord */

const HEAD = 0;
const TAIL = 9;

async function main() {
  const inputStream = createReadStream("./input.txt", "utf8");
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });

  let result = 0;
  /** @type {number[][]} */
  let lines = [];
  /** @type {Coord[]} */
  let heads = [];

  let y = 0;
  for await (const line of rl) {
    const values = line.split("").map(Number);

    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      assert(value);

      if (value === HEAD) {
        heads.push({ x: i, y });
      }
    }

    y++;
    lines.push(values);
  }

  for (const head of heads) {
    const coords = traverse(lines, head);
    const tails = new Set(coords.map(({ x, y }) => `${x},${y}`));

    result += tails.size;
  }

  console.log(result);
}

/**
 * @param {number[][]} map
 * @param {Coord} head
 * @param {number} value
 * @returns {Coord[]}
 */
function traverse(map, head, value = HEAD) {
  const len = map.length - 1;

  const left = { x: head.x - 1, y: head.y };
  const right = { x: head.x + 1, y: head.y };
  const up = { x: head.x, y: head.y - 1 };
  const down = { x: head.x, y: head.y + 1 };

  /** @type {Coord[]} */
  const next = [];

  [left, right, up, down].forEach((coord) => {
    if (coord.x < 0 || coord.x > len || coord.y < 0 || coord.y > len) {
      return;
    }

    const line = map[coord.y];
    assert(line);

    const v = line[coord.x];
    assert(v);

    if (v === value + 1) {
      next.push(coord);
    }
  });

  if (next.length === 0) {
    return [];
  }

  if (value + 1 === TAIL && next.length > 0) {
    return next;
  }

  return next.flatMap((coord) => traverse(map, coord, value + 1));
}

main();
