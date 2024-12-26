import { createReadStream } from "node:fs";
import readline from "node:readline";

const MUL = /mul\((\d+,\d+)\)/g;

async function main() {
  const inputStream = createReadStream("./input.txt", "utf8");
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });

  let result = 0;
  let input = "";
  let pause = false;

  for await (const line of rl) {
    for (let i = 0; i < line.length; i++) {
      const rest = line.slice(i);
      const shouldPause = rest.startsWith("don't()");
      const shouldResume = rest.startsWith("do()");

      if (shouldPause) {
        i += "don't()".length - 1;
        pause = true;
      } else if (shouldResume) {
        i += "do()".length - 1;
        pause = false;
      }

      if (!pause) {
        input += line[i];
      }
    }
  }

  const match = input.matchAll(MUL);

  if (!match) {
    return 0;
  }

  for (const m of match) {
    const value = m[1];

    if (!value) {
      continue;
    }

    const [a, b] = value.split(",").map(Number);

    if (!a || !b) {
      continue;
    }

    result += a * b;
  }

  console.log(result);
}

main();
