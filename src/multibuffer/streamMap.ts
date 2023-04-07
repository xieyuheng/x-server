export async function* streamMap<A, B>(
  stream: AsyncGenerator<A>,
  f: (x: A) => B,
) {
  for await (const x of stream) {
    yield f(x)
  }
}
