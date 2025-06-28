"use server"

import { revalidatePath } from "next/cache"

// Get all drivers
export async function getDrivers(status?: string) {
  try {
    const url = status ? `/api/drivers?status=${encodeURIComponent(status)}` : "/api/drivers"

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to fetch drivers:", error)
    throw new Error("Failed to fetch drivers")
  }
}

// Get a single driver
export async function getDriver(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/drivers/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to fetch driver ${id}:`, error)
    throw new Error("Failed to fetch driver")
  }
}

// Create a new driver
export async function createDriver(formData: FormData) {
  try {
    const driverData = {
      user_id: formData.get("user_id"),
      license_number: formData.get("license_number"),
      license_expiry_date: formData.get("license_expiry_date"),
      phone_number: formData.get("phone_number"),
      status: formData.get("status") || "available",
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/drivers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(driverData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Error: ${response.status}`)
    }

    revalidatePath("/dashboard/drivers")
    return { success: true, data: await response.json() }
  } catch (error) {
    console.error("Failed to create driver:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create driver" }
  }
}

// Update a driver
export async function updateDriver(id: string, formData: FormData) {
  try {
    const driverData = {
      license_number: formData.get("license_number"),
      license_expiry_date: formData.get("license_expiry_date"),
      phone_number: formData.get("phone_number"),
      status: formData.get("status"),
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/drivers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(driverData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Error: ${response.status}`)
    }

    revalidatePath("/dashboard/drivers")
    revalidatePath(`/dashboard/drivers/${id}`)
    return { success: true, data: await response.json() }
  } catch (error) {
    console.error(`Failed to update driver ${id}:`, error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update driver" }
  }
}

// Delete a driver
export async function deleteDriver(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/drivers/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Error: ${response.status}`)
    }

    revalidatePath("/dashboard/drivers")
    return { success: true }
  } catch (error) {
    console.error(`Failed to delete driver ${id}:`, error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete driver" }
  }
}
