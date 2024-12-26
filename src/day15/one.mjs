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
  /** @type {"map" | "moves"} */
  let mode = "map";
  /** @type {string[][]} */
  let map = [];
  /** @type {Coord | undefined} */
  let robot;

  let y = 0;
  for await (const line of rl) {
    if (line === "") {
      mode = "moves";
      continue;
    }

    if (mode === "map") {
      const row = line.split("");

      map.push(row);

      if (!robot) {
        const x = row.findIndex((c) => c === "@");
        robot = x > -1 ? { x, y } : undefined;
      }

      y++;
      continue;
    }

    const moves = line.split("");

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      assert(move), assert(robot);

      const next = walk(robot, move);

      const nextRow = map[next.y];
      assert(nextRow);

      const char = nextRow[next.x];
      assert(char);

      if (char === "#") {
        continue;
      }

      if (char === ".") {
        const currentRow = map[robot.y];
        assert(currentRow);

        currentRow[robot.x] = ".";
        nextRow[next.x] = "@";

        robot = next;
      }

      if (char === "O") {
        let seek = { x: next.x, y: next.y };
        /** @type {Coord[]} */
        let coords = [next];
        let seekRow = map[seek.y];
        assert(seekRow);

        while (seekRow[seek.x] === "O") {
          const p = walk(seek, move);

          coords.push(p);

          seek = p;
          seekRow = map[seek.y];
          assert(seekRow);
        }

        if (seekRow[seek.x] === "#") {
          continue;
        }

        for (let i = coords.length - 1; i > 0; i--) {
          const curr = coords[i];
          const prev = coords[i - 1];
          assert(curr), assert(prev);

          const currRow = map[curr.y];
          const prevRow = map[prev.y];
          assert(currRow), assert(prevRow);

          const c = currRow[curr.x];
          const p = prevRow[prev.x];
          assert(c), assert(p);

          currRow[curr.x] = p;
          prevRow[prev.x] = c;
        }

        const currentRow = map[robot.y];
        assert(currentRow);

        currentRow[robot.x] = ".";
        nextRow[next.x] = "@";

        robot = next;
      }
    }
  }

  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    assert(row);

    for (let x = 0; x < row.length; x++) {
      if (row[x] !== "O") {
        continue;
      }

      result += 100 * y + x;
    }
  }

  console.log(result);
}

/**
 * @param {Coord} position
 * @param {string} direction
 */
function walk(position, direction) {
  const next = { x: position.x, y: position.y };

  switch (direction) {
    case "<":
      next.x--;
      break;
    case ">":
      next.x++;
      break;
    case "^":
      next.y--;
      break;
    case "v":
      next.y++;
      break;
  }

  return next;
}

main();
