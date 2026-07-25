import { useState, useEffect } from 'react';
import { type Product } from './interfaces/types';

export default function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Make sure the port matches your running backend server terminal (e.g., 7204)
        fetch('https://localhost:7204/api/products')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to connect to the server inventory pipeline.');
                }
                return response.json();
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
                {/* Header Block Section */}
                <div className="border-b border-gray-200 pb-6 mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Full-Stack Storefront</h1>
                        <p className="text-gray-500 text-sm mt-1">Live catalog data pulled straight from SQL Server database</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
                        Active Connection
                    </span>
                </div>

                {/* Empty Inventory State Fallback */}
                {products.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 font-medium">Your database is connected, but the products table is completely empty.</p>
                        <p className="text-gray-400 text-sm mt-1">Use your Scalar dashboard panel to POST mock item rows!</p>
                    </div>
                ) : (
                    /* Grid Matrix mapping items into styled components */
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
                                    <p className="text-gray-500 text-sm line-clamp-3 mb-4">{product.description}</p>
                                </div>
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${product.stockQuantity > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        {product.stockQuantity > 0 ? `${product.stockQuantity} items in stock` : 'Out of Stock'}
                                    </span>
                                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition-colors duration-150">
                                        Manage Item
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
