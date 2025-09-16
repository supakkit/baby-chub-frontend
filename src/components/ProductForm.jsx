import { useState, useEffect, useRef } from 'react';
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
        available: false,
        asset: { path: '', type: '' },
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const imageInputRef = useRef(null);

    const isUpdate = !!product;

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
        if (!formData.asset.path) newErrors['asset.path'] = 'Asset path is required.';
        if (!formData.asset.type) newErrors['asset.type'] = 'Asset type is required.';
        if (!isUpdate && !(selectedImages?.length > 0)) newErrors.images = 'At least one image is required.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(files);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        // Append new previews to existing ones
        setImagePreviews(prev => [...prev.filter(url => !url.startsWith('blob:')), ...newPreviews]);
    };

    const handleRemoveImage = (indexToRemove) => {
        const newSelectedImages = selectedImages.filter((_, index) => index !== indexToRemove);
        const newPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
        setSelectedImages(newSelectedImages);
        setImagePreviews(newPreviews);

        if (newSelectedImages.length === 0 && newPreviews.length === 0 && imageInputRef.current) {
            imageInputRef.current.value = null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!validateForm()) return;

        const prices = {
            oneTime: formData.prices.oneTime === '' ? null : Number(formData.prices.oneTime),
            monthly: formData.prices.monthly === '' ? null : Number(formData.prices.monthly),
            yearly: formData.prices.yearly === '' ? null : Number(formData.prices.yearly),
        };

        // Create a new FormData instance
        const productValues = new FormData();

        // Append all text fields
        productValues.append('name', formData.name);
        productValues.append('description', formData.description);
        productValues.append('type', formData.type);
        productValues.append('isDiscounted', formData.isDiscounted);
        productValues.append('available', formData.available);
        
        // Append nested objects as JSON strings
        productValues.append('prices', JSON.stringify(prices));
        productValues.append('age', JSON.stringify(formData.age));
        productValues.append('asset', JSON.stringify(formData.asset));
        
        // Append new selected image files
        selectedImages.forEach(file => {
            productValues.append('images', file);
        });

        // Append existing image URLs to keep for updates
        if (isUpdate) {
            const existingUrls = imagePreviews.filter(url => !url.startsWith('blob:'));
            productValues.append('existingImages', JSON.stringify(existingUrls));
        }

        try {
            const data = isUpdate 
                ? await updateProduct(product._id, productValues)
                : await addProduct(productValues);
            
            onSuccess();
            data?.message && toast.success(data.message);
        } catch (error) {
            toast.error(error.message);
            console.error('Submission error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isUpdate) {
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
                available: product.available,
                asset: {
                    path: product.asset.path,
                    type: product.asset.type,
                },
            });
            setImagePreviews(product.images);
        }
    }, [product]);

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

            {/* Image Upload */}
            {<div className="bg-secondary/10 p-4 rounded-md">
                <h2 className="text-xl font-semibold mb-2">Images</h2>
                <div className="flex flex-col items-center space-y-4">
                    <label
                        htmlFor="image-upload"
                        className="w-full text-center px-4 py-2 m-0 bg-white text-gray-700 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    >
                        {selectedImages.length > 0 ? `${selectedImages.length} file(s) selected` : 'Choose Files'}
                    </label>
                    <input
                        id="image-upload"
                        type="file"
                        name="images"
                        multiple
                        required={imagePreviews.length === 0}
                        ref={imageInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </div>
                {imagePreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative w-full h-32 overflow-hidden rounded-md shadow-md">
                                <img src={preview} alt={`preview ${index}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 leading-none text-xs w-6 h-6 flex items-center justify-center font-bold"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            }
            
            <Button type="submit" className="justify-self-end">
                {loading 
                    ? (isUpdate ? 'Updating Product...' : 'Adding Product...') 
                    : (isUpdate ? 'Update Product' : 'Add Product')
                }
            </Button>
        </form>
    );
}