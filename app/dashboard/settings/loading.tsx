import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SettingsLoading() {
  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex flex-col space-y-6">
        <div>
          <Skeleton className="h-8 w-48 bg-gray-800" />
          <Skeleton className="h-4 w-96 mt-2 bg-gray-800" />
        </div>

        <div className="space-y-6">
          <Skeleton className="h-10 w-[600px] bg-gray-800" />

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2 bg-gray-800" />
              <Skeleton className="h-4 w-96 bg-gray-800" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Skeleton className="h-24 w-24 rounded-full bg-gray-800" />
                <div className="flex-1 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24 bg-gray-800" />
                      <Skeleton className="h-10 w-full bg-gray-800" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24 bg-gray-800" />
                      <Skeleton className="h-10 w-full bg-gray-800" />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24 bg-gray-800" />
                      <Skeleton className="h-10 w-full bg-gray-800" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24 bg-gray-800" />
                      <Skeleton className="h-10 w-full bg-gray-800" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24 bg-gray-800" />
                    <Skeleton className="h-20 w-full bg-gray-800" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
