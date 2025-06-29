'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';

interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  preferredRoutes: string[];
  savedLocations: string[];
}

interface UserProfileProps {
  initialUser?: User;
  onUpdate?: (user: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  initialUser,
  onUpdate 
}) => {
  const defaultUser: User = useMemo(() => ({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+212 612345678',
    address: 'Casablanca, Morocco',
    preferredRoutes: ['Route 1', 'Route 2'],
    savedLocations: ['Home', 'Work', 'School']
  }), []);

  const [user, setUser] = useState<User>(initialUser || defaultUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>(user);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(formData);
      setIsEditing(false);
      onUpdate?.(formData);
      
      console.log('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, [formData, onUpdate]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setFormData(user);
  }, [user]);

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 max-w-4xl mx-auto my-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
        User Profile
      </h1>
      
      {!isEditing ? (
        <ProfileView 
          user={user} 
          onEdit={() => setIsEditing(true)} 
        />
      ) : (
        <ProfileEditForm
          formData={formData}
          isLoading={isLoading}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

// Memoized sub-components for better performance
const ProfileView = React.memo<{
  user: User;
  onEdit: () => void;
}>(({ user, onEdit }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
        <p className="text-gray-600 mt-1">{user.email}</p>
      </div>
      <Button 
        onClick={onEdit}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Edit Profile
      </Button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
      <InfoCard label="Phone" value={user.phone} />
      <InfoCard label="Address" value={user.address} />
    </div>
    
    <div className="pt-6 border-t">
      <TagSection 
        title="Preferred Routes" 
        items={user.preferredRoutes}
        colorClass="bg-blue-100 text-blue-800"
      />
    </div>
    
    <div className="pt-6 border-t">
      <TagSection 
        title="Saved Locations" 
        items={user.savedLocations}
        colorClass="bg-green-100 text-green-800"
      />
    </div>
  </div>
));

const InfoCard = React.memo<{
  label: string;
  value: string;
}>(({ label, value }) => (
  <div>
    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
      {label}
    </h3>
    <p className="mt-1 text-lg text-gray-900">{value}</p>
  </div>
));

const TagSection = React.memo<{
  title: string;
  items: string[];
  colorClass: string;
}>(({ title, items, colorClass }) => (
  <div>
    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
      {title}
    </h3>
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span 
          key={index} 
          className={`${colorClass} px-3 py-1 rounded-full text-sm font-medium`}
        >
          {item}
        </span>
      ))}
    </div>
  </div>
));

const ProfileEditForm = React.memo<{
  formData: User;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}>(({ formData, isLoading, onChange, onSubmit, onCancel }) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        id="name"
        label="Name"
        type="text"
        value={formData.name}
        onChange={onChange}
        required
      />
      <FormField
        id="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={onChange}
        required
      />
      <FormField
        id="phone"
        label="Phone"
        type="tel"
        value={formData.phone}
        onChange={onChange}
      />
      <FormField
        id="address"
        label="Address"
        type="text"
        value={formData.address}
        onChange={onChange}
      />
    </div>
    
    <div className="flex justify-end space-x-4 pt-6 border-t">
      <Button
        type="button"
        onClick={onCancel}
        disabled={isLoading}
        variant="outline"
        className="px-6 py-3"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isLoading}
        className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700"
      >
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  </form>
));

const FormField = React.memo<{
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}>(({ id, label, type, value, onChange, required = false }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
    />
  </div>
));

export default UserProfile;