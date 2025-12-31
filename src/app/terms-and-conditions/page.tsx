import { siteConfig } from "@/lib/constants";
import Link from "next/link";

export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
      <div className="prose lg:prose-lg dark:prose-invert max-w-none">
        <h1 className="font-headline text-primary">Terms and Conditions</h1>
        <p className="text-muted-foreground"><em>Last updated: {new Date().toLocaleDateString('en-CA')}</em></p>

        <p>Please read these Terms and Conditions ("Terms") carefully before using the ApnaBandhan website (the "Service") operated by ApnaBandhan ("us", "we", or "our").</p>
        
        <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service. By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</p>

        <h2 className="font-headline">1. Service Provision</h2>
        <p>ApnaBandhan provides custom digital products including, but not limited to, wedding invitation videos, e-invites, album designs, and video editing services.</p>
        <ul>
            <li>All services are provided as described on their respective pages on our website.</li>
            <li>Delivery timelines are estimates and may vary based on project complexity and the number of revisions. We will make every reasonable effort to deliver services on time but do not guarantee exact delivery dates.</li>
            <li>The final deliverables will be provided in digital format (e.g., MP4, JPEG, PDF) via a download link, email, or WhatsApp.</li>
        </ul>

        <h2 className="font-headline">2. Ordering and Payments</h2>
        <p>To place an order, you must provide accurate and complete information, including contact details and all necessary content (text, photos, etc.).</p>
        <ul>
            <li>We typically require an advance payment before commencing work on any project. This advance is non-refundable as stated in our <Link href="/refund-policy">Refund Policy</Link>.</li>
            <li>The remaining balance is due upon completion of the project, before the final, high-resolution, watermark-free files are delivered.</li>
            <li>Payments can be made via UPI, Google Pay, PhonePe, Paytm, or direct bank transfer. Details will be provided upon order confirmation.</li>
        </ul>

        <h2 className="font-headline">3. Content and Revisions</h2>
        <ul>
            <li>You, the client, are responsible for providing all content (text, names, dates, photos, videos) required for the project. Please ensure all text is proofread and correct before submission. We are not responsible for typos or factual errors in the content you provide.</li>
            <li>Each service includes a specific number of revisions as mentioned in its description. A "revision" constitutes minor changes to text, image placement, or color adjustments. It does not include a complete redesign.</li>
            <li>Additional revisions beyond the included number will be subject to extra charges at our current rate.</li>
        </ul>

        <h2 className="font-headline">4. Intellectual Property & Usage Rights</h2>
        <ul>
            <li>Upon full payment, you (the client) are granted a license to use the final product for personal, non-commercial purposes (e.g., sharing with friends and family).</li>
            <li>ApnaBandhan retains the right to use any created work for its own promotional purposes, such as in our portfolio, on our website, and on social media. We will, however, respect your privacy and can agree not to display your project publicly if requested in writing before the project starts.</li>
            <li>You may not resell, redistribute, or use the final product for any commercial purpose without prior written consent from ApnaBandhan.</li>
        </ul>

        <h2 className="font-headline">5. Limitation of Liability</h2>
        <p>To the maximum extent permitted by applicable law, in no event shall ApnaBandhan be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information) arising out of or in any way related to the use of or inability to use the Service.</p>
        <p>Our liability is limited to the total amount paid by you for the service in question.</p>

        <h2 className="font-headline">6. Governing Law</h2>
        <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes will be subject to the exclusive jurisdiction of the courts located in New Delhi, India.</p>

        <h2 className="font-headline">7. Changes to Terms</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms and Conditions on this page.</p>

        <h2 className="font-headline">8. Contact Us</h2>
        <p>If you have any questions about these Terms and Conditions, please contact us:</p>
         <ul>
          <li>By email: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></li>
          <li>By phone/WhatsApp: <a href={`tel:+${siteConfig.phone}`}>+{siteConfig.phone}</a></li>
        </ul>
      </div>
    </div>
  );
}
