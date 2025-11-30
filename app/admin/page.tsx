'use client'

import React, { useState, useRef, useMemo, useEffect } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts'
import { 
  LayoutDashboard, Package, Settings, LogOut, Plus, Trash2, Edit2, Wand2, 
  Upload, Image as ImageIcon, X, GripVertical, Copy, FileSpreadsheet,
  TrendingUp, AlertCircle, DollarSign, Calendar, Filter, ChevronDown, ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ProductSize {
  label: string
  price: number
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  cost?: number
  category: string
  imageUrl: string
  stock: number
  sizes?: ProductSize[]
}

type AdminTab = 'DASHBOARD' | 'PRODUCTS' | 'SETTINGS'
type AnalyticsViewType = 'INVENTORY' | 'CATEGORIES' | 'VALUATION' | 'SALES'
type DetailModalType = 'NONE' | 'LOW_STOCK' | 'VALUATION_DETAILS'

const COLORS = ['#2D2A26', '#5C5446', '#8C8476', '#CDC6BC', '#8C3F3F', '#5C7C66']

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<AdminTab>('DASHBOARD')
  const [isEditing, setIsEditing] = useState(false)
  
  // Dashboard State
  const [analyticsView, setAnalyticsView] = useState<AnalyticsViewType>('SALES')
  const [detailModal, setDetailModal] = useState<DetailModalType>('NONE')
  const [timeRange, setTimeRange] = useState('30D')

  // Form State
  const [currentId, setCurrentId] = useState<string>('')
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<string>('')
  const [cost, setCost] = useState<string>('')
  const [stock, setStock] = useState<string>('')
  const [imageUrl, setImageUrl] = useState('')
  const [sizes, setSizes] = useState<ProductSize[]>([])
  
  // Size Input State
  const [sizeLabel, setSizeLabel] = useState('')
  const [sizePrice, setSizePrice] = useState('')

  // AI Loading State
  const [isGenerating, setIsGenerating] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Drag State
  const [draggedSizeIndex, setDraggedSizeIndex] = useState<number | null>(null)

  // CSV Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Load products on mount
  useEffect(() => {
    refreshProducts()
  }, [])

  const refreshProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  // --- Calculations for Dashboard ---
  const lowStockItems = useMemo(() => products.filter(p => p.stock < 5), [products])
  const totalStock = useMemo(() => products.reduce((acc, p) => acc + p.stock, 0), [products])
  const totalValue = useMemo(() => products.reduce((acc, p) => acc + (p.price * p.stock), 0), [products])
  
  const categoryData = useMemo(() => {
    const counts = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1
        return acc
    }, {} as Record<string, number>)
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [products])

  const valuationData = useMemo(() => {
    return products
        .map(p => ({ name: p.name, value: p.price * p.stock }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10)
  }, [products])

  const inventoryData = useMemo(() => {
    return products.map(p => ({
        name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
        stock: p.stock,
        full_name: p.name
    }))
  }, [products])

  // Mock Sales Data
  const salesData = useMemo(() => {
    const baseRevenue = totalValue * 0.15
    return [
      { month: 'Jan', revenue: baseRevenue * 0.8, cost: baseRevenue * 0.8 * 0.4 },
      { month: 'Feb', revenue: baseRevenue * 0.9, cost: baseRevenue * 0.9 * 0.42 },
      { month: 'Mar', revenue: baseRevenue * 1.1, cost: baseRevenue * 1.1 * 0.38 },
      { month: 'Apr', revenue: baseRevenue * 1.05, cost: baseRevenue * 1.05 * 0.4 },
      { month: 'May', revenue: baseRevenue * 1.25, cost: baseRevenue * 1.25 * 0.39 },
      { month: 'Jun', revenue: baseRevenue * 1.4, cost: baseRevenue * 1.4 * 0.35 },
    ].map(item => ({
        ...item,
        profit: item.revenue - item.cost,
        profitMargin: Math.round(((item.revenue - item.cost) / item.revenue) * 100)
    }))
  }, [totalValue])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || 'Failed to upload image')
        return
      }

      const data = await res.json()
      setImageUrl(data.url)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleGenerateDescription = async () => {
    if (!name || !category) {
      alert('Please enter product name and category first')
      return
    }

    try {
      setIsGenerating(true)
      const res = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, keywords: description }),
      })

      const data = await res.json()
      if (data.description) {
        setDescription(data.description)
      } else {
        alert('Failed to generate description')
      }
    } catch (error) {
      console.error('Generate error:', error)
      alert('Failed to generate description. Make sure OPENAI_API_KEY is set.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = async () => {
    if (!name || !price || !category) {
      alert('Please fill in all required fields')
      return
    }

    const productData = {
      name,
      description,
      price,
      cost,
      category,
      imageUrl,
      stock,
      sizes,
    }

    try {
      if (isEditing && currentId) {
        // Update
        await fetch(`/api/products/${currentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        })
      } else {
        // Create
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        })
      }

      resetForm()
      refreshProducts()
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save product')
    }
  }

  const handleEdit = (product: Product) => {
    setCurrentId(product.id)
    setName(product.name)
    setDescription(product.description)
    setPrice(product.price.toString())
    setCost(product.cost?.toString() || '')
    setCategory(product.category)
    setImageUrl(product.imageUrl)
    setStock(product.stock.toString())
    setSizes(product.sizes || [])
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      refreshProducts()
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete product')
    }
  }

  const resetForm = () => {
    setCurrentId('')
    setName('')
    setDescription('')
    setPrice('')
    setCost('')
    setCategory('')
    setImageUrl('')
    setStock('')
    setSizes([])
    setIsEditing(false)
  }

  const addSize = () => {
    if (!sizeLabel || !sizePrice) return
    setSizes([...sizes, { label: sizeLabel, price: parseFloat(sizePrice) }])
    setSizeLabel('')
    setSizePrice('')
  }

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F8F4]">
        <div className="text-[#2D2A26]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#F9F8F4]">
      {/* Sidebar */}
      <div className="w-64 bg-[#1A1816] text-[#E5E0D8] flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-[#2D2A26]">
          <h1 className="text-2xl font-serif text-white">TSUYA NO UCHI</h1>
          <p className="text-xs text-[#786B59] uppercase tracking-widest mt-1">Admin Portal</p>
        </div>
        
        <nav className="flex-1 py-6 space-y-2">
          <button 
            onClick={() => { setActiveTab('DASHBOARD'); setIsEditing(false); }}
            className={`w-full flex items-center px-6 py-3 transition-colors ${activeTab === 'DASHBOARD' ? 'bg-[#2D2A26] text-white border-l-4 border-white' : 'hover:bg-[#2D2A26]/50 text-[#786B59]'}`}
          >
            <LayoutDashboard className="mr-3" size={20} />
            Dashboard
          </button>
          <button 
            onClick={() => { setActiveTab('PRODUCTS'); setIsEditing(false); }}
            className={`w-full flex items-center px-6 py-3 transition-colors ${activeTab === 'PRODUCTS' ? 'bg-[#2D2A26] text-white border-l-4 border-white' : 'hover:bg-[#2D2A26]/50 text-[#786B59]'}`}
          >
            <Package className="mr-3" size={20} />
            Products
          </button>
          <button 
            onClick={() => setActiveTab('SETTINGS')}
            className={`w-full flex items-center px-6 py-3 transition-colors ${activeTab === 'SETTINGS' ? 'bg-[#2D2A26] text-white border-l-4 border-white' : 'hover:bg-[#2D2A26]/50 text-[#786B59]'}`}
          >
            <Settings className="mr-3" size={20} />
            Settings
          </button>
        </nav>

        <div className="p-6 border-t border-[#2D2A26]">
          <Button asChild variant="outline" className="w-full">
            <Link href="/">
              <ArrowRight className="mr-2" size={16} />
              Back to Site
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Dashboard View */}
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <h2 className="text-3xl font-serif text-[#2D2A26]">Executive Overview</h2>
                <div className="flex bg-white border border-[#E5E0D8] rounded-none overflow-hidden">
                  {['7D', '30D', 'YTD'].map(range => (
                    <button 
                      key={range} 
                      onClick={() => setTimeRange(range)}
                      className={`px-4 py-2 text-xs font-medium transition-colors ${timeRange === range ? 'bg-[#2D2A26] text-white' : 'text-[#786B59] hover:bg-[#F2EFE9]'}`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-[#E5E0D8] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#786B59]">Total Products</p>
                      <p className="text-3xl font-serif text-[#2D2A26] mt-2">{products.length}</p>
                    </div>
                    <Package className="text-[#786B59]" size={40} />
                  </div>
                </div>

                <div className="bg-white border border-[#E5E0D8] p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setDetailModal('LOW_STOCK')}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#786B59]">Total Stock</p>
                      <p className="text-3xl font-serif text-[#2D2A26] mt-2">{totalStock}</p>
                      {lowStockItems.length > 0 && (
                        <p className="text-xs text-[#8C3F3F] mt-1 flex items-center">
                          <AlertCircle size={12} className="mr-1" />
                          {lowStockItems.length} low stock
                        </p>
                      )}
                    </div>
                    <TrendingUp className="text-[#786B59]" size={40} />
                  </div>
                </div>

                <div className="bg-white border border-[#E5E0D8] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#786B59]">Inventory Value</p>
                      <p className="text-3xl font-serif text-[#2D2A26] mt-2">${totalValue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="text-[#786B59]" size={40} />
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="bg-white border border-[#E5E0D8] p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-serif text-[#2D2A26]">Analytics</h3>
                  <div className="flex gap-2">
                    <button onClick={() => setAnalyticsView('SALES')} className={`px-3 py-1 text-xs ${analyticsView === 'SALES' ? 'bg-[#2D2A26] text-white' : 'bg-[#F2EFE9] text-[#786B59]'}`}>Sales</button>
                    <button onClick={() => setAnalyticsView('INVENTORY')} className={`px-3 py-1 text-xs ${analyticsView === 'INVENTORY' ? 'bg-[#2D2A26] text-white' : 'bg-[#F2EFE9] text-[#786B59]'}`}>Inventory</button>
                    <button onClick={() => setAnalyticsView('CATEGORIES')} className={`px-3 py-1 text-xs ${analyticsView === 'CATEGORIES' ? 'bg-[#2D2A26] text-white' : 'bg-[#F2EFE9] text-[#786B59]'}`}>Categories</button>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  {analyticsView === 'SALES' && (
                    <AreaChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D8" />
                      <XAxis dataKey="month" stroke="#786B59" />
                      <YAxis stroke="#786B59" />
                      <RechartsTooltip />
                      <Legend />
                      <Area type="monotone" dataKey="revenue" stackId="1" stroke="#2D2A26" fill="#2D2A26" />
                      <Area type="monotone" dataKey="cost" stackId="2" stroke="#8C3F3F" fill="#8C3F3F" />
                    </AreaChart>
                  )}
                  {analyticsView === 'INVENTORY' && (
                    <BarChart data={inventoryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D8" />
                      <XAxis dataKey="name" stroke="#786B59" />
                      <YAxis stroke="#786B59" />
                      <RechartsTooltip />
                      <Bar dataKey="stock" fill="#2D2A26" />
                    </BarChart>
                  )}
                  {analyticsView === 'CATEGORIES' && (
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => entry.name}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Products View */}
          {activeTab === 'PRODUCTS' && !isEditing && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-serif text-[#2D2A26]">Product Management</h2>
                <Button onClick={() => setIsEditing(true)} className="bg-[#2D2A26] text-white hover:bg-[#1A1816]">
                  <Plus className="mr-2" size={18} />
                  Add Product
                </Button>
              </div>

              <div className="grid gap-4">
                {products.map(product => (
                  <div key={product.id} className="bg-white border border-[#E5E0D8] p-4 flex items-center gap-4">
                    {product.imageUrl && (
                      <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#2D2A26]">{product.name}</h3>
                      <p className="text-sm text-[#786B59]">{product.category}</p>
                      <p className="text-sm text-[#2D2A26]">${product.price} • Stock: {product.stock}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleEdit(product)} variant="outline" size="sm">
                        <Edit2 size={16} />
                      </Button>
                      <Button onClick={() => handleDelete(product.id)} variant="destructive" size="sm">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Form */}
          {activeTab === 'PRODUCTS' && isEditing && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-serif text-[#2D2A26]">{currentId ? 'Edit Product' : 'New Product'}</h2>
                <Button onClick={resetForm} variant="outline">
                  <X className="mr-2" size={18} />
                  Cancel
                </Button>
              </div>

              <div className="bg-white border border-[#E5E0D8] p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#786B59] mb-1">Product Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E5E0D8] focus:outline-none focus:border-[#2D2A26]"
                      placeholder="Product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#786B59] mb-1">Category *</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E5E0D8] focus:outline-none focus:border-[#2D2A26]"
                      placeholder="Category"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#786B59] mb-1">Description</label>
                  <div className="flex gap-2">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="flex-1 px-3 py-2 border border-[#E5E0D8] focus:outline-none focus:border-[#2D2A26] min-h-[100px]"
                      placeholder="Product description"
                    />
                    <Button
                      onClick={handleGenerateDescription}
                      disabled={isGenerating}
                      variant="outline"
                      className="self-start"
                    >
                      <Wand2 className={`mr-2 ${isGenerating ? 'animate-spin' : ''}`} size={18} />
                      {isGenerating ? 'Generating...' : 'AI Generate'}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-[#786B59] mb-1">Price *</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E5E0D8] focus:outline-none focus:border-[#2D2A26]"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#786B59] mb-1">Cost (COGS)</label>
                    <input
                      type="number"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E5E0D8] focus:outline-none focus:border-[#2D2A26]"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#786B59] mb-1">Stock</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E5E0D8] focus:outline-none focus:border-[#2D2A26]"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#786B59] mb-1">Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="flex-1 px-3 py-2 border border-[#E5E0D8] focus:outline-none focus:border-[#2D2A26]"
                      placeholder="Image URL or upload"
                    />
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => imageInputRef.current?.click()}
                      disabled={uploading}
                      variant="outline"
                    >
                      <Upload className="mr-2" size={18} />
                      {uploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                  {imageUrl && (
                    <img src={imageUrl} alt="Preview" className="mt-2 w-32 h-32 object-cover border border-[#E5E0D8]" />
                  )}
                </div>

                <div>
                  <label className="block text-sm text-[#786B59] mb-1">Size Variants (Optional)</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={sizeLabel}
                      onChange={(e) => setSizeLabel(e.target.value)}
                      className="flex-1 px-3 py-2 border border-[#E5E0D8] focus:outline-none focus:border-[#2D2A26]"
                      placeholder="Size label (e.g., A4)"
                    />
                    <input
                      type="number"
                      value={sizePrice}
                      onChange={(e) => setSizePrice(e.target.value)}
                      className="w-32 px-3 py-2 border border-[#E5E0D8] focus:outline-none focus:border-[#2D2A26]"
                      placeholder="Price"
                    />
                    <Button onClick={addSize} variant="outline">
                      <Plus size={18} />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {sizes.map((size, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-[#F2EFE9] p-2">
                        <span className="flex-1">{size.label} - ${size.price}</span>
                        <Button onClick={() => removeSize(idx)} variant="ghost" size="sm">
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSubmit} className="bg-[#2D2A26] text-white hover:bg-[#1A1816]">
                    {currentId ? 'Update Product' : 'Create Product'}
                  </Button>
                  <Button onClick={resetForm} variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Settings View */}
          {activeTab === 'SETTINGS' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-serif text-[#2D2A26]">Settings</h2>
              <div className="bg-white border border-[#E5E0D8] p-6">
                <h3 className="font-semibold text-[#2D2A26] mb-4">Environment Configuration</h3>
                <p className="text-sm text-[#786B59] mb-2">
                  Set <code className="bg-[#F2EFE9] px-2 py-1">OPENAI_API_KEY</code> in your <code className="bg-[#F2EFE9] px-2 py-1">.env.local</code> file to enable AI features.
                </p>
                <p className="text-sm text-[#786B59]">
                  Images are stored in <code className="bg-[#F2EFE9] px-2 py-1">/public/uploads/</code>
                </p>
                <p className="text-sm text-[#786B59]">
                  Products are stored in <code className="bg-[#F2EFE9] px-2 py-1">/data/products.json</code>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Low Stock Modal */}
      {detailModal === 'LOW_STOCK' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDetailModal('NONE')}>
          <div className="bg-white p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-serif text-[#2D2A26] mb-4">Low Stock Alert</h3>
            <div className="space-y-2">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="text-[#8C3F3F]">{item.stock} left</span>
                </div>
              ))}
            </div>
            <Button onClick={() => setDetailModal('NONE')} className="mt-4 w-full">Close</Button>
          </div>
        </div>
      )}
    </div>
  )
}

