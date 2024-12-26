import { createReadStream } from "node:fs";
import readline from "node:readline";
import { assert } from "../utils.mjs";

/** @typedef {{ x: number; y: number }} Coord */

const A_TOKENS = 3;
const B_TOKENS = 1;
const DEFAULT_SETUP = {
  A: { x: 0, y: 0 },
  B: { x: 0, y: 0 },
  P: { x: 0, y: 0 },
};

async function main() {
  const inputStream = createReadStream("./input.txt", "utf8");
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });

  let result = 0;
  let setup = DEFAULT_SETUP;

  for await (const line of rl) {
    if (line === "") {
      setup = DEFAULT_SETUP;
      continue;
    }

    const [type, config] = line.split(":");
    assert(type), assert(config);

    const [dx, dy] = config.trim().split(", ");
    assert(dx), assert(dy);

    const x = +dx.substring(2);
    const y = +dy.substring(2);

    switch (type) {
      case "Button A":
        setup.A = { x, y };
        break;
      case "Button B":
        setup.B = { x, y };
        break;
      case "Prize":
        setup.P = { x, y };
        break;
    }

    if (type !== "Prize") {
      continue;
    }

    let tokens = 0;
    for (let a = 100; a > 0; a--) {
      for (let b = 0; b < 100; b++) {
        if (a + b > 200) {
          break;
        }

        const ax = setup.A.x * a;
        const ay = setup.A.y * a;

        const bx = setup.B.x * b;
        const by = setup.B.y * b;

        const x = ax + bx;
        const y = ay + by;

        if (x === setup.P.x && y === setup.P.y) {
          const value = a * A_TOKENS + b * B_TOKENS;

          if (tokens === 0) {
            tokens = value;
          }

          if (value < tokens) {
            tokens = value;
          }

          continue;
        }
      }
    }

    result += tokens;
  }

  console.log(result);
}

main();
