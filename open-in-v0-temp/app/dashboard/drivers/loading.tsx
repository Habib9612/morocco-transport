import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function DriversLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Driver Management</h2>
          <p className="text-muted-foreground">Manage your drivers, their licenses, and assignments</p>
        </div>
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" />
          Add Driver
        </Button>
      </div>

      <div className="rounded-md border">
        <div className="h-12 px-4 border-b flex items-center">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[100px] ml-auto" />
        </div>
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
              <Skeleton className="h-10 w-[100px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
