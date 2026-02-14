interface JsonViewerProps {
  value: unknown
}

export function JsonViewer({ value }: JsonViewerProps) {
  return (
    <pre className="max-h-80 overflow-auto rounded-lg border bg-muted/40 p-4 text-xs leading-relaxed">
      {JSON.stringify(value, null, 2)}
    </pre>
  )
}
