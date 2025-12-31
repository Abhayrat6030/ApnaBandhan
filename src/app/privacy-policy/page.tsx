
import { siteConfig } from "@/lib/constants";
import Link from "next/link";
import { ShieldCheck, Mail, Phone, Fingerprint, Database, Truck, User, AlertTriangle, MessageSquare, PenSquare, Share2, Info } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-secondary/30">
      <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
        <div className="mx-auto max-w-none rounded-lg bg-card p-8 shadow-lg md:p-12">
            <div className="flex flex-col items-center text-center mb-10">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <ShieldCheck className="h-10 w-10 text-primary" />
                </div>
                <h1 className="font-headline text-4xl font-bold text-primary">Privacy Policy</h1>
                <p className="mt-2 text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-CA')}</p>
            </div>

            <div className="prose prose-lg max-w-none prose-headings:font-headline prose-headings:font-bold prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 dark:prose-invert space-y-8">
                
                <div>
                  <p>ApnaBandhan ("us", "we", or "our") operates the {siteConfig.name} website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data. We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner.</p>
                  <p>By using our Service, you agree to the collection and use of information in accordance with this policy. If you do not agree with the terms of this policy, please do not use our Service.</p>
                </div>

                <div>
                  <h2 className="flex items-center !mb-4"><Info className="inline-block mr-3 h-6 w-6 text-primary" />Information We Collect</h2>
                  <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
                  
                  <div className="space-y-4">
                    <h3 className="!mt-6">Types of Data Collected</h3>
                    
                    <div>
                      <h4 className="!my-2">Personal Data</h4>
                      <p>While using our Service, particularly when you place an order, contact us, or register an account, we may ask you to provide us with certain personally identifiable information ("Personal Data"). This may include, but is not limited to:</p>
                      <ul>
                          <li><Fingerprint className="inline-block mr-2 h-5 w-5 text-accent" /> <strong>Contact Information:</strong> Full Name, Email Address, Phone Number.</li>
                          <li><PenSquare className="inline-block mr-2 h-5 w-5 text-accent" /> <strong>Event Details:</strong> Names of the couple/individuals, parents' names, event dates, times, and venue addresses.</li>
                          <li><Share2 className="inline-block mr-2 h-5 w-5 text-accent" /> <strong>Project Content:</strong> Photographs, videos, text, and any other materials you provide for the creation of your invitations, videos, or albums.</li>
                          <li><MessageSquare className="inline-block mr-2 h-5 w-5 text-accent" /> <strong>Communication Data:</strong> Records of your correspondence with us via email, WhatsApp, or phone.</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="!my-2">Usage Data</h4>
                      <p>We may also collect information on how the Service is accessed and used ("Usage Data"). This may include your computer's IP address, browser type, browser version, the pages of our Service you visit, the time and date of your visit, time spent on those pages, and other diagnostic data. This information is used to analyze trends and improve the user experience.</p>
                    </div>
                      
                    <div>
                      <h4 className="!my-2">Tracking & Cookies Data</h4>
                      <p>We use cookies and similar tracking technologies to track activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>
                    </div>
                  </div>

                </div>

                <div>
                  <h2 className="flex items-center !mb-4"><User className="inline-block mr-3 h-6 w-6 text-primary" />How We Use Your Data</h2>
                  <p>ApnaBandhan uses the collected data for various purposes:</p>
                  <ul>
                      <li><strong>To Provide and Deliver Our Services:</strong> To create and personalize the service you ordered (e.g., invitation video, e-card, album design) using the details and content you provide.</li>
                      <li><strong>To Communicate With You:</strong> To manage our client relationship, including sending order confirmations, proofs for review, final deliverables, and responding to your inquiries.</li>
                      <li><strong>For Customer Support:</strong> To provide timely assistance and resolve any issues you may encounter.</li>
                      <li><strong>For Service Improvement:</strong> To monitor and analyze the usage of our Service to improve its functionality, design, and offerings.</li>
                      <li><strong>To Prevent Fraud:</strong> To detect, prevent, and address technical issues and fraudulent activities.</li>
                      <li><strong>For Marketing (with your consent):</strong> With your explicit permission, we may use your finished project in our portfolio on our website or social media. We will never do so without your consent.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="flex items-center !mb-4"><Database className="inline-block mr-3 h-6 w-6 text-primary" />Data Storage and Security</h2>
                  <p>The security of your data is of paramount importance to us. We implement a variety of security measures to maintain the safety of your personal information. Project files and personal data are stored on secure servers.</p>
                  <p>However, please remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
                </div>
                
                <div>
                  <h2 className="flex items-center !mb-4"><Truck className="inline-block mr-3 h-6 w-6 text-primary" />Data Retention</h2>
                  <p>We will retain your Personal Data and project files only for as long as is necessary for the purposes set out in this Privacy Policy. We retain completed project data for a period of <strong>90 days</strong> after final delivery to accommodate any requests for minor changes or re-downloads. After this period, project files may be permanently deleted from our active systems.</p>
                </div>

                <div>
                  <h2 className="flex items-center !mb-4"><Share2 className="inline-block mr-3 h-6 w-6 text-primary" />Data Disclosure and Sharing</h2>
                  <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. Your information will not be shared with third parties, except in the following circumstances:</p>
                   <ul>
                      <li><strong>Service Providers:</strong> We may employ third-party companies and individuals to facilitate our Service (e.g., payment processors, hosting providers), who have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</li>
                      <li><strong>Legal Requirements:</strong> We may disclose your Personal Data in the good faith belief that such action is necessary to comply with a legal obligation, protect and defend the rights or property of ApnaBandhan, or protect the personal safety of users of the Service or the public.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="flex items-center !mb-4"><User className="inline-block mr-3 h-6 w-6 text-primary" />Your Rights</h2>
                  <p>You have certain rights regarding your personal data. You have the right to request access to the data we hold about you, to request corrections to any inaccurate information, and to request the deletion of your personal data from our systems (subject to our data retention policy). To make such a request, please contact us using the details below.</p>
                </div>

                <div>
                  <h2 className="flex items-center !mb-4"><AlertTriangle className="inline-block mr-3 h-6 w-6 text-primary" />Children's Privacy</h2>
                  <p>Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.</p>
                </div>

                <div>
                  <h2 className="flex items-center !mb-4"><PenSquare className="inline-block mr-3 h-6 w-6 text-primary" />Changes To This Privacy Policy</h2>
                  <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
                </div>

                <div>
                  <h2 className="flex items-center !mb-4"><MessageSquare className="inline-block mr-3 h-6 w-6 text-primary" />Contact Us</h2>
                  <p>If you have any questions about this Privacy Policy, please contact us:</p>
                  <ul>
                      <li><Mail className="inline-block mr-2 h-5 w-5 text-accent" /> By email: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></li>
                      <li><Phone className="inline-block mr-2 h-5 w-5 text-accent" /> By phone/WhatsApp: <a href={`https://wa.me/${siteConfig.phone}`}>{siteConfig.phone}</a></li>
                      <li><Info className="inline-block mr-2 h-5 w-5 text-accent" />By visiting our <Link href="/contact">Contact Page</Link></li>
                  </ul>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
