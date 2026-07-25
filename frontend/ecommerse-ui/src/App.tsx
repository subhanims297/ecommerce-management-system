import { useState } from 'react'

export default function App() {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                    Full-Stack Project Connection
                </div>
                <h1 className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
                    E-Commerce Inventory & Management System
                </h1>
                <p className="mt-2 text-gray-500">
                    Tailwind CSS integration is officially live! Your full-stack developer workspace framework is completely configured.
                </p>
                <div className="mt-4">
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                        Backend API Connected
                    </span>
                </div>
            </div>
        </div>
    )
}
