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
  /** @type {0 | 1} */
  let mode = 0; // 0: wires, 1: connections

  /** @type {Record<string, number>} */
  let wires = {};
  const ops = /** @type {const} */ ({
    /** @type {(l: number, r: number) => number} */
    AND: (l, r) => l & r,
    /** @type {(l: number, r: number) => number} */
    OR: (l, r) => l | r,
    /** @type {(l: number, r: number) => number} */
    XOR: (l, r) => l ^ r,
  });
  /** @type {{ l: string; r: string; op: string; wire: string }[]} */
  let connections = [];

  for await (const line of rl) {
    if (line === "") {
      mode = 1;
      continue;
    }

    if (mode === 0) {
      const [wire, value] = line.split(": ");
      assert(wire), assert(value);

      wires[wire] = Number(value);
      continue;
    }

    const [gate, wire] = line.split(" -> ");
    assert(gate), assert(wire);

    let [left, op, right] = gate.split(" ");
    assert(left), assert(op), assert(right);

    const lvalue = wires[left];
    const rvalue = wires[right];

    if (lvalue !== undefined && rvalue !== undefined) {
      wires[wire] = ops[/** @type {keyof ops} */ (op)](lvalue, rvalue);
    } else {
      connections.push({ l: left, r: right, op, wire });
    }
  }

  while (connections.length > 0) {
    const conn = connections.shift();
    assert(conn);

    const lvalue = wires[conn.l];
    const rvalue = wires[conn.r];

    if (lvalue !== undefined && rvalue !== undefined) {
      wires[conn.wire] = ops[/** @type {keyof ops} */ (conn.op)](
        lvalue,
        rvalue,
      );
    } else {
      connections.push(conn);
    }
  }

  const zz = Object.keys(wires)
    .filter((w) => w.startsWith("z"))
    .sort()
    .reverse()
    .reduce((acc, w) => acc + wires[w], "");

  result = parseInt(zz, 2);

  console.log(result);
}

main();
