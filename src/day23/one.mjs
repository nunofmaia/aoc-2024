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
  /** @type {Record<string, string[]>} */
  let nodes = {};

  for await (const line of rl) {
    const [a, b] = line.split("-");
    assert(a), assert(b);

    nodes[a] ||= [];
    nodes[b] ||= [];

    nodes[a].push(b);
    nodes[b].push(a);
  }

  /** @type {Set<string>} */
  const connections = new Set();

  /**
   * @param {string} node
   * @param {string} [start]
   * @param {string[]} [set]
   */
  function traverse(node, start = node, set = [node]) {
    const conns = nodes[node];
    assert(conns);

    if (set.length >= 3) {
      return;
    }

    for (const conn of conns) {
      const cx = nodes[conn];
      assert(cx);

      const next = [...set, conn];

      if (next.length === 3 && cx.includes(start)) {
        connections.add(next.sort().join(","));
        continue;
      }

      if (set.includes(conn)) {
        continue;
      }

      traverse(conn, start, next);
    }
  }

  for (const node of Object.keys(nodes)) {
    traverse(node);
  }

  for (const conn of connections) {
    if (conn[0] === "t" || conn.match(",t")) {
      continue;
    }

    connections.delete(conn);
  }

  result = connections.size;

  console.log(result);
}

main();
