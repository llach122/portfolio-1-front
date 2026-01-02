import { MapPin } from 'lucide-react'

type Props = {
  name: string
}

export default function RouteCard({ name }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-gray-800 p-4 border border-gray-700">
      <MapPin className="text-green-500" />
      <span className="text-gray-200 font-medium">{name}</span>
    </div>
  )
}
