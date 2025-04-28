import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface TestimonialCardProps {
  quote: string
  author: string
  company: string
  image: string
}

export default function TestimonialCard({ quote, author, company, image }: TestimonialCardProps) {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-6">
        <div className="mb-4">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-green-100"
          >
            <path
              d="M14.25 19.5H9C8.17157 19.5 7.5 18.8284 7.5 18V12.75C7.5 11.9216 8.17157 11.25 9 11.25H13.5C14.3284 11.25 15 11.9216 15 12.75V24.75C15 25.5784 14.3284 26.25 13.5 26.25H9.75C9.33579 26.25 9 25.9142 9 25.5C9 25.0858 9.33579 24.75 9.75 24.75H13.5V13.5C13.5 13.0858 13.1642 12.75 12.75 12.75H9.75C9.33579 12.75 9 13.0858 9 13.5V18C9 18 9 18 9 18H14.25C14.6642 18 15 18.3358 15 18.75V24.75C15 25.1642 14.6642 25.5 14.25 25.5C13.8358 25.5 13.5 25.1642 13.5 24.75V19.5Z"
              fill="currentColor"
            />
            <path
              d="M27 19.5H21.75C20.9216 19.5 20.25 18.8284 20.25 18V12.75C20.25 11.9216 20.9216 11.25 21.75 11.25H26.25C27.0784 11.25 27.75 11.9216 27.75 12.75V24.75C27.75 25.5784 27.0784 26.25 26.25 26.25H22.5C22.0858 26.25 21.75 25.9142 21.75 25.5C21.75 25.0858 22.0858 24.75 22.5 24.75H26.25V13.5C26.25 13.0858 25.9142 12.75 25.5 12.75H22.5C22.0858 12.75 21.75 13.0858 21.75 13.5V18C21.75 18 21.75 18 21.75 18H27C27.4142 18 27.75 18.3358 27.75 18.75V24.75C27.75 25.1642 27.4142 25.5 27 25.5C26.5858 25.5 26.25 25.1642 26.25 24.75V19.5Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <p className="text-gray-700 mb-6">{quote}</p>
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
            <Image src={image || "/placeholder.svg"} alt={author} width={48} height={48} className="object-cover" />
          </div>
          <div>
            <h4 className="font-bold">{author}</h4>
            <p className="text-sm text-gray-600">{company}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
