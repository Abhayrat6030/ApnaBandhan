import { siteConfig } from "@/lib/constants";

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
      <div className="prose lg:prose-lg dark:prose-invert max-w-none">
        <h1 className="font-headline text-primary">Refund & Cancellation Policy</h1>
        <p className="text-muted-foreground"><em>Last updated: {new Date().toLocaleDateString('en-CA')}</em></p>

        <p>Thank you for choosing ApnaBandhan. We are dedicated to providing high-quality, custom digital products. Our refund and cancellation policy is designed to be fair to both our clients and our design team.</p>

        <h2 className="font-headline">1. Cancellation Policy</h2>
        <p>An order can be cancelled under the following conditions:</p>
        <ul>
          <li><strong>Full Refund:</strong> If you cancel your order within <strong>2 hours</strong> of placing it and before any work has begun by our design team.</li>
          <li><strong>Partial Refund / No Refund:</strong> If work has already started on your project (e.g., initial concepts have been created), the order cannot be cancelled for a full refund. The advance payment will be forfeited to cover the time and resources invested.</li>
        </ul>
        <p>To cancel an order, you must contact us immediately via phone at <a href={`tel:+${siteConfig.phone}`}>+{siteConfig.phone}</a>.</p>
        
        <h2 className="font-headline">2. General Refund Policy</h2>
        <p>Due to the custom and digital nature of our services (videos, e-invites, album designs), we have a strict no-refund policy once the final product has been delivered to you. All sales are considered final upon delivery.</p>

        <h2 className="font-headline">3. Advance Payments</h2>
        <p>To begin work on any project, we require an advance payment. <strong>This advance payment is non-refundable</strong> as it secures your slot in our production schedule and covers the initial costs and effort of our creative team.</p>

        <h2 className="font-headline">4. Revisions and Satisfaction</h2>
        <p>We are committed to your satisfaction. Each service includes a specific number of revisions as detailed on the service page. We will work closely with you during the revision process to make adjustments and ensure you are happy with the design before final delivery.</p>
        <p>Refunds will not be provided for dissatisfaction with a design if it falls within the scope of the original order and the included revisions have been completed. Any additional revisions beyond what is included with the service will be chargeable.</p>

        <h2 className="font-headline">5. Eligibility for a Refund</h2>
        <p>A full refund will only be considered in the rare and exceptional circumstance that ApnaBandhan is unable to deliver the service or complete the project due to unforeseen issues on our end.</p>

        <h2 className="font-headline">6. Process for Requesting a Review</h2>
        <p>If you believe your situation is exceptional and warrants a review, you must contact us within 48 hours of your final delivery, explaining the issue in detail. We will review the case and respond with a resolution within 5-7 business days. This does not guarantee a refund.</p>

        <h2 className="font-headline">7. Contact Us</h2>
        <p>If you have any questions about our Refund & Cancellation Policy, please contact us before placing an order:</p>
        <ul>
          <li>By email: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></li>
          <li>By phone/WhatsApp: <a href={`tel:+${siteConfig.phone}`}>+{siteConfig.phone}</a></li>
        </ul>
      </div>
    </div>
  );
}
