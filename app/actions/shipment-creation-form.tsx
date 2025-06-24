'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  CalendarIcon, 
  Package, 
  MapPin, 
  Truck, 
  DollarSign, 
  FileText, 
  Clock, 
  Shield,
  Plus,
  Minus
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Types
interface LocationData {
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  contactPerson: string;
  phone: string;
  email: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface CargoItem {
  id: string;
  description: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  value: number;
  quantity: number;
  category: string;
  specialInstructions?: string;
}

interface ShipmentData {
  // Basic Information
  shipmentType: 'standard' | 'express' | 'overnight' | 'economy';
  serviceType: 'door-to-door' | 'port-to-port' | 'door-to-port' | 'port-to-door';
  
  // Locations
  origin: LocationData;
  destination: LocationData;
  
  // Cargo Details
  cargo: CargoItem[];
  totalWeight: number;
  totalValue: number;
  
  // Scheduling
  pickupDate: Date;
  preferredDeliveryDate?: Date;
  
  // Pricing
  estimatedCost: number;
  insuranceRequired: boolean;
  insuranceValue?: number;
  
  // Documents
  documents: string[];
  customsDeclaration?: string;
  
  // Special Requirements
  specialInstructions?: string;
  temperatureControlled?: boolean;
  hazardousMaterials?: boolean;
  oversized?: boolean;
}

const STEP_TITLES = [
  'Basic Information',
  'Origin Details',
  'Destination Details', 
  'Cargo Information',
  'Scheduling & Preferences',
  'Pricing & Insurance',
  'Review & Submit'
];

const SHIPMENT_TYPES = [
  { value: 'standard', label: 'Standard Delivery', description: '5-7 business days' },
  { value: 'express', label: 'Express Delivery', description: '2-3 business days' },
  { value: 'overnight', label: 'Overnight Delivery', description: 'Next business day' },
  { value: 'economy', label: 'Economy Delivery', description: '7-14 business days' }
];

const SERVICE_TYPES = [
  { value: 'door-to-door', label: 'Door to Door', description: 'Complete pickup and delivery service' },
  { value: 'port-to-port', label: 'Port to Port', description: 'Between transportation hubs' },
  { value: 'door-to-port', label: 'Door to Port', description: 'Pickup to transportation hub' },
  { value: 'port-to-door', label: 'Port to Door', description: 'Transportation hub to delivery' }
];

const CARGO_CATEGORIES = [
  'Electronics', 'Textiles', 'Food & Beverages', 'Automotive', 'Machinery',
  'Pharmaceuticals', 'Chemicals', 'Raw Materials', 'Furniture', 'Documents', 'Other'
];

export default function ShipmentCreationForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [shipmentData, setShipmentData] = useState<Partial<ShipmentData>>({
    cargo: [],
    documents: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Calculate progress
  const progress = ((currentStep + 1) / STEP_TITLES.length) * 100;

  // Update shipment data
  const updateShipmentData = (updates: Partial<ShipmentData>) => {
    setShipmentData(prev => ({ ...prev, ...updates }));
  };

  // Add cargo item
  const addCargoItem = () => {
    const newItem: CargoItem = {
      id: Date.now().toString(),
      description: '',
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 },
      value: 0,
      quantity: 1,
      category: '',
    };
    updateShipmentData({
      cargo: [...(shipmentData.cargo || []), newItem]
    });
  };

  // Remove cargo item
  const removeCargoItem = (id: string) => {
    updateShipmentData({
      cargo: shipmentData.cargo?.filter(item => item.id !== id) || []
    });
  };

  // Update cargo item
  const updateCargoItem = (id: string, updates: Partial<CargoItem>) => {
    updateShipmentData({
      cargo: shipmentData.cargo?.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ) || []
    });
  };

  // Calculate total weight and value
  useEffect(() => {
    const totalWeight = shipmentData.cargo?.reduce((sum, item) => sum + (item.weight * item.quantity), 0) || 0;
    const totalValue = shipmentData.cargo?.reduce((sum, item) => sum + (item.value * item.quantity), 0) || 0;
    updateShipmentData({ totalWeight, totalValue });
  }, [shipmentData.cargo]);

  // Calculate estimated cost (simplified)
  const calculateEstimatedCost = () => {
    if (!shipmentData.totalWeight || !shipmentData.shipmentType) return 0;
    
    const baseRates = {
      economy: 2.5,
      standard: 4.0,
      express: 8.0,
      overnight: 15.0
    };
    
    const rate = baseRates[shipmentData.shipmentType as keyof typeof baseRates] || 4.0;
    return shipmentData.totalWeight * rate;
  };

  // Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 0: // Basic Information
        if (!shipmentData.shipmentType) newErrors.shipmentType = 'Please select a shipment type';
        if (!shipmentData.serviceType) newErrors.serviceType = 'Please select a service type';
        break;
      case 1: // Origin Details
        if (!shipmentData.origin?.name) newErrors.originName = 'Origin name is required';
        if (!shipmentData.origin?.address) newErrors.originAddress = 'Origin address is required';
        if (!shipmentData.origin?.city) newErrors.originCity = 'Origin city is required';
        break;
      case 2: // Destination Details
        if (!shipmentData.destination?.name) newErrors.destinationName = 'Destination name is required';
        if (!shipmentData.destination?.address) newErrors.destinationAddress = 'Destination address is required';
        if (!shipmentData.destination?.city) newErrors.destinationCity = 'Destination city is required';
        break;
      case 3: // Cargo Information
        if (!shipmentData.cargo?.length) newErrors.cargo = 'At least one cargo item is required';
        break;
      case 4: // Scheduling
        if (!shipmentData.pickupDate) newErrors.pickupDate = 'Pickup date is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEP_TITLES.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  // Submit shipment
  const submitShipment = async () => {
    if (!validateStep(currentStep)) return;
    
    setLoading(true);
    try {
      // Here you would call your API to create the shipment
      console.log('Submitting shipment:', shipmentData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to shipments list or success page
      router.push('/dashboard/shipments');
    } catch (error) {
      console.error('Error creating shipment:', error);
    } finally {
      setLoading(false);
    }
  };

  // Step Components
  const renderBasicInformation = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold">Shipment Type</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          {SHIPMENT_TYPES.map((type) => (
            <Card 
              key={type.value}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                shipmentData.shipmentType === type.value ? "ring-2 ring-blue-500 bg-blue-50" : ""
              )}
              onClick={() => updateShipmentData({ shipmentType: type.value as ShipmentData["shipmentType"] })}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{type.label}</h3>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    {shipmentData.shipmentType === type.value && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {errors.shipmentType && <p className="text-red-500 text-sm mt-1">{errors.shipmentType}</p>}
      </div>

      <div>
        <Label className="text-base font-semibold">Service Type</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          {SERVICE_TYPES.map((service) => (
            <Card 
              key={service.value}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                shipmentData.serviceType === service.value ? "ring-2 ring-blue-500 bg-blue-50" : ""
              )}
              onClick={() => updateShipmentData({ serviceType: service.value as ShipmentData["serviceType"] })}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{service.label}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    {shipmentData.serviceType === service.value && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {errors.serviceType && <p className="text-red-500 text-sm mt-1">{errors.serviceType}</p>}
      </div>
    </div>
  );

  const renderLocationForm = (type: 'origin' | 'destination') => {
    const locationData = shipmentData[type] as LocationData || {};
    const prefix = type === 'origin' ? 'origin' : 'destination';
    
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold capitalize">{type} Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${prefix}Name`}>Location Name *</Label>
            <Input
              id={`${prefix}Name`}
              value={locationData.name || ''}
              onChange={(e) => updateShipmentData({
                [type]: { ...locationData, name: e.target.value }
              })}
              placeholder="e.g., Warehouse A, Office Building"
            />
            {errors[`${prefix}Name`] && <p className="text-red-500 text-sm mt-1">{errors[`${prefix}Name`]}</p>}
          </div>

          <div>
            <Label htmlFor={`${prefix}Contact`}>Contact Person</Label>
            <Input
              id={`${prefix}Contact`}
              value={locationData.contactPerson || ''}
              onChange={(e) => updateShipmentData({
                [type]: { ...locationData, contactPerson: e.target.value }
              })}
              placeholder="Contact person name"
            />
          </div>
        </div>

        <div>
          <Label htmlFor={`${prefix}Address`}>Street Address *</Label>
          <Input
            id={`${prefix}Address`}
            value={locationData.address || ''}
            onChange={(e) => updateShipmentData({
              [type]: { ...locationData, address: e.target.value }
            })}
            placeholder="Full street address"
          />
          {errors[`${prefix}Address`] && <p className="text-red-500 text-sm mt-1">{errors[`${prefix}Address`]}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor={`${prefix}City`}>City *</Label>
            <Input
              id={`${prefix}City`}
              value={locationData.city || ''}
              onChange={(e) => updateShipmentData({
                [type]: { ...locationData, city: e.target.value }
              })}
              placeholder="City"
            />
            {errors[`${prefix}City`] && <p className="text-red-500 text-sm mt-1">{errors[`${prefix}City`]}</p>}
          </div>

          <div>
            <Label htmlFor={`${prefix}PostalCode`}>Postal Code</Label>
            <Input
              id={`${prefix}PostalCode`}
              value={locationData.postalCode || ''}
              onChange={(e) => updateShipmentData({
                [type]: { ...locationData, postalCode: e.target.value }
              })}
              placeholder="Postal code"
            />
          </div>

          <div>
            <Label htmlFor={`${prefix}Country`}>Country</Label>
            <Select
              value={locationData.country || ''}
              onValueChange={(value) => updateShipmentData({
                [type]: { ...locationData, country: value }
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MA">Morocco</SelectItem>
                <SelectItem value="FR">France</SelectItem>
                <SelectItem value="ES">Spain</SelectItem>
                <SelectItem value="DE">Germany</SelectItem>
                <SelectItem value="IT">Italy</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${prefix}Phone`}>Phone Number</Label>
            <Input
              id={`${prefix}Phone`}
              value={locationData.phone || ''}
              onChange={(e) => updateShipmentData({
                [type]: { ...locationData, phone: e.target.value }
              })}
              placeholder="+1 234 567 8900"
            />
          </div>

          <div>
            <Label htmlFor={`${prefix}Email`}>Email Address</Label>
            <Input
              id={`${prefix}Email`}
              type="email"
              value={locationData.email || ''}
              onChange={(e) => updateShipmentData({
                [type]: { ...locationData, email: e.target.value }
              })}
              placeholder="email@example.com"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderCargoInformation = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Cargo Information</h3>
        </div>
        <Button onClick={addCargoItem} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {shipmentData.cargo?.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No cargo items added yet. Click &quot;Add Item&quot; to get started.</p>
          </CardContent>
        </Card>
      )}

      {shipmentData.cargo?.map((item, index) => (
        <Card key={item.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Item {index + 1}</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => removeCargoItem(item.id)}
                disabled={shipmentData.cargo?.length === 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Description *</Label>
                <Input
                  value={item.description}
                  onChange={(e) => updateCargoItem(item.id, { description: e.target.value })}
                  placeholder="Item description"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={item.category}
                  onValueChange={(value) => updateCargoItem(item.id, { category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CARGO_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateCargoItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div>
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={item.weight}
                  onChange={(e) => updateCargoItem(item.id, { weight: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Value (MAD)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.value}
                  onChange={(e) => updateCargoItem(item.id, { value: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div>
              <Label>Dimensions (L x W x H cm)</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  type="number"
                  min="0"
                  placeholder="Length"
                  value={item.dimensions.length}
                  onChange={(e) => updateCargoItem(item.id, {
                    dimensions: { ...item.dimensions, length: parseFloat(e.target.value) || 0 }
                  })}
                />
                <Input
                  type="number"
                  min="0"
                  placeholder="Width"
                  value={item.dimensions.width}
                  onChange={(e) => updateCargoItem(item.id, {
                    dimensions: { ...item.dimensions, width: parseFloat(e.target.value) || 0 }
                  })}
                />
                <Input
                  type="number"
                  min="0"
                  placeholder="Height"
                  value={item.dimensions.height}
                  onChange={(e) => updateCargoItem(item.id, {
                    dimensions: { ...item.dimensions, height: parseFloat(e.target.value) || 0 }
                  })}
                />
              </div>
            </div>

            <div>
              <Label>Special Instructions</Label>
              <Textarea
                value={item.specialInstructions || ''}
                onChange={(e) => updateCargoItem(item.id, { specialInstructions: e.target.value })}
                placeholder="Any special handling instructions..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {shipmentData.cargo && shipmentData.cargo.length > 0 && (
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Total Weight</p>
                <p className="text-2xl font-bold text-blue-600">{shipmentData.totalWeight?.toFixed(1)} kg</p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Value</p>
                <p className="text-2xl font-bold text-green-600">{shipmentData.totalValue?.toFixed(2)} MAD</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {errors.cargo && <p className="text-red-500 text-sm">{errors.cargo}</p>}
    </div>
  );

  const renderSchedulingPreferences = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Scheduling & Preferences</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Pickup Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !shipmentData.pickupDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {shipmentData.pickupDate ? format(shipmentData.pickupDate, "PPP") : "Select pickup date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={shipmentData.pickupDate}
                onSelect={(date) => updateShipmentData({ pickupDate: date })}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.pickupDate && <p className="text-red-500 text-sm mt-1">{errors.pickupDate}</p>}
        </div>

        <div>
          <Label>Preferred Delivery Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !shipmentData.preferredDeliveryDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {shipmentData.preferredDeliveryDate ? format(shipmentData.preferredDeliveryDate, "PPP") : "Select delivery date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={shipmentData.preferredDeliveryDate}
                onSelect={(date) => updateShipmentData({ preferredDeliveryDate: date })}
                disabled={(date) => date < new Date() || (!!shipmentData.pickupDate && date < shipmentData.pickupDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <Label>Special Requirements</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="temperatureControlled"
              checked={shipmentData.temperatureControlled || false}
              onChange={(e) => updateShipmentData({ temperatureControlled: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="temperatureControlled" className="text-sm">Temperature Controlled</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="hazardousMaterials"
              checked={shipmentData.hazardousMaterials || false}
              onChange={(e) => updateShipmentData({ hazardousMaterials: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="hazardousMaterials" className="text-sm">Hazardous Materials</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="oversized"
              checked={shipmentData.oversized || false}
              onChange={(e) => updateShipmentData({ oversized: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="oversized" className="text-sm">Oversized</Label>
          </div>
        </div>
      </div>

      <div>
        <Label>Additional Instructions</Label>
        <Textarea
          value={shipmentData.specialInstructions || ''}
          onChange={(e) => updateShipmentData({ specialInstructions: e.target.value })}
          placeholder="Any special instructions for handling, delivery, or pickup..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderPricingInsurance = () => {
    const estimatedCost = calculateEstimatedCost();
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Pricing & Insurance</h3>
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold">Estimated Cost</h4>
                <p className="text-sm text-muted-foreground">Based on weight and service type</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">{estimatedCost.toFixed(2)} MAD</p>
                <p className="text-sm text-muted-foreground">
                  {shipmentData.totalWeight?.toFixed(1)} kg × {shipmentData.shipmentType}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="insuranceRequired"
              checked={shipmentData.insuranceRequired || false}
              onChange={(e) => updateShipmentData({ insuranceRequired: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="insuranceRequired" className="text-base font-medium">
              Insurance Protection
            </Label>
          </div>
          
          {shipmentData.insuranceRequired && (
            <div className="ml-6 space-y-4">
              <div>
                <Label>Insurance Value (MAD)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={shipmentData.insuranceValue || shipmentData.totalValue || 0}
                  onChange={(e) => updateShipmentData({ insuranceValue: parseFloat(e.target.value) || 0 })}
                  placeholder="Enter insurance value"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended: {shipmentData.totalValue?.toFixed(2) || '0.00'} MAD (Total cargo value)
                </p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-yellow-600" />
                  <p className="text-sm font-medium text-yellow-800">Insurance Information</p>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Insurance covers loss or damage during transit. Premium: 0.5% of insured value.
                </p>
              </div>
            </div>
          )}
        </div>

        <div>
          <Label>Customs Declaration</Label>
          <Textarea
            value={shipmentData.customsDeclaration || ''}
            onChange={(e) => updateShipmentData({ customsDeclaration: e.target.value })}
            placeholder="Describe the goods for customs purposes..."
            rows={3}
          />
        </div>
      </div>
    );
  };

  const renderReviewSubmit = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Review & Submit</h3>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <Badge variant="secondary">{shipmentData.shipmentType}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service:</span>
              <span>{shipmentData.serviceType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pickup:</span>
              <span>&quot;{shipmentData.pickupDate ? format(shipmentData.pickupDate, "PPP") : 'Not set'}&quot;</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cargo Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items:</span>
              <span>{shipmentData.cargo?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Weight:</span>
              <span>{shipmentData.totalWeight?.toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Value:</span>
              <span>{shipmentData.totalValue?.toFixed(2)} MAD</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Origin</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{shipmentData.origin?.name}</p>
            <p className="text-sm text-muted-foreground">
              {shipmentData.origin?.address}, {shipmentData.origin?.city}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Destination</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{shipmentData.destination?.name}</p>
            <p className="text-sm text-muted-foreground">
              {shipmentData.destination?.address}, {shipmentData.destination?.city}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Base shipping cost:</span>
            <span>{calculateEstimatedCost().toFixed(2)} MAD</span>
          </div>
          {shipmentData.insuranceRequired && (
            <div className="flex justify-between">
              <span>Insurance premium:</span>
              <span>{((shipmentData.insuranceValue || 0) * 0.005).toFixed(2)} MAD</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total Estimated Cost:</span>
            <span className="text-blue-600">
              {(calculateEstimatedCost() + (shipmentData.insuranceRequired ? (shipmentData.insuranceValue || 0) * 0.005 : 0)).toFixed(2)} MAD
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="termsAccepted"
            required
            className="rounded"
          />
          <Label htmlFor="termsAccepted" className="text-sm">
            I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</a> and 
            <a href="/privacy" className="text-blue-600 hover:underline"> Privacy Policy</a>
          </Label>
        </div>
      </div>
    </div>
  );

  // Main component render
  const stepComponents = [
    renderBasicInformation,
    () => renderLocationForm('origin'),
    () => renderLocationForm('destination'),
    renderCargoInformation,
    renderSchedulingPreferences,
    renderPricingInsurance,
    renderReviewSubmit
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-blue-500" />
            Create New Shipment
          </CardTitle>
          <CardDescription>
            Step {currentStep + 1} of {STEP_TITLES.length}: {STEP_TITLES[currentStep]}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {stepComponents[currentStep]()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              {currentStep < STEP_TITLES.length - 1 ? (
                <Button onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={submitShipment}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Creating Shipment...' : 'Create Shipment'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}