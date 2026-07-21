import AdminPageHeader from '@/components/admin/AdminPageHeader';
import CategoryForm from '@/components/admin/CategoryForm';

export default function NewCategoryPage() {
  return (
    <main className="p-6">
      <AdminPageHeader title="Add Category" subtitle="Create a new product category" />
      <CategoryForm />
    </main>
  );
}
