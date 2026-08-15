import AdminPageHeader from '@/components/admin/AdminPageHeader';
import NewsArticleForm from '@/components/admin/NewsArticleForm';

export default function NewNewsArticlePage() {
  return (
    <main className="p-6">
      <AdminPageHeader title="New Article" subtitle="Publish a News & Awards update" />
      <NewsArticleForm />
    </main>
  );
}
