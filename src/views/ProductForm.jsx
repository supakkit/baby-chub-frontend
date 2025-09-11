import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

export const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    subjects: [],
    prices: {
      oneTime: null,
      monthly: null,
      yearly: null,
    },
    isDiscounted: false,
    tags: [],
    age: {
      min: 3,
      max: 12,
    },
    images: [],
    available: false,
    asset: {
      path: '',
      type: '',
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Handle nested objects and booleans
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' || type === 'switch' ? checked : value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' || type === 'switch' ? checked : value,
      }));
    }
  };

  const handleArrayChange = (e, field) => {
    const value = e.target.value.split(',').map(tag => tag.trim());
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePriceChange = (e, priceType) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      prices: {
        ...prev.prices,
        [priceType]: value === '' ? null : Number(value),
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Create New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Product Type</Label>
            <Input id="type" name="type" value={formData.type} onChange={handleChange} required />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
        </div>

        {/* Subjects & Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subjects">Subjects (comma-separated)</Label>
            <Input id="subjects" name="subjects" value={formData.subjects.join(', ')} onChange={(e) => handleArrayChange(e, 'subjects')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" name="tags" value={formData.tags.join(', ')} onChange={(e) => handleArrayChange(e, 'tags')} />
          </div>
        </div>

        {/* Prices */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="oneTime">One-Time Price</Label>
            <Input id="oneTime" name="prices.oneTime" type="number" min="0" value={formData.prices.oneTime || ''} onChange={(e) => handlePriceChange(e, 'oneTime')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthly">Monthly Price</Label>
            <Input id="monthly" name="prices.monthly" type="number" min="0" value={formData.prices.monthly || ''} onChange={(e) => handlePriceChange(e, 'monthly')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="yearly">Yearly Price</Label>
            <Input id="yearly" name="prices.yearly" type="number" min="0" value={formData.prices.yearly || ''} onChange={(e) => handlePriceChange(e, 'yearly')} />
          </div>
        </div>

        {/* Age Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minAge">Minimum Age</Label>
            <Input id="minAge" name="age.min" type="number" min="0" value={formData.age.min} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxAge">Maximum Age</Label>
            <Input id="maxAge" name="age.max" type="number" min="0" value={formData.age.max} onChange={handleChange} />
          </div>
        </div>

        {/* Asset Source */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="assetPath">Asset Path</Label>
            <Input id="assetPath" name="asset.path" value={formData.asset.path} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assetType">Asset Type</Label>
            <Input id="assetType" name="asset.type" value={formData.asset.type} onChange={handleChange} required />
          </div>
        </div>

        {/* Booleans and Images */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch id="available" name="available" checked={formData.available} onCheckedChange={(checked) => handleChange({ target: { name: 'available', checked } })} />
            <Label htmlFor="available">Available for Sale</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="isDiscounted" name="isDiscounted" checked={formData.isDiscounted} onCheckedChange={(checked) => handleChange({ target: { name: 'isDiscounted', checked } })} />
            <Label htmlFor="isDiscounted">Is Discounted</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="images">Image URLs (comma-separated)</Label>
          <Input id="images" name="images" value={formData.images.join(', ')} onChange={(e) => handleArrayChange(e, 'images')} />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Create Product</Button>
        </div>
      </form>
    </div>
  );
};
