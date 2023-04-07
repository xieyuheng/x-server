import detect from "detect-port"

export async function findPort(port: number): Promise<number> {
  return await detect(port)
}
