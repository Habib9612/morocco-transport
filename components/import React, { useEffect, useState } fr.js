import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../lib/auth-context';
import { useApi } from '../app';
import { toast } from '../components/toast';
import Loading from '../components/loading';

// Types for our data
type Vehicle = {
  id: string;
  name: string;
  type: string;
  status: string;
  location: {
    lat: number;
    lng: number;
  };
};

type Schedule = {
  id: string;
  routeName: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
};

const Dashboard = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // Use our API hooks to fetch data
  const { data: vehicles, loading: vehiclesLoading, error: vehiclesError } = useApi<Vehicle[]>('/api/vehicles');
  const { data: schedules, loading: schedulesLoading, error: schedulesError } = useApi<Schedule[]>('/api/schedules');
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);
  
  // Show loading state while auth is being checked
  if (authLoading) {
    return <Loading />;
  }
  
  // Handle API errors
  useEffect(() => {
    if (vehiclesError) {
      toast.error('Failed to load vehicles data');
    }
    if (schedulesError) {
      toast.error('Failed to load schedules data');
    }
  }, [vehiclesError, schedulesError]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">MarocTransit Dashboard</h1>
          {user && (
            <div className="flex items-center space-x-4">
              <span>Welcome, {user.name}</span>
              <button 
                onClick={() => {
                  const { logout } = useAuth();
                  logout();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Vehicles Section */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Active Vehicles</h2>
          {vehiclesLoading ? (
            <Loading />
          ) : vehicles && vehicles.length > 0 ? (
            <ul className="space-y-2">
              {vehicles.map((vehicle) => (
                <li key={vehicle.id} className="border-b pb-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{vehicle.name}</p>
                      <p className="text-sm text-gray-600">Type: {vehicle.type}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${
                      vehicle.status === 'active' ? 'bg-green-100 text-green-800' : 
                      vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {vehicle.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No vehicles available</p>
          )}
          <div className="mt-4">
            <Link href="/vehicles" className="text-blue-500 hover:underline">
              View all vehicles 
              </Link>
            </div>
          </section>
          
          {/* Schedules Section */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Today's Schedules</h2>
            {schedulesLoading ? (
              <Loading />
            ) : schedules && schedules.length > 0 ? (
              <ul className="space-y-2">
                {schedules.map((schedule) => (
                  <li key={schedule.id} className="border-b pb-2">
                    <div>
                      <p className="font-medium">{schedule.routeName}</p>
                      <div className="flex justify-between text-sm">
                        <p>Departure: {new Date(schedule.departureTime).toLocaleTimeString()}</p>
                        <p>Arrival: {new Date(schedule.arrivalTime).toLocaleTimeString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-sm ${
                        schedule.status === 'on-time' ? 'bg-green-100 text-green-800' : 
                        schedule.status === 'delayed' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {schedule.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No schedules available for today</p>
            )}
            <div className="mt-4">
              <Link href="/schedules" className="text-blue-500 hover:underline">
                View all schedules 
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;