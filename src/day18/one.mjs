import { createReadStream } from "node:fs";
import readline from "node:readline";
import { assert } from "../utils.mjs";

/** @typedef {{ x: number; y: number }} Coord */

// 268, too high
// 254, too high

// let X = 6;
// let Y = 6;
// let BYTES = 12;

let X = 70;
let Y = 70;
let BYTES = 1024;

async function main() {
  const inputStream = createReadStream("./input.txt", "utf8");
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });

  let result = 0;
  /** @type {string[][]} */
  let memory = [];

  for (let y = 0; y <= Y; y++) {
    let row = [];

    for (let x = 0; x <= X; x++) {
      row.push(".");
    }

    memory[y] = row;
  }

  let bytes = 0;
  for await (const line of rl) {
    const [x, y] = line.split(",").map(Number);
    assert(x), assert(y);

    const row = memory[y];
    assert(row);

    row[x] = "#";
    bytes++;

    if (bytes === BYTES) {
      break;
    }
  }

  let start = { x: 0, y: 0 };
  let end = { x: X, y: Y };

  /** @typedef {{ coord: Coord; score: number, dist: number }} Node */
  /** @type {Node[]} */
  let open = [{ coord: start, score: 0, dist: dist(start, end) }];

  while (open.length > 0) {
    const node = open.shift();
    assert(node);

    const row = memory[node.coord.y];
    assert(row);

    row[node.coord.x] = "X";

    if (node.coord.x === end.x && node.coord.y === end.y) {
      result = node.score;
      break;
    }

    const adjacents = [
      { x: node.coord.x + 1, y: node.coord.y },
      { x: node.coord.x, y: node.coord.y + 1 },
      { x: node.coord.x - 1, y: node.coord.y },
      { x: node.coord.x, y: node.coord.y - 1 },
    ];

    for (const adjacent of adjacents) {
      const char = memory[adjacent.y]?.[adjacent.x];

      if (
        adjacent.x < 0 ||
        adjacent.x > X ||
        adjacent.y < 0 ||
        adjacent.y > Y ||
        char === "#" ||
        char === "X"
      ) {
        continue;
      }

      const next = {
        coord: adjacent,
        score: node.score + 1,
        dist: dist(adjacent, end),
      };
      const i = open.findIndex(
        (c) => c.score + c.dist > next.score + next.dist,
      );

      if (i === -1) {
        open.push(next);
        continue;
      }

      open.splice(i, 0, next);
    }
  }

  console.log(result);
}

/**
 * @param {Coord} a
 * @param {Coord} b
 */
function dist(a, b) {
  const dy = Math.abs(a.y - b.y);
  const dx = Math.abs(a.x - b.x);

  return dy + dx + (dy * dx) / (X * Y);
}

main();
