/**
 * @template T
 * @param {T} value
 * @returns {asserts value is NonNullable<T>}
 */
export function assert(value) {
  if (value === null || value === undefined) {
    throw new Error("Value is null or undefined");
  }
}

/**
 * @param {string[][]} matrix
 */
export function print(matrix) {
  for (let i = 0; i < matrix.length; i++) {
    console.log(matrix[i]?.join(""));
  }
}

