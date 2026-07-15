import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <main className="p-6">
      <AdminPageHeader title="Add Product" subtitle="Create a new product listing" />
      <ProductForm />
    </main>
  );
}
