import crypto from "node:crypto"
import { ivLength } from "./generateEncryptionKey"

// Learned from:
// - https://github.com/diafygi/webcrypto-examples#aes-gcm

export async function encrypt(
  data: Uint8Array,
  key: Uint8Array,
): Promise<Uint8Array> {
  const iv = key.subarray(0, ivLength)
  const exportedKey = key.subarray(ivLength)

  const importedKey = await crypto.subtle.importKey(
    "raw",
    exportedKey,
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"],
  )

  const encryptedData = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv }, importedKey, data),
  )

  return encryptedData
}
