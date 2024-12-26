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

  for await (const line of rl) {
    const mapping = line.split("");
    /** @type {string[]} */
    const disk = [];

    let process = true;
    for (let i = 0, j = 0; j < line.length; j++) {
      const value = mapping[j];
      assert(value);

      const n = +value;
      for (let k = 0; k < n; k++) {
        disk.push(process ? `${i}` : ".");
      }

      if (process) {
        i++;
      }

      process = !process;
    }

    const len = disk.length - 1;
    for (let i = 0, j = len; i < len && i < j; ) {
      const a = disk[i];
      assert(a);

      if (a !== ".") {
        i++;
        continue;
      }

      const b = disk[j];
      assert(b);

      if (b === ".") {
        j--;
        continue;
      }

      disk[i] = b;

      disk[j] = ".";

      i++, j--;
    }

    for (let i = 0; i < disk.length; i++) {
      const value = disk[i];
      assert(value);

      if (value === ".") {
        break;
      }

      result += +value * i;
    }
  }

  console.log(result);
}

main();
