import { expect, test } from "vitest"
import { numberDecode } from "./numberDecode"
import { numberEncode } from "./numberEncode"

test("number-encode-decode", () => {
  expect(0).toEqual(numberDecode(numberEncode(0)))
  expect(1).toEqual(numberDecode(numberEncode(1)))
  expect(100).toEqual(numberDecode(numberEncode(100)))
  expect(1000000).toEqual(numberDecode(numberEncode(1000000)))
})
