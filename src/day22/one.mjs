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
    let secret = Number(line);

    for (let i = 0; i < 2000; i++) {
      secret = prune(mix(secret, secret * 64));
      secret = prune(mix(secret, Math.floor(secret / 32)));
      secret = prune(mix(secret, secret * 2048));
    }

    result += secret;
  }

  console.log(result);
}

/**
 * @param {number} secret
 * @param {number} value
 */
function mix(secret, value) {
  return (value ^ secret) >>> 0;
}

/**
 * @param {number} secret
 */
function prune(secret) {
  return secret % 16777216;
}

main();
