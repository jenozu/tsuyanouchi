import React from 'react';
import { Package, MapPin, CreditCard, LogOut, ChevronRight, User as UserIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ViewState } from '../types';

interface AccountProps {
  onNavigate: (view: ViewState) => void;
}

export const Account: React.FC<AccountProps> = ({ onNavigate }) => {
  // Mock data for display purposes
  const orders = [
    { id: '#JP-29384', date: 'Oct 24, 2023', status: 'Delivered', total: 1250, items: 'Obsidian Vase' },
    { id: '#JP-29311', date: 'Sep 12, 2023', status: 'Delivered', total: 890, items: 'Silk Kimono Robe' },
    { id: '#JP-28990', date: 'Aug 05, 2023', status: 'Processing', total: 45, items: 'Sandalwood Incense' },
  ];

  return (
    <div className="min-h-screen bg-[#F9F8F4] animate-fade-in">
      {/* Header Background */}
      <div className="bg-[#2D2A26] text-[#F9F8F4] pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-full bg-[#F9F8F4]/10 border border-[#F9F8F4]/20 flex items-center justify-center text-3xl font-serif">
                    JD
                </div>
                <div>
                    <h1 className="text-3xl font-serif">Welcome back, Jane</h1>
                    <p className="text-[#D4CEC5] mt-1">Member since 2023</p>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-4">
                <div className="bg-white rounded-none shadow-sm border border-[#E5E0D8] overflow-hidden">
                    <button className="w-full flex items-center justify-between px-6 py-4 bg-[#F9F8F4] border-l-4 border-[#2D2A26] text-[#2D2A26] font-medium text-sm">
                        <div className="flex items-center gap-3">
                            <Package size={18} />
                            Orders
                        </div>
                        <ChevronRight size={16} />
                    </button>
                    <button className="w-full flex items-center justify-between px-6 py-4 text-[#4A4036] hover:bg-[#F2EFE9] transition-colors text-sm font-medium">
                        <div className="flex items-center gap-3">
                            <UserIcon size={18} />
                            Profile
                        </div>
                    </button>
                    <button className="w-full flex items-center justify-between px-6 py-4 text-[#4A4036] hover:bg-[#F2EFE9] transition-colors text-sm font-medium">
                        <div className="flex items-center gap-3">
                            <MapPin size={18} />
                            Addresses
                        </div>
                    </button>
                    <button className="w-full flex items-center justify-between px-6 py-4 text-[#4A4036] hover:bg-[#F2EFE9] transition-colors text-sm font-medium">
                        <div className="flex items-center gap-3">
                            <CreditCard size={18} />
                            Wallet
                        </div>
                    </button>
                </div>
                
                <div className="bg-white rounded-none shadow-sm border border-[#E5E0D8] p-6">
                    <h3 className="text-xs font-semibold text-[#786B59] uppercase tracking-wider mb-4">Need Help?</h3>
                    <p className="text-sm text-[#4A4036] mb-4">Our concierge team is available to assist with your orders.</p>
                    <Button variant="outline" className="w-full text-xs py-2">Contact Support</Button>
                </div>

                <button className="flex items-center gap-2 text-[#786B59] hover:text-[#8C3F3F] transition-colors text-sm font-medium px-2">
                    <LogOut size={16} />
                    Sign Out
                </button>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-8">
                
                {/* Recent Orders */}
                <div className="bg-white rounded-none shadow-sm border border-[#E5E0D8] p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-serif text-[#2D2A26]">Recent Orders</h2>
                        <button className="text-sm text-[#2D2A26] hover:text-[#786B59] border-b border-[#2D2A26] hover:border-[#786B59] pb-0.5">View All</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-[#E5E0D8]">
                                    <th className="pb-4 text-xs font-semibold text-[#786B59] uppercase tracking-wider">Order ID</th>
                                    <th className="pb-4 text-xs font-semibold text-[#786B59] uppercase tracking-wider">Date</th>
                                    <th className="pb-4 text-xs font-semibold text-[#786B59] uppercase tracking-wider">Items</th>
                                    <th className="pb-4 text-xs font-semibold text-[#786B59] uppercase tracking-wider">Status</th>
                                    <th className="pb-4 text-xs font-semibold text-[#786B59] uppercase tracking-wider text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F2EFE9]">
                                {orders.map(order => (
                                    <tr key={order.id} className="group hover:bg-[#F9F8F4] transition-colors">
                                        <td className="py-6 text-sm font-medium text-[#2D2A26]">{order.id}</td>
                                        <td className="py-6 text-sm text-[#786B59]">{order.date}</td>
                                        <td className="py-6 text-sm text-[#2D2A26]">{order.items}</td>
                                        <td className="py-6">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${
                                                order.status === 'Delivered' 
                                                    ? 'bg-[#5C7C66]/10 text-[#5C7C66]' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-6 text-sm font-medium text-[#2D2A26] text-right">${order.total.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Account Details Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-none shadow-sm border border-[#E5E0D8] p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-serif text-[#2D2A26]">Default Address</h3>
                            <button className="text-xs text-[#786B59] hover:text-[#2D2A26]">Edit</button>
                        </div>
                        <div className="text-sm text-[#4A4036] space-y-1">
                            <p className="font-medium text-[#2D2A26]">Jane Doe</p>
                            <p>123 Sakura Lane</p>
                            <p>Shibuya City, Tokyo 150-0001</p>
                            <p>Japan</p>
                        </div>
                    </div>

                     <div className="bg-white rounded-none shadow-sm border border-[#E5E0D8] p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-serif text-[#2D2A26]">Payment Method</h3>
                            <button className="text-xs text-[#786B59] hover:text-[#2D2A26]">Edit</button>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-12 bg-[#F2EFE9] rounded border border-[#E5E0D8] flex items-center justify-center">
                                <span className="text-xs font-bold text-[#786B59]">VISA</span>
                            </div>
                            <div className="text-sm text-[#4A4036]">
                                <p className="font-medium text-[#2D2A26]">•••• •••• •••• 4242</p>
                                <p className="text-xs text-[#786B59]">Expires 12/25</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};