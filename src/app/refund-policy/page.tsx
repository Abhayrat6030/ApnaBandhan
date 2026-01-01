
import { siteConfig } from "@/lib/constants";
import { CircleDollarSign, Mail, Phone, Clock, FileWarning, MessageSquare, Info, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function RefundPolicyPage() {
  return (
    <div className="bg-secondary/30">
        <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
            <div className="mx-auto max-w-none rounded-lg bg-card p-8 shadow-lg md:p-12">
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <CircleDollarSign className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="font-headline text-4xl font-bold text-primary">Refund & Cancellation Policy</h1>
                    <p className="mt-2 text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-CA')}</p>
                </div>

                <div className="prose prose-lg max-w-none prose-headings:font-headline prose-headings:font-bold prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 dark:prose-invert">
                    <div className="space-y-8">
                        <div>
                          <p>Thank you for choosing ApnaBandhan. We are committed to delivering high-quality, custom digital products tailored to your special day. Our Refund and Cancellation Policy is designed to be transparent and fair. Due to the personalized and digital nature of our services, our ability to offer refunds is limited.</p>
                          <p>By placing an order with ApnaBandhan, you agree to the terms outlined in this policy.</p>
                        </div>

                        <div>
                          <h2 className="flex items-center !mb-4"><Info className="inline-block mr-3 h-6 w-6 text-primary" />Digital Product Nature</h2>
                          <p>All our products, including invitation videos, e-cards, and album designs, are digital services, not physical goods. Once a project is initiated and creative work has begun, costs in terms of time and resources are incurred. Once final files are delivered, they cannot be returned.</p>
                        </div>

                        <div>
                          <h2 className="flex items-center !mb-4"><CircleDollarSign className="inline-block mr-3 h-6 w-6 text-primary" />Advance Payments</h2>
                          <p>To secure your project in our production schedule and to cover the initial costs of design and planning, we require an advance payment before work begins. <strong>This advance payment is strictly non-refundable.</strong></p>
                        </div>
                        
                        <div>
                          <h2 className="flex items-center !mb-4"><Clock className="inline-block mr-3 h-6 w-6 text-primary" />Cancellation Policy</h2>
                          <p>The possibility of cancellation depends on the stage of the project:</p>
                          <ul className="!my-4">
                              <li><strong>Within 2 Hours of Order:</strong> If you choose to cancel your order within 2 hours of making the advance payment AND before any work has commenced or any communication regarding the design has been initiated by our team, you may be eligible for a full refund of the advance amount.</li>
                              <li><strong>After Work Has Begun:</strong> Once our team has started working on your project (e.g., creating initial concepts, processing your files, etc.), the order cannot be cancelled, and the advance payment will be forfeited to compensate for the work already performed.</li>
                          </ul>
                          <p>To request a cancellation, you must contact us immediately via phone or WhatsApp for the quickest response.</p>
                        </div>

                        <div>
                          <h2 className="flex items-center !mb-4"><FileWarning className="inline-block mr-3 h-6 w-6 text-primary" />Refund Policy on Final Product</h2>
                          <p>We do not offer refunds or exchanges once the final, high-resolution, watermark-free digital files have been delivered to you. All sales are considered final upon delivery.</p>
                          <h3 className="prose-h3:!mt-6">Scenarios where refunds are NOT provided:</h3>
                          <ul className="!my-4">
                              <li>Dissatisfaction with a design style, after the design was created based on the chosen template or requirements discussed. We provide proofs for this reason.</li>
                              <li>Typos or errors in the text that were approved by you during the proofing stage.</li>
                              <li>Change of mind or cancellation of the event after the product has been delivered.</li>
                              <li>Minor color variations due to differences in screen calibrations.</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h2 className="flex items-center !mb-4"><CheckCircle className="inline-block mr-3 h-6 w-6 text-primary" />Revisions and Client Satisfaction</h2>
                          <p>Our primary goal is your satisfaction. Each service includes a specific number of revision rounds as detailed on the service page. We encourage you to provide clear, consolidated feedback during these rounds.</p>
                          <ul className="!my-4">
                              <li>We will work closely with you to make reasonable adjustments to ensure you are happy with the final product before delivery.</li>
                              <li>The revision process is your opportunity to request changes. A refund will not be issued because of dissatisfaction if the revision process has been completed and the final proof has been approved.</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h2 className="flex items-center !mb-4"><Info className="inline-block mr-3 h-6 w-6 text-primary" />Exceptional Circumstances</h2>
                          <p>A full refund (including the advance) will only be issued in the rare and exceptional circumstance that ApnaBandhan is unable to deliver the service or complete the project due to unforeseen technical issues or emergencies on our end.</p>
                        </div>

                        <div>
                          <h2 className="flex items-center !mb-4"><FileWarning className="inline-block mr-3 h-6 w-6 text-primary" />How to Address an Issue</h2>
                          <p>If you have a concern about your project, please contact us immediately. We are committed to finding a fair resolution. To discuss an issue, please contact us within 48 hours of receiving your proof or final file.</p>
                        </div>

                        <div>
                          <h2 className="flex items-center !mb-4"><MessageSquare className="inline-block mr-3 h-6 w-6 text-primary" />Contact Us</h2>
                          <p>For any questions about our Refund & Cancellation Policy, please contact us before placing an order:</p>
                          <ul className="!my-4">
                              <li className="flex items-start"><Mail className="inline-block mr-2 h-5 w-5 mt-1 shrink-0 text-accent" /> <span>By email: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></span></li>
                              <li className="flex items-start"><Phone className="inline-block mr-2 h-5 w-5 mt-1 shrink-0 text-accent" /> <span>By phone/WhatsApp: <a href={`https://wa.me/${siteConfig.phone}`}>{siteConfig.phone}</a></span></li>
                          </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
