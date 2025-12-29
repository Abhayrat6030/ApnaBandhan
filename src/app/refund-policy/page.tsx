export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
      <div className="prose lg:prose-lg dark:prose-invert">
        <h1 className="font-headline">Refund Policy</h1>
        <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

        <p>Thank you for choosing ApnaBandhan. We strive to provide the best service possible. Please read our refund policy carefully.</p>

        <h2 className="font-headline">General Policy</h2>
        <p>Due to the custom and digital nature of our services, we generally do not offer refunds once work has commenced on your project. However, we are committed to your satisfaction and will work with you to ensure you are happy with the final product.</p>

        <h2 className="font-headline">Advance Payments</h2>
        <p>Any advance payment made to book a service is non-refundable. This is because we allocate resources and schedule our designers based on your booking.</p>

        <h2 className="font-headline">Eligibility for a Refund</h2>
        <p>A refund may be considered under the following circumstances:</p>
        <ul>
          <li>If we are unable to start your project for any reason from our end.</li>
          <li>In case of a major, uncorrectable error in the final delivered product caused by us.</li>
        </ul>
        <p>Refunds will not be provided for changes of mind or if you are unsatisfied with the design after approving the concepts and revisions.</p>

        <h2 className="font-headline">Process for Requesting a Refund</h2>
        <p>To request a refund, you must contact us within 7 days of receiving your final product, explaining the reason for your request. We will review the case and respond within 5-7 business days.</p>

        <h2 className="font-headline">Contact Us</h2>
        <p>If you have any questions about our Refund Policy, please contact us.</p>
      </div>
    </div>
  );
}
