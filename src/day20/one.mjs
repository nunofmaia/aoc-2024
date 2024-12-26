import { createReadStream } from "node:fs";
import readline from "node:readline";
import { assert } from "../utils.mjs";

/** @typedef {{ x: number; y: number }} Coord */

/** @typedef {{ coord: Coord; score: number }} Node */

const DELTA = 100;

async function main() {
  const inputStream = createReadStream("./input.txt", "utf8");
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });

  let result = 0;
  /** @type {string[][]} */
  let map = [];
  /** @type {Coord | undefined} */
  let start;
  /** @type {Coord | undefined} */
  let end;
  /** @type {Coord[]} */
  let walls = [];

  let y = 0;
  for await (const line of rl) {
    const row = line.split("");

    map[y] = row;

    for (let x = 0; x < row.length; x++) {
      const char = row[x];

      if (char === "S") {
        start = { x, y };
      }

      if (char === "E") {
        end = { x, y };
      }

      if (char === "#") {
        walls.push({ x, y });
      }
    }

    y++;
  }

  assert(start), assert(end);

  const base = traverse(map, start, end);

  walls = walls.filter((wall) => {
    if (
      wall.x - 1 < 0 ||
      wall.x + 1 >= map.length ||
      wall.y - 1 < 0 ||
      wall.y + 1 >= map.length
    ) {
      return false;
    }

    const l = map[wall.y]?.[wall.x - 1];
    const r = map[wall.y]?.[wall.x + 1];
    const u = map[wall.y - 1]?.[wall.x];
    const d = map[wall.y + 1]?.[wall.x];

    return [l, r, u, d].filter((w) => w !== "#").length >= 2;
  });

  for (const wall of walls) {
    const row = map[wall.y];
    assert(row);

    row[wall.x] = ".";

    const value = traverse(map, start, end);

    if (value >= 0 && base - value >= DELTA) {
      result++;
    }

    row[wall.x] = "#";
  }

  console.log(result);
}

/**
 * @param {string[][]} map
 * @param {Coord} start
 * @param {Coord} end
 */
function traverse(map, start, end) {
  /** @type {Node[]} */
  let open = [{ coord: start, score: 0 }];
  /** @type {Record<string, boolean>} */
  let visited = {};
  let result = 0;

  while (open.length > 0) {
    const position = open.shift();
    assert(position);

    const { coord, score } = position;
    const row = map[coord.y];
    assert(row);

    if (coord.x === end.x && coord.y === end.y) {
      result = score;
      break;
    }

    visited[id(coord)] = true;

    const adjacents = [
      { x: coord.x, y: coord.y - 1 },
      { x: coord.x + 1, y: coord.y },
      { x: coord.x, y: coord.y + 1 },
      { x: coord.x - 1, y: coord.y },
    ];

    for (const adjacent of adjacents) {
      const char = map[adjacent.y]?.[adjacent.x];

      if (
        adjacent.x < 0 ||
        adjacent.x >= map.length ||
        adjacent.y < 0 ||
        adjacent.y >= map.length ||
        visited[id(adjacent)] ||
        char === "#"
      ) {
        continue;
      }

      const next = { coord: adjacent, score: score + 1 };

      const i = open.findIndex((c) => c.score > next.score);

      if (i === -1) {
        open.push(next);
        continue;
      }

      open.splice(i, 0, next);
    }
  }

  return result;
}

/**
 * @param {Coord} position
 */
function id(position) {
  return `${position.x},${position.y}`;
}

main();
