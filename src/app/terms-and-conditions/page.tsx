
import { siteConfig } from "@/lib/constants";
import Link from "next/link";
import { FileText, Mail, Phone, UserCheck, MessageSquare, Edit, Copyright, AlertTriangle, Gavel, Info } from "lucide-react";

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-secondary/30">
        <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
            <div className="mx-auto max-w-none rounded-lg bg-card p-8 shadow-lg md:p-12">
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <FileText className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="font-headline text-4xl font-bold text-primary">Terms and Conditions</h1>
                    <p className="mt-2 text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-CA')}</p>
                </div>

                <div className="prose prose-lg max-w-none prose-headings:font-headline prose-headings:font-bold prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 dark:prose-invert space-y-8">
                    
                    <div>
                      <p>Welcome to ApnaBandhan! Please read these Terms and Conditions ("Terms") carefully before using our website and services (the "Service") operated by ApnaBandhan ("us", "we", or "our"). Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and clients.</p>
                      <p>By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>
                    </div>

                    <div>
                      <h2 className="flex items-center !mb-4"><Info className="inline-block mr-3 h-6 w-6 text-primary" />Service Provision and Scope</h2>
                      <p>ApnaBandhan provides custom digital products including, but not limited to, wedding invitation videos, e-invites, album designs, and video editing services.</p>
                      <ul>
                          <li>All services are provided as described on their respective pages on our website. Any deviation from this scope must be agreed upon in writing.</li>
                          <li>Delivery timelines provided are estimates and may vary based on project complexity, the timeliness of client feedback, and the number of revisions. While we strive to meet deadlines, we do not guarantee exact delivery dates.</li>
                          <li>The final deliverables will be provided in standard digital formats (e.g., MP4, JPEG, PDF) via a secure download link, email, or WhatsApp. No physical products will be shipped unless explicitly stated as part of the service.</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="flex items-center !mb-4"><UserCheck className="inline-block mr-3 h-6 w-6 text-primary" />Ordering Process and Client Responsibilities</h2>
                      <p>To ensure a smooth process, you (the "Client") agree to the following:</p>
                      <ul>
                          <li><strong>Provide Accurate Information:</strong> You must provide accurate, complete, and final information for the project. This includes all text (names, dates, venues), high-resolution photographs, and any other required content.</li>
                          <li><strong>Proofreading:</strong> You are solely responsible for proofreading all text and details provided. ApnaBandhan is not responsible for any typos, grammatical errors, or incorrect information that was present in the content you supplied. Correction of such errors after a proof has been approved may incur additional charges.</li>
                          <li><strong>Timely Feedback:</strong> You agree to provide feedback and/or approval on proofs within a reasonable timeframe (typically 1-2 business days) to keep the project on schedule.</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="flex items-center !mb-4"><Info className="inline-block mr-3 h-6 w-6 text-primary" />Payments, Refunds, and Cancellations</h2>
                      <p>Our payment and refund policies are designed to be fair to both parties.</p>
                      <ul>
                          <li><strong>Advance Payment:</strong> We require a non-refundable advance payment (typically 50%) before commencing work. This secures your project slot and covers initial design and administrative costs.</li>
                          <li><strong>Final Payment:</strong> The remaining balance is due upon your approval of the final proof, before the high-resolution, watermark-free files are delivered.</li>
                          <li><strong>Refunds and Cancellations:</strong> Our detailed refund policy is available on our <Link href="/refund-policy">Refund Policy</Link> page. As our products are custom-made and digital, we generally do not offer refunds once work has begun.</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="flex items-center !mb-4"><Edit className="inline-block mr-3 h-6 w-6 text-primary" />Revisions Policy</h2>
                      <ul>
                          <li>Each service includes a specific number of revision rounds as mentioned in its description. A "revision round" consists of a list of minor changes.</li>
                          <li>Minor changes include text adjustments, swapping photo placements (with photos already provided), and minor color tweaks.</li>
                          <li>Major changes, such as changing the core template or theme, changing all photos after the design is made, or requesting alterations outside the original scope, are not considered revisions and will be chargeable as extra work.</li>
                          <li>Additional revision rounds beyond what is included in the package will be subject to extra charges at our current hourly rate.</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="flex items-center !mb-4"><Copyright className="inline-block mr-3 h-6 w-6 text-primary" />Intellectual Property and Usage Rights</h2>
                      <ul>
                          <li><strong>Client Content:</strong> You represent and warrant that you have the legal rights and permissions to use all content (photos, videos, music, text) that you provide to us. You agree to indemnify ApnaBandhan against any claims of copyright infringement arising from the use of content you supplied.</li>
                          <li><strong>Our Designs:</strong> All design elements, templates, and layouts created by ApnaBandhan remain the intellectual property of ApnaBandhan. We grant you a license to use the final product for personal use only.</li>
                          <li><strong>Usage License:</strong> Upon full payment, you are granted a perpetual, non-exclusive license to use the final product for personal, non-commercial purposes (e.g., sharing with friends and family online, personal printing).</li>
                          <li><strong>Portfolio Rights:</strong> ApnaBandhan retains the right to use the final work in our portfolio, website, and social media for promotional purposes. We respect your privacy; if you do not want your project displayed, please inform us in writing before the project commences. A non-disclosure fee may apply.</li>
                          <li><strong>Prohibited Use:</strong> You may not resell, redistribute, or use the deliverables for any commercial purpose without obtaining prior written consent and a commercial license from ApnaBandhan.</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="flex items-center !mb-4"><AlertTriangle className="inline-block mr-3 h-6 w-6 text-primary" />Limitation of Liability</h2>
                      <p>To the maximum extent permitted by applicable law, in no event shall ApnaBandhan, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
                      <p>Our total liability in any matter arising out of or related to these terms is limited to the amount paid by you for the specific service in question.</p>
                    </div>

                    <div>
                      <h2 className="flex items-center !mb-4"><Gavel className="inline-block mr-3 h-6 w-6 text-primary" />Governing Law</h2>
                      <p>These Terms shall be governed and construed in accordance with the laws of India, with jurisdiction in the courts of New Delhi, without regard to its conflict of law provisions.</p>
                    </div>

                    <div>
                      <h2 className="flex items-center !mb-4"><Edit className="inline-block mr-3 h-6 w-6 text-primary" />Changes to Terms</h2>
                      <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
                    </div>

                    <div>
                      <h2 className="flex items-center !mb-4"><MessageSquare className="inline-block mr-3 h-6 w-6 text-primary" />Contact Us</h2>
                      <p>If you have any questions about these Terms and Conditions, please contact us:</p>
                      <ul>
                          <li><Mail className="inline-block mr-2 h-5 w-5 text-accent" /> By email: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></li>
                          <li><Phone className="inline-block mr-2 h-5 w-5 text-accent" /> By phone/WhatsApp: <a href={`https://wa.me/${siteConfig.phone}`}>{siteConfig.phone}</a></li>
                      </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
