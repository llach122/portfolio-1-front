import { apiFetch } from './api'

export type Driver = {
  id: string
  name: string
  routeId?: string
}

export const driversService = {
  getAll(): Promise<Driver[]> {
    return apiFetch('/api/v1/drivers')
  },

  assignRoute(driverId: string, routeId: string) {
    return apiFetch(`/api/v1/drivers/${driverId}/assign-route`, {
      method: 'POST',
      body: JSON.stringify({ routeId }),
    })
  },
}
