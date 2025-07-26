export interface PlanFeature {
  text: string
  included: boolean
}

export interface Plan {
  id: string
  title: string
  price: number
  period: string
  description: string
  icon: React.ReactNode
  features: PlanFeature[]
  popular?: boolean
  buttonText: string
  itemId: string
}