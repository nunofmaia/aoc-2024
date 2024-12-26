import { createReadStream } from "node:fs";
import readline from "node:readline";
import { assert } from "../utils.mjs";

/** @typedef {{ x: number; y: number }} Key */
/** @typedef {{ pointer: Key, output: string; sequence: string }} Node */

const NUMERIC_KEYPAD = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  [" ", "0", "A"],
];
const DIR_KEYPAD = [
  [" ", "^", "A"],
  ["<", "v", ">"],
];

async function main() {
  const inputStream = createReadStream("./input.txt", "utf8");
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });

  let result = 0;

  const inputKeys = DIR_KEYPAD.flatMap((row) => row.filter((k) => k !== " "));

  for await (const line of rl) {
    const one = traverse(inputKeys, NUMERIC_KEYPAD, { x: 2, y: 3 }, [line]);
    const two = traverse(inputKeys, DIR_KEYPAD, { x: 2, y: 0 }, one);
    const three = traverse(inputKeys, DIR_KEYPAD, { x: 2, y: 0 }, two, true);

    const [value] = three;
    assert(value);

    const n = Number(line.replace("A", ""));

    result += n * value.length;
  }

  console.log(result);
}

/**
 * @param {string[]} keys
 * @param {string[][]} output
 * @param {Key} pointer
 * @param {string[]} codes
 * @param {boolean} [halt]
 */
function traverse(keys, output, pointer, codes, halt = false) {
  /** @type {Node[]} */
  let open = [{ output: "", sequence: "", pointer }];
  /** @type {string[]} */
  let sequences = [];
  /** @type {number | undefined} */
  let len;

  while (open.length > 0) {
    const position = open.shift();
    assert(position);

    const code = codes.find((c) => c === position.output);
    if (code) {
      len = position.sequence.length;
      sequences.push(position.sequence);

      if (halt) {
        break;
      }

      continue;
    }

    for (const key of keys) {
      const prevKey = position.sequence.at(-1);

      if (prevKey && isInCircles(prevKey, key)) {
        continue;
      }

      const nextPointer = move(output, position.pointer, key);
      if (!nextPointer) {
        continue;
      }

      const outputChar = output[nextPointer.y]?.[nextPointer.x];
      assert(outputChar);

      if (outputChar === " ") {
        continue;
      }

      const next = {
        pointer: nextPointer,
        sequence: position.sequence + key,
        output: key === "A" ? position.output + outputChar : position.output,
      };

      if (
        !codes.some((c) => c.startsWith(next.output)) ||
        (len && next.sequence.length > len)
      ) {
        continue;
      }

      const i = open.findIndex((c) => c.output.length < next.output.length);

      if (i === -1) {
        open.push(next);
        continue;
      }

      open.splice(i, 0, next);
    }
  }

  return sequences;
}

/**
 * @param {string[][]} keypad
 * @param {Key} key
 * @param {string} direction
 */
function move(keypad, key, direction) {
  /** @type {Key | undefined} */
  let next = key;

  switch (direction) {
    case "^":
      next = { x: key.x, y: key.y - 1 };
      break;
    case "v":
      next = { x: key.x, y: key.y + 1 };
      break;
    case "<":
      next = { x: key.x - 1, y: key.y };
      break;
    case ">":
      next = { x: key.x + 1, y: key.y };
      break;
  }

  assert(next);

  if (next.y < 0 || next.y >= keypad.length) {
    return;
  }

  const row = keypad[next.y];
  assert(row);

  if (next.x < 0 || next.x >= row.length) {
    return;
  }

  return next;
}

/**
 * @param {string} keyA
 * @param {string} keyB
 */
function isInCircles(keyA, keyB) {
  return (
    (keyA === ">" && keyB === "<") ||
    (keyA === "<" && keyB === ">") ||
    (keyA === "^" && keyB === "v") ||
    (keyA === "v" && keyB === "^")
  );
}

main();
