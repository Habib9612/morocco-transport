"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { createDriver, updateDriver } from "@/app/actions/drivers"

interface User {
  id: string
  name: string
  email: string
}

interface DriverFormProps {
  users?: User[]
  driver?: {
    id: string
    user_id: string
    license_number: string
    license_expiry_date: string
    phone_number: string
    status: string
  }
  mode: "create" | "edit"
}

const formSchema = z.object({
  user_id: z.string({
    required_error: "Please select a user",
  }),
  license_number: z.string().min(5, {
    message: "License number must be at least 5 characters",
  }),
  license_expiry_date: z.date({
    required_error: "Please select an expiry date",
  }),
  phone_number: z.string().min(10, {
    message: "Phone number must be at least 10 characters",
  }),
  status: z.enum(["available", "on_duty", "off_duty", "inactive"], {
    required_error: "Please select a status",
  }),
})

export function DriverForm({ users = [], driver, mode }: DriverFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: driver?.user_id || "",
      license_number: driver?.license_number || "",
      license_expiry_date: driver?.license_expiry_date ? new Date(driver.license_expiry_date) : undefined,
      phone_number: driver?.phone_number || "",
      status: (driver?.status as any) || "available",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("user_id", values.user_id)
    formData.append("license_number", values.license_number)
    formData.append("license_expiry_date", values.license_expiry_date.toISOString())
    formData.append("phone_number", values.phone_number)
    formData.append("status", values.status)

    try {
      let result

      if (mode === "create") {
        result = await createDriver(formData)
      } else if (driver?.id) {
        result = await updateDriver(driver.id, formData)
      }

      if (result?.success) {
        toast({
          title: `Driver ${mode === "create" ? "created" : "updated"} successfully`,
          description: `The driver has been ${mode === "create" ? "created" : "updated"}.`,
        })
        router.push("/dashboard/drivers")
      } else {
        toast({
          title: "Error",
          description: result?.error || `Failed to ${mode} driver`,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${mode} driver`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {mode === "create" && (
          <FormField
            control={form.control}
            name="user_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select the user account for this driver</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="license_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>License Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter license number" {...field} />
              </FormControl>
              <FormDescription>The driver's license number</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="license_expiry_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>License Expiry Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>When the driver's license expires</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter phone number" {...field} />
              </FormControl>
              <FormDescription>The driver's contact phone number</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="on_duty">On Duty</SelectItem>
                  <SelectItem value="off_duty">Off Duty</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>The current status of the driver</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/drivers")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : mode === "create" ? "Create Driver" : "Update Driver"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
