import { createReadStream } from "node:fs";
import readline from "node:readline";

import { assert } from "../utils.mjs";

/** @typedef {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7} Operand */

async function main() {
  const inputStream = createReadStream("./input.txt", "utf8");
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });

  let result = "";

  let A = 0;
  let B = 0;
  let C = 0;
  /** @type {number[]} */
  let program = [];
  let pointer = 0;

  for await (const line of rl) {
    if (line === "") {
      continue;
    }

    const [header, value] = line.split(": ");
    assert(header), assert(value);

    switch (header) {
      case "Register A": {
        A = +value;
        break;
      }
      case "Register B": {
        B = +value;
        break;
      }
      case "Register C": {
        C = +value;
        break;
      }
    }

    if (header !== "Program") {
      continue;
    }

    program = value.split(",").map(Number);
  }

  /**
   * @param {Operand} operand
   */
  function combo(operand) {
    switch (operand) {
      case 0:
      case 1:
      case 2:
      case 3:
        return operand;
      case 4:
        return A;
      case 5:
        return B;
      case 6:
        return C;
      default:
        throw new Error(`Invalid operand ${operand}`);
    }
  }
  /**
   * @param {Operand} operand
   */
  function literal(operand) {
    return operand;
  }

  const instructions = {
    /** @type {(op: Operand) => void} adv */
    0: (op) => {
      A = Math.floor(A / Math.pow(2, combo(op)));
    },
    /** @type {(op: Operand) => void} bxl */
    1: (op) => {
      B = B ^ literal(op);
    },
    /** @type {(op: Operand) => void} bst */
    2: (op) => {
      B = combo(op) % 8;
    },
    /** @type {(op: Operand) => void} jnz */
    3: (op) => {
      if (A === 0) {
        return;
      }

      // This will be incremented afterwards
      pointer = literal(op) - 2;
    },
    /** @type {(op: Operand) => void} bxc */
    4: (_) => {
      B = B ^ C;
    },
    /** @type {(op: Operand) => number} out */
    5: (op) => {
      return combo(op) % 8;
    },
    /** @type {(op: Operand) => void} bdv */
    6: (op) => {
      B = Math.floor(A / Math.pow(2, combo(op)));
    },
    /** @type {(op: Operand) => void} cdv */
    7: (op) => {
      C = Math.floor(A / Math.pow(2, combo(op)));
    },
  };

  /** @type {number[]} */
  let out = [];
  for (; pointer < program.length; pointer += 2) {
    const operand = /** @type {Operand} */ (program[pointer]);
    const opcode = /** @type {keyof instructions} */ (program[pointer + 1]);

    assert(opcode), assert(operand);

    const v = instructions[operand](opcode);

    if (v !== undefined) {
      out.push(v);
    }
  }

  result = out.join(",");

  console.log(result);
}

main();
