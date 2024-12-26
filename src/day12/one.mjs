import { createReadStream } from "node:fs";
import readline from "node:readline";
import { assert } from "../utils.mjs";

/** @typedef {{ x: number, y: number }} Coord */

async function main() {
  const inputStream = createReadStream("./input.txt", "utf8");
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });

  let result = 0;
  /** @type {string[][]} */
  const map = [];

  for await (const line of rl) {
    const plants = line.split("");

    map.push(plants);
  }

  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    assert(row);

    for (let x = 0; x < row.length; x++) {
      const plant = row[x] ?? "";

      if (plant === ".") {
        continue;
      }

      const [area, perimeter, coords] = traverse(map, { x, y });

      for (const coord of coords) {
        const r = map[coord.y];
        assert(r);

        r[coord.x] = ".";
      }

      result += area * perimeter;
    }
  }

  console.log(result);
}

/**
 * @param {string[][]} map
 * @param {Coord} coord
 * @param {Coord[]} [visited]
 *
 * @return {[number, number, Coord[]]}
 */
function traverse(map, coord, visited = []) {
  const plant = map[coord.y]?.[coord.x];
  assert(plant);

  if (visited.some((v) => v.x === coord.x && v.y === coord.y)) {
    return [0, 0, visited];
  }

  /** @type {(coord: Coord) => boolean} */
  const valid = (coord) =>
    coord.x >= 0 &&
    coord.x < map.length &&
    coord.y >= 0 &&
    coord.y < map.length &&
    map[coord.y]?.[coord.x] === plant;

  const adjacents = [
    { x: coord.x, y: coord.y - 1 },
    { x: coord.x, y: coord.y + 1 },
    { x: coord.x - 1, y: coord.y },
    { x: coord.x + 1, y: coord.y },
  ].filter(valid);

  const perimeter = 4 - adjacents.length;

  const next = adjacents.filter(
    (n) => !visited.some((v) => v.x === n.x && v.y === n.y),
  );

  visited.push(coord);

  if (next.length === 0) {
    return [1, perimeter, visited];
  }

  return next.reduce(
    (acc, n) => {
      const [area, perimeter, coords] = traverse(map, n, visited);

      return [acc[0] + area, acc[1] + perimeter, [...acc[2], ...coords]];
    },
    [1, perimeter, /** @type {Coord[]} */ ([])],
  );
}

main();
