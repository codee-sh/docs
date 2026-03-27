export type Status = 'built-in' | 'plugin'

export interface ResourceItem {
  name: string
  status: Status
  href?: string
}

export interface ResourceCategory {
  category: string
  items: ResourceItem[]
}
