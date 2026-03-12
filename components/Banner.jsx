'use client'
import React from 'react'
import toast from 'react-hot-toast';

export default function Banner() {

    const [isOpen, setIsOpen] = React.useState(true);

    const handleClaim = () => {
        setIsOpen(false);
        toast.success('Promo code copied!');
        navigator.clipboard.writeText('WELCOME20');
    };

    return isOpen && (
        <div className="w-full px-6 py-2 font-medium text-sm text-white text-center bg-gradient-to-r from-violet-500 via-[#9938CA] to-[#E0724A]">
            <div className='flex items-center justify-between max-w-7xl mx-auto'>
                <p>Hire Top Editors and Get Your Projects Done Quickly!</p>
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={handleClaim} 
                        type="button" 
                        className="font-normal text-gray-800 bg-white px-5 py-1.5 rounded-full max-sm:hidden"
                    >
                        Get Promo
                    </button>
                    <button 
                        onClick={() => setIsOpen(false)} 
                        type="button" 
                        className="font-normal text-gray-800 py-1.5 rounded-full"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
}
