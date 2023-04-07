import crypto from "node:crypto"
import { byteArrayMerge } from "./byteArrayMerge"

// Learned from:
// - https://github.com/diafygi/webcrypto-examples#aes-gcm

export const ivLength = 12

export async function generateEncryptionKey(): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  )

  const exportedKey = await crypto.subtle.exportKey("raw", cryptoKey)

  const iv = crypto.getRandomValues(new Uint8Array(ivLength))

  return byteArrayMerge([iv, new Uint8Array(exportedKey)])
}
