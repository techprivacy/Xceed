import Header from './Header';
import Navbar from './Navbar';

export default function SiteHeader() {
  return (
    <div className="sticky top-0 z-40 shadow-sm">
      <Header />
      <Navbar />
    </div>
  );
}
