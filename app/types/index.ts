export type ProjectType = 'landing' | 'corporate' | 'ecommerce' | 'mobile' | 'presentation' | 'branding'
export type Complexity = 'basic' | 'standard' | 'advanced'
export type ProposalMode = 'short' | 'standard' | 'extended'

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
