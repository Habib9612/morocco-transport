interface ProcessStepProps {
  number: string
  title: string
  description: string
  color: string
}

export default function ProcessStep({ number, title, description, color }: ProcessStepProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={`${color} text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-4`}
      >
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <div className="mt-4 hidden md:block">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5 12H19M19 12L12 5M19 12L12 19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}
