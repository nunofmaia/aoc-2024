import { createReadStream } from "node:fs";
import readline from "node:readline";

async function main() {
  const inputStream = createReadStream("./input.txt", "utf8");
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });

  let result = 0;
  for await (const line of rl) {
    const [t = "", rest = ""] = line.split(":");
    const test = +t;
    const values = rest.trim().split(" ").map(Number);

    const valid = traverse(0, values, test);

    if (valid) {
      result += test
    }
  }

  console.log(result);
}

/**
 * @param {number} root
 * @param {number[]} nodes
 * @param {number} expected
 *
 * @return {boolean}
 */
function traverse(root, nodes, expected) {
  if (nodes.length === 0) {
    return root === expected;
  }

  const [v = 0, ...rest] = nodes;
  const a = traverse(root + v, rest, expected);
  const b = traverse(root * v, rest, expected);

  return a || b;
}

main();
