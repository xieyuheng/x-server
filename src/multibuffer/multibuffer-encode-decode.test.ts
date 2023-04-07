import { expect, test } from "vitest"
import { multibufferDecode, multibufferEncode } from "../multibuffer"

test("multibuffer-encode-decode", () => {
  {
    const parts = [
      new Uint8Array([1, 2, 3]),
      new Uint8Array([4, 5, 6]),
      new Uint8Array([7, 8, 9]),
    ]

    expect(parts).toEqual(multibufferDecode(multibufferEncode(parts)))
  }

  {
    const parts = [
      new TextEncoder().encode("abc"),
      new TextEncoder().encode("hahaha"),
      new TextEncoder().encode(""),
    ]

    expect(parts).toEqual(multibufferDecode(multibufferEncode(parts)))
  }
})

test("multibuffer-encode-decode -- only one part", () => {
  const parts = [new Uint8Array([1, 2, 3])]

  expect(parts).toEqual(multibufferDecode(multibufferEncode(parts)))
})
