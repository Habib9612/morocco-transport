import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-[250px] mb-2" />
          <Skeleton className="h-4 w-[350px]" />
        </div>
        <Skeleton className="h-10 w-[180px]" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-10 w-[300px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-5 w-[100px]" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <Skeleton className="h-7 w-[80px] mt-2" />
                <Skeleton className="h-4 w-[120px] mt-2" />
              </div>
            ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
          <Skeleton className="h-6 w-[150px] mb-4" />
          <Skeleton className="h-[300px] w-full rounded-md" />
        </div>
        <div className="lg:col-span-3 p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
          <Skeleton className="h-6 w-[150px] mb-4" />
          <Skeleton className="h-[300px] w-full rounded-md" />
        </div>
      </div>

      <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
        <Skeleton className="h-6 w-[200px] mb-2" />
        <Skeleton className="h-4 w-[300px] mb-6" />
        <div className="space-y-6">
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-full mr-4" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-3 w-[250px]" />
                </div>
                <Skeleton className="h-4 w-[60px]" />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
