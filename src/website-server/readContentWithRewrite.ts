import type { Context } from "./Context"
import { Content, readContent } from "./readContent"

export async function readContentWithRewrite(
  ctx: Context,
  path: string,
): Promise<Content | undefined> {
  const content = await readContent(ctx, path)
  if (content !== undefined) {
    return content
  }

  if (ctx.rewriteNotFoundTo !== undefined) {
    return await readContent(ctx, ctx.rewriteNotFoundTo)
  }
}
