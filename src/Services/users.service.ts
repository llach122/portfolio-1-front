export type SyncUserPayload = {
  id: string
  email?: string
  name?: string
}

const API_URL = 'https://route-manager-api.onrender.com/api/v1'

export const usersService = {
  async syncUser(user: SyncUserPayload) {
    const res = await fetch(`${API_URL}/users/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })

    if (!res.ok) {
      throw new Error('Error sincronizando usuario')
    }

    return res.json()
  },
}
