// http://zeromq.github.io/zeromq.js/types/Event.html

export function eventTypes() {
  return [
    "end",
    "close",
    "unknown",
    "connect",
    "disconnect",
    "accept",
    "accept:error",
    "bind",
    "bind:error",
    "connect:delay",
    "connect:retry",
    "close:error",
    "handshake",
    "handshake:error:protocol",
    "handshake:error:auth",
    "handshake:error:other",
  ] as const
}
