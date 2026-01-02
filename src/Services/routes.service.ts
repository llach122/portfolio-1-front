import { apiFetch } from './api'

export type Route = {
  id: string
  name: string
}

export const routesService = {
  getAll(): Promise<Route[]> {
    return apiFetch('/api/v1/routes')
  },
}
