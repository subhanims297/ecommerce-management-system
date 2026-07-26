import { useState, useEffect } from 'react';
import type { Product } from './interfaces/types';

export default function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Form Input Tracking States
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [stockQuantity, setStockQuantity] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // 1. FETCH DATA: Load existing records from SQL Server on startup
    useEffect(() => {
        fetch('https://localhost:7204/api/products')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch store inventory data.');
                return res.json();
            })
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // 2. CREATE DATA: Submit a new product record via HTTP POST
    const handleCreateProduct = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !price || !stockQuantity) {
            alert("Please fill out all required fields: Name, Price, and Stock.");
            return;
        }

        setIsSubmitting(true);

        const payload = {
            name: name.trim(),
            description: description.trim(),
            price: parseFloat(price),
            stockQuantity: parseInt(stockQuantity, 10),
            imageUrl: "default-box.jpg"
        };

        fetch('https://localhost:7204/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to store product record.');
                return res.json();
            })
            .then((createdProduct: Product) => {
                // Append item onto screen array and reset tracking fields
                setProducts([...products, createdProduct]);
                setName('');
                setDescription('');
                setPrice('');
                setStockQuantity('');
                setIsSubmitting(false);
            })
            .catch((err) => {
                alert(err.message);
                setIsSubmitting(false);
            });
    };

    // 3. DELETE DATA: Remove a specific product record via HTTP DELETE
    const handleDelete = (id: number) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        fetch(`https://localhost:7204/api/products/${id}`, {
            method: 'DELETE',
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to delete item from registry.");
                setProducts(products.filter((p) => p.id !== id));
            })
            .catch((err) => alert(err.message));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-xl font-medium text-gray-600 animate-pulse">Loading storefront items...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl max-w-md shadow-sm">
                    <p className="font-semibold">Network Connection Error</p>
                    <p className="text-sm mt-1">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">

                {/* Header Dashboard Banner */}
                <div className="border-b border-gray-200 pb-6 mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Full-Stack Storefront Dashboard</h1>
                        <p className="text-gray-500 text-sm mt-1">Live administration portal synced seamlessly to SQL Server</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
                        Connected
                    </span>
                </div>

                {/* Product Submission Form Card */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-10 max-w-3xl mx-auto">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Add Inventory Item</h2>
                    <form onSubmit={handleCreateProduct} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Product Name *</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Gaming Mouse"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Price ($) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="29.99"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Stock Count *</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={stockQuantity}
                                        onChange={(e) => setStockQuantity(e.target.value)}
                                        placeholder="15"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter item details..."
                                rows={2}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                            />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-sm transition-colors"
                            >
                                {isSubmitting ? 'Saving Item...' : 'Save Product Record'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Product Catalog Display Grid Layout */}
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Product Catalog Matrix</h2>

                {products.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 font-medium">Your inventory catalog is currently empty.</p>
                        <p className="text-gray-400 text-sm mt-1">Use the creation dashboard above to add records directly into SQL Server.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start gap-4 mb-2">
                                        <h2 className="text-xl font-bold text-gray-900 line-clamp-1">{product.name}</h2>
                                        <span className="text-lg font-extrabold text-indigo-600 whitespace-nowrap">
                                            ${product.price.toFixed(2)}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm line-clamp-3 mb-4">{product.description || 'No description listed.'}</p>
                                </div>

                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center gap-4">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${product.stockQuantity > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        {product.stockQuantity > 0 ? `${product.stockQuantity} items in stock` : 'Out of Stock'}
                                    </span>

                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold px-4 py-2 rounded-xl transition-colors duration-150"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
