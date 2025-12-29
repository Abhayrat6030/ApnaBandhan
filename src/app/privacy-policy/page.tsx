export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
      <div className="prose lg:prose-lg dark:prose-invert">
        <h1 className="font-headline">Privacy Policy</h1>
        <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

        <p>ApnaBandhan ("us", "we", or "our") operates the https://apnabandhan.com website (the "Service").</p>

        <p>This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data. Our Privacy Policy for ApnaBandhan is created with the help of a Privacy Policy Generator.</p>
        
        <p>We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, accessible from https://apnabandhan.com</p>

        <h2 className="font-headline">Information Collection and Use</h2>
        <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>

        <h3 className="font-headline">Types of Data Collected</h3>
        <h4>Personal Data</h4>
        <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:</p>
        <ul>
          <li>Email address</li>
          <li>First name and last name</li>
          <li>Phone number</li>
          <li>Address, State, Province, ZIP/Postal code, City</li>
          <li>Cookies and Usage Data</li>
        </ul>

        <h2 className="font-headline">Use of Data</h2>
        <p>ApnaBandhan uses the collected data for various purposes:
            <ul>
                <li>To provide and maintain the Service</li>
                <li>To notify you about changes to our Service</li>
                <li>To provide customer care and support</li>
                <li>To provide analysis or valuable information so that we can improve the Service</li>
                <li>To monitor the usage of the Service</li>
                <li>To detect, prevent and address technical issues</li>
            </ul>
        </p>

        <h2 className="font-headline">Changes To This Privacy Policy</h2>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

        <h2 className="font-headline">Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us.</p>
      </div>
    </div>
  );
}
