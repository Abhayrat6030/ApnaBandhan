export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
      <div className="prose lg:prose-lg dark:prose-invert">
        <h1 className="font-headline">Terms and Conditions</h1>
        <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

        <p>Please read these terms and conditions carefully before using Our Service.</p>

        <h2 className="font-headline">Interpretation and Definitions</h2>
        <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

        <h2 className="font-headline">Acknowledgment</h2>
        <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>
        <p>Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>

        <h2 className="font-headline">Service Provision</h2>
        <p>All services are provided as described on their respective pages. Delivery times are estimates and may vary. We will make every reasonable effort to deliver services on time.</p>
        
        <h2 className="font-headline">Payments</h2>
        <p>Payments can be made via UPI, Google Pay, PhonePe, and Paytm. We may require an advance payment before starting work. The payment status (Pending, Paid, Advance) will be tracked in your order details.</p>

        <h2 className="font-headline">Revisions and Refunds</h2>
        <p>Each service includes a specific number of revisions as mentioned in its description. Additional revisions may incur extra charges. Please see our Refund Policy for details on refunds.</p>

        <h2 className="font-headline">Limitation of Liability</h2>
        <p>To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever.</p>

        <h2 className="font-headline">Governing Law</h2>
        <p>The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.</p>
        
        <h2 className="font-headline">Contact Us</h2>
        <p>If you have any questions about these Terms and Conditions, You can contact us.</p>
      </div>
    </div>
  );
}
