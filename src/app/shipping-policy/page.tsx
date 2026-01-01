
import { siteConfig } from "@/lib/constants";
import { Truck, Mail, Phone, File, Clock, CheckCircle, FolderDown, MessageSquare, Info } from "lucide-react";
import Link from "next/link";

export default function ShippingPolicyPage() {
  return (
    <div className="bg-secondary/30">
        <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
            <div className="mx-auto max-w-none rounded-lg bg-card p-8 shadow-lg md:p-12">
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <Truck className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="font-headline text-4xl font-bold text-primary">Shipping & Delivery Policy</h1>
                    <p className="mt-2 text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-CA')}</p>
                </div>

                <div className="prose prose-lg max-w-none prose-headings:font-headline prose-headings:font-bold prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 dark:prose-invert">
                    <div className="space-y-8">
                        <div>
                          <p>This policy outlines how ApnaBandhan handles the delivery of our digital products and services. As we exclusively provide digital goods, no physical items will be shipped. We only provide digital design services and do not deliver any physical products (like printed cards or albums).</p>
                        </div>

                        <div>
                          <h2 className="flex items-center !mb-4"><Info className="inline-block mr-3 h-6 w-6 text-primary" />Nature of Products</h2>
                          <p>All our services, including but not limited to invitation videos, e-cards, album designs, and video editing, result in digital files. These are not physical products and therefore do not require physical shipping.</p>
                        </div>
                        
                        <div>
                          <h2 className="flex items-center !mb-4"><Truck className="inline-block mr-3 h-6 w-6 text-primary" />Delivery Method</h2>
                          <p>All final products will be delivered electronically. The primary methods of delivery are:</p>
                          <ul className="!my-4">
                              <li className="flex items-center"><Mail className="inline-block mr-2 h-5 w-5 shrink-0 text-accent" /> <span><strong>Email:</strong> A secure download link to your final files will be sent to the email address you provided during the order process.</span></li>
                              <li className="flex items-center"><MessageSquare className="inline-block mr-2 h-5 w-5 shrink-0 text-accent" /> <span><strong>WhatsApp:</strong> For your convenience, we can also deliver the final files or download links directly to your WhatsApp number.</span></li>
                              <li className="flex items-center"><FolderDown className="inline-block mr-2 h-5 w-5 shrink-0 text-accent" /> <span><strong>Google Drive/Cloud Storage:</strong> For larger files, such as full-length edited videos, we will provide a secure link to a cloud storage service like Google Drive from which you can download your files.</span></li>
                          </ul>
                        </div>

                        <div>
                          <h2 className="flex items-center !mb-4"><Clock className="inline-block mr-3 h-6 w-6 text-primary" />Delivery Timelines</h2>
                          <p>The estimated delivery timeline for each service is mentioned on its respective product page. Please note that these are estimates and can be affected by several factors:</p>
                          <ul className="!my-4">
                              <li><strong>Project Complexity:</strong> More complex projects may require more time.</li>
                              <li><strong>Revisions:</strong> The timeline is dependent on prompt feedback and the number of revision rounds. Delays in providing feedback will extend the final delivery date.</li>
                              <li><strong>Order Volume:</strong> During peak wedding season, timelines might be slightly extended. We will communicate any potential delays upfront.</li>
                          </ul>
                          <p>The delivery countdown begins once we have received <strong>both</strong> the advance payment and all necessary content (photos, text, etc.) from you.</p>
                        </div>

                        <div>
                          <h2 className="flex items-center !mb-4"><File className="inline-block mr-3 h-6 w-6 text-primary" />File Formats</h2>
                          <p>Final files are delivered in standard, high-quality formats:</p>
                          <ul className="!my-4">
                              <li><strong>Videos:</strong> MP4 format in Full HD (1080p) unless specified otherwise.</li>
                              <li><strong>Images (E-invites):</strong> High-resolution JPEG or PNG.</li>
                              <li><strong>Printable Files:</strong> High-resolution, print-ready PDF.</li>
                              <li><strong>Source Files:</strong> If included in your package (e.g., CDR files), they will be delivered as specified.</li>
                          </ul>
                        </div>

                        <div>
                          <h2 className="flex items-center !mb-4"><CheckCircle className="inline-block mr-3 h-6 w-6 text-primary" />Proofing and Final Delivery</h2>
                          <ul className="!my-4">
                              <li>A low-resolution, watermarked "proof" or "draft" version of your project will be sent to you for review.</li>
                              <li>It is your responsibility to review this proof carefully for any errors in text, dates, or other details.</li>
                              <li>The final, high-resolution, watermark-free files will only be prepared and delivered after we receive your final approval and the remaining balance payment has been cleared.</li>
                          </ul>
                        </div>

                        <div>
                          <h2 className="flex items-center !mb-4"><FolderDown className="inline-block mr-3 h-6 w-6 text-primary" />Storage and Access to Files</h2>
                          <p>We will keep your final files available on our cloud storage for a period of <strong>30 days</strong> after delivery. We highly recommend you download and back up your files immediately upon receipt. After this period, we cannot guarantee that the files will remain accessible.</p>
                        </div>
                        
                        <div>
                          <h2 className="flex items-center !mb-4"><Info className="inline-block mr-3 h-6 w-6 text-primary" />No Shipping Charges</h2>
                          <p>As all our products are digital, there are no shipping fees or delivery charges associated with any of our services.</p>
                        </div>

                        <div>
                          <h2 className="flex items-center !mb-4"><MessageSquare className="inline-block mr-3 h-6 w-6 text-primary" />Contact Us</h2>
                          <p>If you have any questions about our Shipping & Delivery Policy, or if you have not received your files within the expected timeframe, please contact us immediately:</p>
                           <ul className="!my-4">
                              <li className="flex items-center"><Mail className="inline-block mr-2 h-5 w-5 shrink-0 text-accent" /> <span>By email: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></span></li>
                              <li className="flex items-center"><Phone className="inline-block mr-2 h-5 w-5 shrink-0 text-accent" /> <span>By phone/WhatsApp: <a href={`https://wa.me/${siteConfig.phone.replace(/[\s+]/g, '')}`}>{siteConfig.phone}</a></span></li>
                          </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
