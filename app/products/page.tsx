"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, Button, Modal, Form, Input, message, Radio, Drawer } from "antd"
import type { TableProps } from "antd"
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Image from "next/image"
import { useMediaQuery } from "@/hooks/use-mobiile"
import AdminNavbar from "@/components/admin-navbar"
import AdminSidebar from "@/components/admin-sidebar"

interface Product {
  id: string
  title: string
  description: string
  photolink: string
  price: string
  pinned?: string
}

// Add image compression utility
const compressImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!
    const img = new window.Image()

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => {
          resolve(new File([blob!], file.name, { type: "image/jpeg" }))
        },
        "image/jpeg",
        quality,
      )
    }

    img.src = URL.createObjectURL(file)
  })
}

// Cloudinary upload function
const uploadToCloudinary = async (file: File): Promise<string> => {
  const compressedFile = await compressImage(file)
  const formData = new FormData()
  formData.append("file", compressedFile)

  try {
    console.log("Uploading to /api/upload...")
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    console.log("Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Upload response error:", errorText)
      throw new Error(`Failed to upload image: ${response.status}`)
    }

    const data = await response.json()
    console.log("Upload response data:", data)

    if (!data.secure_url) {
      throw new Error("No secure_url in response")
    }

    return data.secure_url
  } catch (error) {
    console.error("Upload error:", error)
    throw error
  }
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form] = Form.useForm()
  const [uploading, setUploading] = useState<boolean>(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")

  const productsCollectionRef = collection(db, "products")

  useEffect(() => {
    // Add smooth scrolling to the document
    document.documentElement.style.scrollBehavior = "smooth"
    fetchProducts()

    return () => {
      document.documentElement.style.scrollBehavior = "auto"
    }
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await getDocs(productsCollectionRef)
      const productsData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[]
      
      // Sort products: pinned first, then by creation order
      const sortedProducts = productsData.sort((a, b) => {
        if (a.pinned === "yes" && b.pinned !== "yes") return -1
        if (a.pinned !== "yes" && b.pinned === "yes") return 1
        return 0
      })
      
      setProducts(sortedProducts)
    } catch (error) {
      console.error("Error fetching products:", error)
      message.error("Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingProduct(null)
    setPreviewUrl(null)
    setCurrentImageUrl("")
    form.resetFields()
    // Set default values for new products
    form.setFieldsValue({
      title: "",
      description: "",
      price: "",
      pinned: "no",
      photolink: ""
    })
    setIsModalOpen(true)
  }

  const handleEdit = (record: Product) => {
    setEditingProduct(record)
    setPreviewUrl(null)
    setCurrentImageUrl(record.photolink || "")
    
    // Use setTimeout to ensure form is ready before setting values
    setTimeout(() => {
      form.setFieldsValue({
        title: record.title || "",
        description: record.description || "",
        price: record.price || "",
        pinned: record.pinned || "no",
        photolink: record.photolink || ""
      })
    }, 0)
    
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      setLoading(true)
      const productDoc = doc(db, "products", id)
      await deleteDoc(productDoc)
      message.success("Product deleted successfully")
      fetchProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
      message.error("Failed to delete product")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    const newPreviewUrl = URL.createObjectURL(file)
    setPreviewUrl(newPreviewUrl)

    setUploading(true)
    try {
      console.log("Starting upload...")
      const imageUrl = await uploadToCloudinary(file)
      console.log("Upload successful, URL:", imageUrl)

      form.setFieldValue("photolink", imageUrl)
      form.setFieldsValue({ photolink: imageUrl })
      setCurrentImageUrl(imageUrl)

      try {
        await form.validateFields(["photolink"])
      } catch (validationError) {
        console.log("Validation error (might be expected):", validationError)
      }

      URL.revokeObjectURL(newPreviewUrl)
      setPreviewUrl(null)
      message.success("Image uploaded successfully")
    } catch (error) {
      console.error("Error uploading image:", error)
      message.error("Failed to upload image. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      console.log("Starting form validation...")
      const values = await form.validateFields()
      console.log("Form values after validation:", values)

      // For editing: if no new image uploaded, keep the current image
      if (editingProduct && !values.photolink && currentImageUrl) {
        values.photolink = currentImageUrl
      }

      // For new products: must have an image
      if (!editingProduct && !values.photolink) {
        message.error("Please upload an image before submitting")
        return
      }

      // For editing: if still no photolink, show error
      if (editingProduct && !values.photolink) {
        message.error("Product must have an image")
        return
      }

      setLoading(true)

      if (editingProduct) {
        console.log("Updating product:", editingProduct.id)
        const productDoc = doc(db, "products", editingProduct.id)
        await updateDoc(productDoc, values)
        message.success("Product updated successfully")
      } else {
        console.log("Adding new product")
        await addDoc(productsCollectionRef, values)
        message.success("Product added successfully")
      }

      setIsModalOpen(false)
      setPreviewUrl(null)
      setCurrentImageUrl("")
      setEditingProduct(null)
      form.resetFields()
      fetchProducts()
    } catch (error) {
      console.error("Error submitting product:", error)

      if (error && typeof error === "object" && "errorFields" in error) {
        const formError = error as any
        console.log("Form validation errors:", formError.errorFields)
        message.error("Please fill in all required fields")
      } else if (error && typeof error === "object" && "message" in error) {
        message.error(`Error: ${(error as any).message}`)
      } else {
        message.error("Failed to submit product. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleModalCancel = () => {
    setIsModalOpen(false)
    setCurrentImageUrl("")
    setEditingProduct(null)
    form.resetFields()
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  // Mobile-friendly product card component
  const ProductCard = ({ product }: { product: Product }) => (
    <div className={`bg-white rounded-lg shadow-md p-4 mb-4 border transition-shadow duration-300 hover:shadow-lg ${
      product.pinned === "yes" ? "border-blue-300 bg-blue-50" : "border-gray-200"
    }`}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0 self-center sm:self-start relative">
          <Image
            src={product.photolink || "/placeholder.svg"}
            alt="Product"
            width={120}
            height={120}
            className="object-cover rounded-lg w-full sm:w-[120px] h-[120px]"
          />
          {product.pinned === "yes" && (
            <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{product.title}</h3>
            {product.pinned === "yes" && (
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                Pinned
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
            <span className="text-lg font-bold text-green-600">{product.price}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="primary"
              onClick={() => handleEdit(product)}
              className="flex-1 sm:flex-none"
              size={isMobile ? "large" : "middle"}
            >
              Edit
            </Button>
            <Button
              danger
              onClick={() => handleDelete(product.id)}
              className="flex-1 sm:flex-none"
              size={isMobile ? "large" : "middle"}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const columns: TableProps<Product>["columns"] = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: isTablet ? 150 : 200,
      ellipsis: true,
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <span>{text}</span>
          {record.pinned === "yes" && (
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: isTablet ? 200 : 300,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 100,
    },
    {
      title: "Pinned",
      dataIndex: "pinned",
      key: "pinned",
      width: 80,
      render: (val) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            val === "yes" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"
          }`}
        >
          {val === "yes" ? "Yes" : "No"}
        </span>
      ),
    },
    {
      title: "Image",
      dataIndex: "photolink",
      key: "photolink",
      width: 120,
      render: (link) => (
        <Image
          src={link || "/placeholder.svg"}
          alt="Product"
          width={80}
          height={80}
          className="object-cover rounded-lg"
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_, record) => (
        <div className="flex flex-col lg:flex-row gap-1 lg:gap-2">
          <Button size="small" onClick={() => handleEdit(record)} className="w-full lg:w-auto">
            Edit
          </Button>
          <Button danger size="small" onClick={() => handleDelete(record.id)} className="w-full lg:w-auto">
            Delete
          </Button>
        </div>
      ),
    },
  ]

  const FormContent = () => (
    <Form
      form={form}
      layout="vertical"
      preserve={false}
      initialValues={{
        title: editingProduct?.title || "",
        description: editingProduct?.description || "",
        price: editingProduct?.price || "",
        pinned: editingProduct?.pinned || "no",
        photolink: editingProduct?.photolink || ""
      }}
      className="space-y-4"
    >
      <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please input the title!" }]}>
        <Input size={isMobile ? "large" : "middle"} />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: "Please input the description!" }]}
      >
        <Input.TextArea rows={4} size={isMobile ? "large" : "middle"} className="resize-none" />
      </Form.Item>

      <Form.Item name="price" label="Price" rules={[{ required: true, message: "Please input the price!" }]}>
        <Input prefix="₹" size={isMobile ? "large" : "middle"} />
      </Form.Item>

      <Form.Item name="pinned" label="Pin to Top" rules={[{ required: true, message: "Please select pin option!" }]}>
        <Radio.Group size={isMobile ? "large" : "middle"}>
          <Radio value="yes">Yes - Show on top</Radio>
          <Radio value="no">No - Normal order</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item name="photolink" label="Product Image" rules={[{ required: !editingProduct, message: "Please upload an image!" }]}>
        <div className="flex flex-col gap-3">
          <Input type="hidden" />
          <input
            type="file"
            id="product-image-upload"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploading}
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => document.getElementById("product-image-upload")?.click()}
              loading={uploading}
              size={isMobile ? "large" : "middle"}
              className="w-full sm:w-auto"
            >
              {uploading ? "Uploading..." : editingProduct ? "Change Image" : "Upload Image"}
            </Button>
            {editingProduct && (
              <p className="text-xs text-gray-500">
                Leave empty to keep current image, or upload a new one to replace it.
              </p>
            )}
          </div>

          {currentImageUrl && !previewUrl && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Current Image:</p>
              <div className="flex justify-center">
                <Image
                  src={currentImageUrl}
                  alt="Current product image"
                  width={200}
                  height={200}
                  className="object-cover border rounded-lg max-w-full h-auto"
                />
              </div>
              <div className="text-xs text-gray-500 break-all p-2 bg-gray-50 rounded">
                Current URL: {currentImageUrl}
              </div>
            </div>
          )}

          {previewUrl && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">New Image Preview:</p>
              <div className="flex justify-center">
                <Image
                  src={previewUrl}
                  alt="New image preview"
                  width={200}
                  height={200}
                  className="object-cover border rounded-lg max-w-full h-auto border-blue-300"
                />
              </div>
              <p className="text-xs text-blue-600 text-center">This new image will replace the current one</p>
            </div>
          )}
        </div>
      </Form.Item>
    </Form>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <AdminNavbar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      
      {/* Layout with Sidebar */}
      <div className="flex">
        <AdminSidebar 
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
          activeTab="products" 
        />
        
        {/* Main Content Area */}
        <main className="flex-1 md:ml-0 transition-all duration-300">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Product Management</h1>
                <Button
                  type="primary"
                  onClick={handleAdd}
                  size={isMobile ? "large" : "middle"}
                  className="w-full sm:w-auto"
                >
                  Add Product
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {isMobile ? (
                // Mobile Card View
                <div className="p-4">
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No products found</div>
                  ) : (
                    <div className="space-y-4">
                      {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Desktop/Tablet Table View
                <div className="overflow-x-auto">
                  <Table
                    columns={columns}
                    dataSource={products}
                    rowKey="id"
                    loading={loading}
                    bordered
                    scroll={{ x: 800 }}
                    pagination={{
                      responsive: true,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    className="min-w-full"
                    rowClassName={(record) => record.pinned === "yes" ? "bg-blue-50" : ""}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal/Drawer for Form */}
      {isMobile ? (
        <Drawer
          title={editingProduct ? "Edit Product" : "Add Product"}
          placement="bottom"
          onClose={handleModalCancel}
          open={isModalOpen}
          height="90vh"
          className="rounded-t-lg"
          extra={
            <div className="flex gap-2">
              <Button onClick={handleModalCancel}>Cancel</Button>
              <Button type="primary" onClick={handleSubmit} loading={loading}>
                {editingProduct ? "Update" : "Add"}
              </Button>
            </div>
          }
        >
          <div className="pb-20">
            <FormContent />
          </div>
        </Drawer>
      ) : (
        <Modal
          title={editingProduct ? "Edit Product" : "Add Product"}
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={handleModalCancel}
          confirmLoading={loading}
          width={isTablet ? "90vw" : 600}
          centered
          okText={editingProduct ? "Update" : "Add"}
          className="smooth-modal"
        >
          <FormContent />
        </Modal>
      )}

      <style jsx global>{`
        .smooth-modal .ant-modal-content {
          transition: all 0.3s ease-in-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @media (max-width: 768px) {
          .ant-table-thead > tr > th {
            padding: 8px 4px;
            font-size: 12px;
          }
          
          .ant-table-tbody > tr > td {
            padding: 8px 4px;
            font-size: 12px;
          }
        }
        
        /* Smooth scrolling for all elements */
        * {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar for better mobile experience */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  )
}