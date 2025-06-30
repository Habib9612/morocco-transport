"use client"

import React, { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"

interface SelectableItem {
  id: string
  label: string
}

const formSchema = z.object({
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  pickupDate: z.date({
    required_error: "A pickup date is required.",
  }),
  deliveryDate: z.date({
    required_error: "A delivery date is required.",
  }),
  weight: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().positive("Weight must be positive")
  ),
  volume: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().positive("Volume must be positive")
  ),
  goodsType: z.string().min(1, "Goods type is required"),
  driverId: z.string().optional(),
  truckId: z.string().optional(),
})

type ShipmentFormValues = z.infer<typeof formSchema>

export default function ShipmentCreationForm() {
  const [drivers, setDrivers] = useState<SelectableItem[]>([])
  const [trucks, setTrucks] = useState<SelectableItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ShipmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: "",
      destination: "",
      goodsType: "",
      driverId: "",
      truckId: "",
    },
  })

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [driversRes, trucksRes] = await Promise.all([
          fetch("/api/drivers"),
          fetch("/api/trucks"),
        ])
        if (!driversRes.ok) throw new Error("Failed to fetch drivers")
        if (!trucksRes.ok) throw new Error("Failed to fetch trucks")

        const driversData = await driversRes.json()
        setDrivers(
          driversData.map((d: { id: string; user: { firstName: string, lastName: string } }) => ({
            id: d.id,
            label: `${d.user.firstName} ${d.user.lastName}`,
          }))
        )

        const trucksData = await trucksRes.json()
        setTrucks(
          trucksData.map((t: { id: string; model: string; license_plate: string }) => ({
            id: t.id,
            label: `${t.model} - ${t.license_plate}`,
          }))
        )
      } catch (err: any) {
        setError(err.message || "Failed to load initial data.")
        toast.error(err.message || "Failed to load initial data.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const onSubmit = async (data: ShipmentFormValues) => {
    try {
      const response = await fetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create shipment")
      }

      toast.success("Shipment created successfully!")
      form.reset()
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.")
      console.error(error)
    }
  }

  if (loading) return <div>Loading form...</div>
  if (error) return <div className="text-red-500 p-4">{error}</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Shipment</CardTitle>
        <CardDescription>
          Fill in the details below to schedule a new shipment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origin</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Casablanca" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Marrakech" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pickupDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Pickup Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Delivery Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="volume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volume (m³)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goodsType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Goods</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Electronics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="driverId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign Driver (Optional)</FormLabel>
                    <SearchableSelect
                      placeholder="Select a driver"
                      items={drivers}
                      onSelect={(item) => field.onChange(item?.id)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="truckId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign Truck (Optional)</FormLabel>
                    <SearchableSelect
                      placeholder="Select a truck"
                      items={trucks}
                      onSelect={(item) => field.onChange(item?.id)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Creating Shipment..."
                : "Create Shipment"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

interface SearchableSelectProps {
  items: SelectableItem[]
  onSelect: (item: SelectableItem | null) => void
  placeholder: string
}

function SearchableSelect({
  items,
  onSelect,
  placeholder,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? items.find((item) => item.label.toLowerCase() === value)
                ?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search items..." />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={item.id}
                value={item.label.toLowerCase()}
                onSelect={(currentValue) => {
                  const selectedItem =
                    items.find(
                      (item) => item.label.toLowerCase() === currentValue
                    ) || null
                  setValue(selectedItem ? selectedItem.label.toLowerCase() : "")
                  onSelect(selectedItem)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === item.label.toLowerCase()
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}