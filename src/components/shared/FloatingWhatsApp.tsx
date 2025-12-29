import Link from 'next/link';
import { siteConfig } from '@/lib/constants';

// Simple SVG for WhatsApp icon
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" {...props}>
    <path
      d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.546-.827-1.116-.975-1.297a.42.42 0 0 0-.465-.137c-.528.27-1.357.94-1.763 1.545-.448.655-.79 1.336-.79 2.278 0 1.01.606 1.902 1.207 2.472.62.58 1.35 1.01 2.288 1.396.98.405 1.93.58 2.67.58.92.001 1.92-.37 2.58-.91.68-.56.98-.94.98-1.49 0-.46-.427-1.08-.68-1.39a.63.63 0 0 0-.415-.175Z"
      fill="currentColor"
    />
    <path
      d="M16.002 2a14 14 0 1 0 14 14 14 14 0 0 0-14-14Zm0 26.4a12.4 12.4 0 1 1 12.4-12.4 12.4 12.4 0 0 1-12.4 12.4Z"
      fill="currentColor"
    />
  </svg>
);


export default function FloatingWhatsApp() {
  return (
    <Link 
      href={`https://wa.me/${siteConfig.phone}`} 
      target="_blank" 
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 h-14 w-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all transform hover:scale-110"
    >
      <WhatsAppIcon className="h-8 w-8 text-white" />
    </Link>
  );
}
