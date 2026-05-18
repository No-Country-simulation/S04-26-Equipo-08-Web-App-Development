type Props = {
  title: string
  description: string
}

export default function BenefitCard({
  title,
  description,
}: Props) {
  return (
    <div className="p-8 neo-raised rounded-3xl">
      <h3 className="text-xl font-semibold mb-3 text-on-surface">
        {title}
      </h3>

      <p className="text-on-surface-variant leading-relaxed">
        {description}
      </p>
    </div>
  )
}