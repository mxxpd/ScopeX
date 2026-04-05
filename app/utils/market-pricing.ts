import type {
  Grade,
  GradePrice,
  MarketResult,
  OwnRateResult,
  SelfCheckResult,
  ModeMarketData,
  ModeOwnRateData,
  ModeSelfCheckData,
  Addons,
  ProjectType,
} from '~/types'
import { GRADE_RATES } from '~/utils/benchmarks'
import { calculateTotalHours, buildServiceBreakdown } from '~/utils/services'

// Legacy: kept for backward compatibility with SelfCheck and old calculator-state
const BASE_HOURS_PER_SCREEN: Record<ProjectType, number> = {
  landing: 5,
  corporate: 6,
  ecommerce: 8,
  mobile: 10,
  presentation: 3,
  branding: 7,
}

const ADDON_FIXED_HOURS: Partial<Record<keyof Addons, number>> = {
  research: 20,
  prototype: 15,
  designSystem: 30,
  copywriting: 8,
  devHandoff: 8,
}

export function calculateBaseHours(
  projectType: ProjectType,
  scopeValue: number,
  addons: Addons,
): number {
  let hours = scopeValue * BASE_HOURS_PER_SCREEN[projectType]
  if (addons.adaptive) hours *= 1.2
  for (const [key, addHours] of Object.entries(ADDON_FIXED_HOURS) as [keyof Addons, number][]) {
    if (addons[key]) hours += addHours
  }
  return Math.round(hours)
}

function gradePrice(hours: number, grade: Grade): GradePrice {
  const rates = GRADE_RATES[grade]
  const mid = (rates.min + rates.max) / 2
  return {
    min: Math.round((hours * rates.min) / 1000) * 1000,
    max: Math.round((hours * rates.max) / 1000) * 1000,
    mid: Math.round((hours * mid) / 1000) * 1000,
  }
}

function getMarketPosition(price: number, market: GradePrice): 'below' | 'in' | 'above' {
  if (price < market.min) return 'below'
  if (price > market.max) return 'above'
  return 'in'
}

export function calculateMarketResult(data: ModeMarketData): MarketResult {
  const hours = calculateTotalHours(
    data.services.selectedIds,
    data.services.screensCount,
    data.services.revisionsCount,
  )
  const bufferMultiplier = 1 + data.buffer / 100
  const adjustedMid = Math.round(hours.mid * bufferMultiplier)
  const adjustedMin = Math.round(hours.min * bufferMultiplier)
  const adjustedMax = Math.round(hours.max * bufferMultiplier)
  const rates = GRADE_RATES[data.grade]
  const midRate = (rates.min + rates.max) / 2
  const serviceBreakdown = buildServiceBreakdown(data.services, midRate)
  const recommendedMid = Math.round((adjustedMid * midRate) / 1000) * 1000

  return {
    mode: 'market',
    totalHours: hours.mid,
    totalHoursMin: hours.min,
    totalHoursMax: hours.max,
    adjustedHours: adjustedMid,
    adjustedHoursMin: adjustedMin,
    adjustedHoursMax: adjustedMax,
    selectedGrade: data.grade,
    buffer: data.buffer,
    junior: gradePrice(adjustedMid, 'junior'),
    middle: gradePrice(adjustedMid, 'middle'),
    senior: gradePrice(adjustedMid, 'senior'),
    services: data.services,
    serviceBreakdown,
    recommendedMin: Math.round((recommendedMid * 0.85) / 1000) * 1000,
    recommendedMax: Math.round((recommendedMid * 1.15) / 1000) * 1000,
  }
}

export function calculateOwnRateResult(data: ModeOwnRateData): OwnRateResult {
  const hours = calculateTotalHours(
    data.services.selectedIds,
    data.services.screensCount,
    data.services.revisionsCount,
  )
  const bufferMultiplier = 1 + data.buffer / 100
  const adjustedMid = Math.round(hours.mid * bufferMultiplier)
  const adjustedMin = Math.round(hours.min * bufferMultiplier)
  const adjustedMax = Math.round(hours.max * bufferMultiplier)
  const price = Math.round((adjustedMid * data.hourlyRate) / 1000) * 1000
  const market = gradePrice(adjustedMid, 'middle')
  const serviceBreakdown = buildServiceBreakdown(data.services, data.hourlyRate)

  return {
    mode: 'own-rate',
    totalHours: hours.mid,
    totalHoursMin: hours.min,
    totalHoursMax: hours.max,
    adjustedHours: adjustedMid,
    adjustedHoursMin: adjustedMin,
    adjustedHoursMax: adjustedMax,
    hourlyRate: data.hourlyRate,
    buffer: data.buffer,
    price,
    market,
    marketPosition: getMarketPosition(price, market),
    services: data.services,
    serviceBreakdown,
    recommendedMin: Math.round((price * 0.85) / 1000) * 1000,
    recommendedMax: Math.round((price * 1.15) / 1000) * 1000,
  }
}

export function calculateSelfCheckResult(data: ModeSelfCheckData): SelfCheckResult {
  const emptyAddons: Addons = {
    research: false,
    prototype: false,
    designSystem: false,
    adaptive: false,
    copywriting: false,
    devHandoff: false,
    urgent: false,
  }
  const totalHours = calculateBaseHours(data.projectType, data.scopeValue, emptyAddons)

  const junior = gradePrice(totalHours, 'junior')
  const middle = gradePrice(totalHours, 'middle')
  const senior = gradePrice(totalHours, 'senior')
  const marketPosition = getMarketPosition(data.quotedPrice, middle)

  const scaleMin = junior.min * 0.5
  const scaleMax = senior.max * 2
  const clamped = Math.max(scaleMin, Math.min(scaleMax, data.quotedPrice))
  const positionPercent = Math.round(((clamped - scaleMin) / (scaleMax - scaleMin)) * 100)

  return {
    mode: 'self-check',
    quotedPrice: data.quotedPrice,
    market: middle,
    allGrades: { junior, middle, senior },
    marketPosition,
    positionPercent: Math.max(0, Math.min(100, positionPercent)),
  }
}
