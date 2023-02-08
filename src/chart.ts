import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import { createWriteStream } from 'fs'

export const createPDFStream = (data: Array<Record<string, number>>) => {
  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    type: 'pdf',
    width: 800,
    height: 600,
  })

  const pdf = chartJSNodeCanvas.renderToStream(
    {
      type: 'line',
      data: {
        labels: data.map(row => row.year),
        datasets: [
          {
            label: 'Acquisitions by year',
            data: data.map(row => row.count),
          },
        ],
      },
    },
    'application/pdf',
  )

  pdf.pipe(createWriteStream('./test.pdf'))

  return pdf
}
