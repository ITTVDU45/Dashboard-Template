export function toJsonString(value: unknown) {
  if (value === undefined || value === null) return null
  return JSON.stringify(value)
}

export function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((entry) => typeof entry === "string")
  } catch {
    return []
  }
}

export function parseJsonObject<T = Record<string, unknown>>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}
