export default defineNuxtPlugin(() => {
  if (!import.meta.dev || typeof performance === 'undefined') {
    return
  }

  const originalMeasure = performance.measure.bind(performance)

  performance.measure = ((name: string, startOrOptions?: string | PerformanceMeasureOptions, endMark?: string) => {
    performance.clearMeasures(name)

    if (typeof startOrOptions === 'undefined') {
      return originalMeasure(name)
    }

    if (typeof startOrOptions === 'object') {
      return originalMeasure(name, startOrOptions)
    }

    if (typeof endMark === 'undefined') {
      return originalMeasure(name, startOrOptions)
    }

    return originalMeasure(name, startOrOptions, endMark)
  }) as typeof performance.measure
})
