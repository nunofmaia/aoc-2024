import { createReadStream } from "node:fs";
import readline from "node:readline";
import { assert } from "../utils.mjs";

async function main() {
  const inputStream = createReadStream("./input.txt", "utf8");
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });

  let result = 0;
  /** @type {number[][]} */
  let locks = [];
  /** @type {number[][]} */
  let keys = [];

  /** @type {string[][]} */
  let schema = [];
  for await (const line of rl) {
    if (line === "") {
      continue;
    }

    schema.push(line.split(""));

    if (schema.length < 7) {
      continue;
    }

    const list = schema[0]?.[0] === "#" ? locks : keys;

    /** @type {number[]} */
    let lengths = [];
    for (let y = 0; y < schema.length; y++) {
      const row = schema[y];
      assert(row);

      for (let x = 0; x < row.length; x++) {
        if (row[x] !== "#") {
          continue;
        }

        const v = lengths[x] ?? -1;
        assert(v);

        lengths[x] = v + 1;
      }
    }

    assert(lengths);

    list.push(lengths);
    schema = [];
  }

  for (const lock of locks) {
    for (const key of keys) {
      let fit = true;

      for (let i = 0; i < lock.length; i++) {
        const l = lock[i];
        const k = key[i];
        assert(l), assert(k);

        if (l + k > 5) {
          fit = false;
          break;
        }
      }

      if (fit) {
        result++;
      }
    }
  }

  console.log(result);
}

main();
