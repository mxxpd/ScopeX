export type ProjectType = 'landing' | 'corporate' | 'ecommerce' | 'mobile' | 'presentation' | 'branding'
export type Complexity = 'basic' | 'standard' | 'advanced'
export type ProposalMode = 'short' | 'standard' | 'extended'
export type CalculationMode = 'market' | 'own-rate' | 'self-check'
export type Grade = 'junior' | 'middle' | 'senior'
export type MarketPosition = 'below' | 'in' | 'above'

export interface Addons {
  research: boolean
  prototype: boolean
  designSystem: boolean
  adaptive: boolean
  copywriting: boolean
  devHandoff: boolean
  urgent: boolean
}

export interface FormData {
  projectType: ProjectType
  scopeValue: number
  complexity: Complexity
  revisions: number
  addons: Addons
}

export interface Preset {
  id: string
  name: string
  description: string
  formData: Partial<FormData>
}

export interface BreakdownItem {
  label: string
  amount: number
  explanation: string
}

export interface CalculationResult {
  finalPrice: number
  minPrice: number
  maxPrice: number
  breakdown: BreakdownItem[]
  weeks: { min: number; max: number }
  formData: FormData
}

// --- Service constructor types ---

export interface ServiceSelection {
  selectedIds: string[]
  screensCount: number
  revisionsCount: number
}

export interface ServiceBreakdownItem {
  id: string
  group: string
  groupLabel: string
  label: string
  hoursMin: number
  hoursMax: number
  price: number
}

// --- Mode-specific input types ---

export interface ModeMarketData {
  grade: Grade
  buffer: number
  services: ServiceSelection
}

export interface ModeOwnRateData {
  hourlyRate: number
  buffer: number
  services: ServiceSelection
}

export interface ModeSelfCheckData {
  quotedPrice: number
  projectType: ProjectType
  scopeValue: number
}

// --- Mode-specific result types ---

export interface GradePrice {
  min: number
  max: number
  mid: number
}

export interface MarketResult {
  mode: 'market'
  totalHours: number
  totalHoursMin: number
  totalHoursMax: number
  adjustedHours: number
  adjustedHoursMin: number
  adjustedHoursMax: number
  selectedGrade: Grade
  buffer: number
  junior: GradePrice
  middle: GradePrice
  senior: GradePrice
  services: ServiceSelection
  serviceBreakdown: ServiceBreakdownItem[]
  recommendedMin: number
  recommendedMax: number
}

export interface OwnRateResult {
  mode: 'own-rate'
  totalHours: number
  totalHoursMin: number
  totalHoursMax: number
  adjustedHours: number
  adjustedHoursMin: number
  adjustedHoursMax: number
  hourlyRate: number
  buffer: number
  price: number
  market: GradePrice
  marketPosition: MarketPosition
  services: ServiceSelection
  serviceBreakdown: ServiceBreakdownItem[]
  recommendedMin: number
  recommendedMax: number
}

export interface SelfCheckResult {
  mode: 'self-check'
  quotedPrice: number
  market: GradePrice
  allGrades: { junior: GradePrice; middle: GradePrice; senior: GradePrice }
  marketPosition: MarketPosition
  positionPercent: number
}

export type ModeResult = MarketResult | OwnRateResult | SelfCheckResult
