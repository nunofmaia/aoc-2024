import { createReadStream } from "node:fs";
import readline from "node:readline";

import { assert } from "../utils.mjs";

/** @typedef {{ x: number; y: number }} Coord */

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

  let y = 0;
  for await (const line of rl) {
    const row = line.split("");

    if (!start) {
      const x = row.findIndex((c) => c === "S");
      start = x > -1 ? { x, y } : undefined;
    }

    if (!end) {
      const x = row.findIndex((c) => c === "E");
      end = x > -1 ? { x, y } : undefined;
    }

    map.push(row);

    y++;
  }

  assert(start), assert(end);

  /** @typedef {{ coord: Coord; score: number; direction: string }} Node */

  /** @type {Node[]} */
  let open = [{ coord: start, score: 0, direction: ">" }];
  /** @type {Node | undefined} */
  let final;

  while (open.length > 0) {
    const position = open.shift();
    assert(position);

    const { coord, score, direction } = position;

    if (coord.x === end.x && coord.y === end.y) {
      final = position;
      break;
    }

    const row = map[coord.y];
    assert(row);

    row[coord.x] = "O";

    const adjacents = [
      { x: coord.x + 1, y: coord.y },
      { x: coord.x - 1, y: coord.y },
      { x: coord.x, y: coord.y - 1 },
      { x: coord.x, y: coord.y + 1 },
    ];

    for (const adjacent of adjacents) {
      const char = map[adjacent.y]?.[adjacent.x];

      if (
        adjacent.x < 0 ||
        adjacent.x >= map.length ||
        adjacent.y < 0 ||
        adjacent.y >= map.length ||
        char === "#" ||
        char === "O"
      ) {
        continue;
      }

      const [stepScore, nextDirection] = step(coord, adjacent, direction);
      const next = {
        coord: adjacent,
        score: score + stepScore,
        direction: nextDirection,
      };

      const i = open.findIndex((c) => c.score > score);

      if (i === -1) {
        open.push(next);
        continue;
      }

      open.splice(i, 0, next);
    }
  }

  assert(final);

  let { score } = final;

  result = score;

  console.log(result);
}

/**
 * @param {Coord} current
 * @param {Coord} next
 * @param {string} direction
 *
 * @returns {[number, string]}
 */
function step(current, next, direction) {
  switch (direction) {
    case ">": {
      if (next.x === current.x - 1) {
        return [2001, "<"];
      }

      if (next.y === current.y - 1) {
        return [1001, "^"];
      }

      if (next.y === current.y + 1) {
        return [1001, "v"];
      }

      return [1, direction];
    }
    case "<": {
      if (next.x === current.x + 1) {
        return [2001, ">"];
      }

      if (next.y === current.y - 1) {
        return [1001, "^"];
      }

      if (next.y === current.y + 1) {
        return [1001, "v"];
      }

      return [1, direction];
    }
    case "^": {
      if (next.y === current.y + 1) {
        return [2001, "v"];
      }

      if (next.x === current.x - 1) {
        return [1001, "<"];
      }

      if (next.x === current.x + 1) {
        return [1001, ">"];
      }

      return [1, direction];
    }
    case "v": {
      if (next.y === current.y - 1) {
        return [2001, "^"];
      }

      if (next.x === current.x - 1) {
        return [1001, "<"];
      }

      if (next.x === current.x + 1) {
        return [1001, ">"];
      }

      return [1, direction];
    }
  }

  return [1, direction];
}

main();
