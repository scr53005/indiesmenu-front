// app/utils/math.test.ts
export function add(a: number, b: number): number {
  return a + b;
}

describe('add', () => {
  it('adds two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
});