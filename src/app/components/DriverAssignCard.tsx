import { User, CheckCircle } from 'lucide-react'

type Route = {
  id: string
  name: string
}

type Props = {
  driverName: string
  assignedRoute?: Route
  routes: Route[]
  onAssign: (routeId: string) => void
}

export default function DriverAssignCard({
  driverName,
  assignedRoute,
  routes,
  onAssign,
}: Props) {
  return (
    <div className="rounded-lg bg-gray-800 p-4 border border-gray-700">
      <div className="flex items-center gap-3 mb-3">
        <User className="text-green-500" />
        <h3 className="text-gray-200 font-semibold">{driverName}</h3>
      </div>

      {assignedRoute ? (
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <CheckCircle size={16} />
          Ruta asignada: {assignedRoute.name}
        </div>
      ) : (
        <select
          className="mt-2 w-full rounded bg-gray-900 border border-gray-700 p-2 text-gray-200"
          defaultValue=""
          onChange={(e) => onAssign(e.target.value)}
        >
          <option value="" disabled>
            Asignar ruta
          </option>
          {routes.map(route => (
            <option key={route.id} value={route.id}>
              {route.name}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
