import { createReadStream } from "node:fs";
import readline from "node:readline";
import { assert } from "../utils.mjs";

/** @typedef {{ x: number; y: number }} Coord */

const X = 101;
const Y = 103;

async function main() {
  const inputStream = createReadStream("./input.txt", "utf8");
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });

  let result = 0;
  /** @type {[Coord, Coord][]} */
  let positions = [];

  for await (const line of rl) {
    const [p, v] = line.split(" ");
    assert(p), assert(v);

    const [px, py] = p.substring(2).split(",").map(Number);
    assert(px), assert(py);

    const [vx, vy] = v.substring(2).split(",").map(Number);
    assert(vx), assert(vy);

    positions.push([
      { x: px, y: py },
      { x: vx, y: vy },
    ]);
  }

  let seconds = 100;
  while (seconds > 0) {
    for (let i = 0; i < positions.length; i++) {
      const entry = positions[i];
      assert(entry);

      const [p, v] = entry;

      p.x += v.x;
      p.y += v.y;

      if (p.x < 0) {
        p.x += X;
      }

      if (p.x >= X) {
        p.x -= X;
      }

      if (p.y < 0) {
        p.y += Y;
      }

      if (p.y >= Y) {
        p.y -= Y;
      }

      positions[i] = [p, v];
    }

    seconds--;
  }

  const middleX = Math.floor(X / 2);
  const middleY = Math.floor(Y / 2);

  let quadrants = { 1: 0, 2: 0, 3: 0, 4: 0 };

  for (const [p] of positions) {
    if (p.x < middleX && p.y < middleY) {
      quadrants[1]++;
    } else if (p.x > middleX && p.y < middleY) {
      quadrants[2]++;
    } else if (p.x < middleX && p.y > middleY) {
      quadrants[3]++;
    } else if (p.x > middleX && p.y > middleY) {
      quadrants[4]++;
    }
  }

  result = Object.values(quadrants).reduce((acc, v) => acc * v, 1);

  console.log(result);
}

main();
