import { siteConfig } from "@/lib/constants";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
      <div className="prose lg:prose-lg dark:prose-invert max-w-none">
        <h1 className="font-headline text-primary">Privacy Policy for ApnaBandhan</h1>
        <p className="text-muted-foreground"><em>Last updated: {new Date().toLocaleDateString('en-CA')}</em></p>

        <p>ApnaBandhan ("us", "we", or "our") operates the website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>
        
        <p>We use your data to provide and improve our services. By using the Service, you agree to the collection and use of information in accordance with this policy. </p>

        <h2 className="font-headline">1. Information Collection and Use</h2>
        <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>

        <h3 className="font-headline">Types of Data Collected</h3>
        
        <h4>Personal Data</h4>
        <p>While using our Service, particularly when you place an order or contact us, we may ask you to provide us with certain personally identifiable information ("Personal Data"). This may include, but is not limited to:</p>
        <ul>
          <li>Full Name</li>
          <li>Email Address</li>
          <li>Phone Number (for communication and WhatsApp updates)</li>
          <li>Wedding Date and Event Details</li>
          <li>Photographs, videos, and text content you provide for your invitations or albums.</li>
        </ul>

        <h4>Usage Data</h4>
        <p>We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data.</p>

        <h2 className="font-headline">2. Use of Data</h2>
        <p>ApnaBandhan uses the collected data for the following purposes:</p>
        <ul>
            <li>To create and deliver the service you ordered (e.g., invitation video, e-card, album design).</li>
            <li>To communicate with you regarding your order, including sending proofs for review and final delivery.</li>
            <li>To provide customer support and respond to your inquiries.</li>
            <li>To process payments for our services.</li>
            <li>To notify you about changes to our Service or policies.</li>
            <li>To monitor the usage of the Service for internal analysis and improvement.</li>
            <li>To detect, prevent, and address technical issues.</li>
        </ul>

        <h2 className="font-headline">3. Data Security</h2>
        <p>The security of your data is important to us. We take reasonable precautions to protect your personal information and the content you provide. However, please remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
        
        <h2 className="font-headline">4. Data Retention</h2>
        <p>We will retain your Personal Data and project files only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain project data for a reasonable period after project completion (typically 90 days) to accommodate any further requests, after which it may be permanently deleted from our active systems.</p>

        <h2 className="font-headline">5. Sharing of Data</h2>
        <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. Your project content (invitations, videos) will only be shared publicly (e.g., in our portfolio) with your explicit permission. We may share information with trusted third parties who assist us in operating our website or servicing you, so long as those parties agree to keep this information confidential.</p>

        <h2 className="font-headline">6. Your Rights</h2>
        <p>You have the right to request access to the personal data we hold about you. You may also request that we correct or delete your personal data. To make such a request, please contact us at <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>

        <h2 className="font-headline">7. Changes To This Privacy Policy</h2>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>

        <h2 className="font-headline">8. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us:</p>
         <ul>
          <li>By email: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></li>
          <li>By phone/WhatsApp: <a href={`tel:+${siteConfig.phone}`}>+{siteConfig.phone}</a></li>
          <li>By visiting this page on our website: <Link href="/contact">/contact</Link></li>
        </ul>
      </div>
    </div>
  );
}
