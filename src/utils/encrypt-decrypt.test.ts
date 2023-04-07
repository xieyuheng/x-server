import { expect, test } from "vitest"
import { decrypt } from "./decrypt"
import { encrypt } from "./encrypt"
import { generateEncryptionKey } from "./generateEncryptionKey"

test("encrypt-decrypt", async () => {
  const data = new Uint8Array([1, 2, 3])

  const encryptionKey = await generateEncryptionKey()
  const encryptedData = await encrypt(data, encryptionKey)

  expect(encryptedData).not.toEqual(data)
  expect(await decrypt(encryptedData, encryptionKey)).toEqual(data)
})

test("encrypt-decrypt -- encrypt empty data", async () => {
  const data = new Uint8Array([])

  const encryptionKey = await generateEncryptionKey()
  const encryptedData = await encrypt(data, encryptionKey)

  expect(encryptedData).not.toEqual(data)
  expect(encryptedData.length).not.toEqual(0)
  expect(await decrypt(encryptedData, encryptionKey)).toEqual(data)
})
