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
  let lines = [];
  /** @type {Record<string, Coord[]>} */
  let antennas = {};

  let y = 0;
  for await (const line of rl) {
    const locations = line.split("");

    for (let x = 0; x < locations.length; x++) {
      const location = locations[x];
      assert(location);

      if (location === ".") {
        continue;
      }

      antennas[location] ||= [];
      antennas[location].push({ x, y });
    }

    lines.push(locations);
    y++;
  }

  const entries = Object.entries(antennas);
  /** @type {Coord[]} */
  let nodes = [];

  for (const [antenna, coords] of entries) {
    for (const ref of coords) {
      for (const coord of coords) {
        if (ref.x === coord.x && ref.y === coord.y) {
          continue;
        }

        const dx = ref.x - coord.x;
        const dy = ref.y - coord.y;

        const node1 = { x: ref.x - dx, y: ref.y - dy };
        const node2 = { x: ref.x + dx, y: ref.y + dy };

        if (
          node1.x >= 0 &&
          node1.x < lines.length &&
          node1.y >= 0 &&
          node1.y < lines.length &&
          lines[node1.y]?.[node1.x] !== antenna &&
          !nodes.find((node) => node.x === node1.x && node.y === node1.y)
        ) {
          nodes.push(node1);
        }

        if (
          node2.x >= 0 &&
          node2.x < lines.length &&
          node2.y >= 0 &&
          node2.y < lines.length &&
          lines[node2.y]?.[node2.x] !== antenna &&
          !nodes.find((node) => node.x === node2.x && node.y === node2.y)
        ) {
          nodes.push(node2);
        }
      }
    }
  }

  result = nodes.length;

  console.log(result);
}

main();
