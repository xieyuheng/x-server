export async function* streamGroup<A>(stream: AsyncGenerator<A>, size: number) {
  let parts: Array<A> = []
  for await (const data of stream) {
    parts.push(data)

    if (parts.length === size) {
      yield parts
      parts = []
    }
  }
}
