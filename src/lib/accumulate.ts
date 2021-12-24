export function accumulate(arr: any[], initializer: any): any {
  if (!arr) return null;

  let accumulator = initializer;

  arr.forEach((i) => {
    accumulator += i;
  });

  return accumulator;
}
