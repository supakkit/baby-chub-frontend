import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { addProduct, updateProduct } from '../services/productsService';
import { toast } from 'sonner';


export function ProductForm({ product, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: '',
        prices: { oneTime: '', monthly: '', yearly: '' },
        isDiscounted: false,
        age: { min: 3, max: 12 },
        images: '',
        available: false,
        asset: { path: '', type: '' },
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                type: product.type,
                prices: {
                    oneTime: product.prices.oneTime || '',
                    monthly: product.prices.monthly || '',
                    yearly: product.prices.yearly || '',
                },
                isDiscounted: product.isDiscounted,
                age: {
                    min: product.age.min,
                    max: product.age.max,
                },
                images: product.images.join(', '),
                available: product.available,
                asset: {
                    path: product.asset.path,
                    type: product.asset.type,
                },
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const [parent, child] = name.split('.');

        if (parent === 'prices' || parent === 'age' || parent === 'asset') {
            setFormData(prevData => ({
                ...prevData,
                [parent]: {
                    ...prevData[parent],
                    [child]: type === 'number' ? Number(value) : value,
                },
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required.';
        if (!formData.description) newErrors.description = 'Description is required.';
        if (!formData.type) newErrors.type = 'Type is required.';
        if (!formData.images) newErrors.images = 'At least one image URL is required.';
        if (!formData.asset.path) newErrors['asset.path'] = 'Asset path is required.';
        if (!formData.asset.type) newErrors['asset.type'] = 'Asset type is required.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const productValues = {
            ...formData,
            images: formData.images.split(',').map(url => url.trim()).filter(url => url),
            prices: {
                oneTime: formData.prices.oneTime === '' ? null : Number(formData.prices.oneTime),
                monthly: formData.prices.monthly === '' ? null : Number(formData.prices.monthly),
                yearly: formData.prices.yearly === '' ? null : Number(formData.prices.yearly),
            },
        };

        try {
            const data = product 
                ? await updateProduct(product._id, productValues)
                : await addProduct(productValues);
            
            onSuccess();
            toast.success(data.message);
        } catch (error) {
            console.error('Submission error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 grid">
            <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Name</label>
                <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Product name"
                    className="mt-1"
                />
                {errors.name && <p className="text-sm font-medium text-red-500">{errors.name}</p>}
            </div>

            <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Description</label>
                <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Product description"
                    className="mt-1"
                />
                {errors.description && <p className="text-sm font-medium text-red-500">{errors.description}</p>}
            </div>

            <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Type</label>
                <Input
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    placeholder="e.g., Book, Course, Software"
                    className="mt-1"
                />
                {errors.type && <p className="text-sm font-medium text-red-500">{errors.type}</p>}
            </div>

            {/* Prices fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">One-Time Price</label>
                    <Input
                        type="number"
                        name="prices.oneTime"
                        value={formData.prices.oneTime}
                        onChange={handleChange}
                        placeholder="0"
                        className="mt-1"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Monthly Price</label>
                    <Input
                        type="number"
                        name="prices.monthly"
                        value={formData.prices.monthly}
                        onChange={handleChange}
                        placeholder="0"
                        className="mt-1"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Yearly Price</label>
                    <Input
                        type="number"
                        name="prices.yearly"
                        value={formData.prices.yearly}
                        onChange={handleChange}
                        placeholder="0"
                        className="mt-1"
                    />
                </div>
            </div>

            <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Image URLs (comma separated)</label>
                <Input
                    name="images"
                    value={formData.images}
                    onChange={handleChange}
                    placeholder="url1, url2"
                    className="mt-1"
                />
                {errors.images && <p className="text-sm font-medium text-red-500">{errors.images}</p>}
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Min Age</label>
                    <Input
                        type="number"
                        name="age.min"
                        value={formData.age.min}
                        onChange={handleChange}
                        className="mt-1"
                    />
                </div>
                <div className="flex-1">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Max Age</label>
                    <Input
                        type="number"
                        name="age.max"
                        value={formData.age.max}
                        onChange={handleChange}
                        className="mt-1"
                    />
                </div>
            </div>

            {/* Asset fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Asset Path</label>
                    <Input
                        name="asset.path"
                        value={formData.asset.path}
                        onChange={handleChange}
                        placeholder="/path/to/asset.pdf"
                        className="mt-1"
                    />
                    {errors['asset.path'] && <p className="text-sm font-medium text-red-500">{errors['asset.path']}</p>}
                </div>
                <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Asset Type</label>
                    <Input
                        name="asset.type"
                        value={formData.asset.type}
                        onChange={handleChange}
                        placeholder="e.g., pdf, mp4"
                        className="mt-1"
                    />
                    {errors['asset.type'] && <p className="text-sm font-medium text-red-500">{errors['asset.type']}</p>}
                </div>
            </div>

            <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center space-x-3">
                    <Checkbox
                        name="isDiscounted"
                        checked={formData.isDiscounted}
                        onCheckedChange={(checked) => handleChange({ target: { name: 'isDiscounted', type: 'checkbox', checked } })}
                    />
                    <label className="text-sm font-medium leading-none">Is Discounted?</label>
                </div>
                <div className="flex items-center space-x-3">
                    <Checkbox
                        name="available"
                        checked={formData.available}
                        onCheckedChange={(checked) => handleChange({ target: { name: 'available', type: 'checkbox', checked } })}
                    />
                    <label className="text-sm font-medium leading-none">Is Available?</label>
                </div>
            </div>

            <Button type="submit" className="justify-self-end">{product ? 'Update' : 'Create'} Product</Button>
        </form>
    );
}