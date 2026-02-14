import { NextResponse } from "next/server"

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init)
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { error: message, details: details ?? null },
    { status }
  )
}

export async function parseBody<T>(request: Request): Promise<T> {
  try {
    return await request.json()
  } catch {
    throw new Error("Invalid JSON body")
  }
}
