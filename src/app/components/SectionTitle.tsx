type Props = {
  title: string
}

export default function SectionTitle({ title }: Props) {
  return (
    <h2 className="mt-10 mb-4 text-xl font-semibold text-green-400">
      {title}
    </h2>
  )
}
