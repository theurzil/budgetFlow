export function useExport() {
  function exportToCSV(data: Record<string, unknown>[], filename: string) {
    if (!data.length) return

    const headers = Object.keys(data[0])
    const rows = data.map((row) =>
      headers
        .map((h) => {
          const val = row[h]
          const str = val === null || val === undefined ? '' : String(val)
          // Wrap in quotes if contains comma, newline, or quote
          return str.includes(',') || str.includes('\n') || str.includes('"')
            ? `"${str.replace(/"/g, '""')}"`
            : str
        })
        .join(','),
    )

    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  function triggerPrint() {
    window.print()
  }

  return { exportToCSV, triggerPrint }
}
