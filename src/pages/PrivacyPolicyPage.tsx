
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicyPage = () => {
  return (
    <main className="flex-1 container max-w-4xl mx-auto py-10 px-4">
      <Link to="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Button>
      </Link>
      
      <div className="prose max-w-none">
        <h1>Privacy Policy</h1>
        <p>Last updated: April 13, 2025</p>
        
        <h2>1. Introduction</h2>
        <p>At MeetingBuddy, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.</p>
        
        <h2>2. Information We Collect</h2>
        <p>We collect information that you provide directly to us:</p>
        <ul>
          <li><strong>Personal Data:</strong> First name, last name, email address, and other information you provide when registering an account.</li>
          <li><strong>Meeting Recordings:</strong> Audio files that you upload to our service.</li>
          <li><strong>Transcriptions:</strong> Text versions of your meeting recordings.</li>
          <li><strong>Meeting Summaries:</strong> AI-generated summaries of your meetings.</li>
          <li><strong>Action Items:</strong> Tasks and to-dos extracted from your meetings.</li>
        </ul>
        
        <h2>3. How We Use Your Information</h2>
        <p>We use the information we collect for various purposes, including to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process and complete transactions</li>
          <li>Send you technical notices, updates, security alerts, and support and administrative messages</li>
          <li>Respond to your comments, questions, and requests</li>
          <li>Develop new products and services</li>
        </ul>
        
        <h2>4. Sharing of Information</h2>
        <p>We do not share, sell, or transfer your personal information except in the following limited circumstances:</p>
        <ul>
          <li><strong>With Your Consent:</strong> We will share your personal information when you direct us to do so.</li>
          <li><strong>For Legal Reasons:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
          <li><strong>Service Providers:</strong> We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us.</li>
        </ul>
        
        <h2>5. Data Storage and Security</h2>
        <p>We use reasonable physical, technical, and administrative safeguards to protect your personal information against loss, theft, and unauthorized access, use, or disclosure. All information you provide to us is stored on secure servers.</p>
        
        <h2>6. Your Rights Regarding Your Data</h2>
        <p>You have certain rights regarding your personal information, including:</p>
        <ul>
          <li>The right to access the personal information we hold about you</li>
          <li>The right to request correction of inaccurate personal information</li>
          <li>The right to request deletion of your personal information</li>
          <li>The right to object to processing of your personal information</li>
        </ul>
        
        <h2>7. Children's Privacy</h2>
        <p>Our Service is not directed to children under 16, and we do not knowingly collect personal information from children under 16. If we learn we have collected or received personal information from a child under 16, we will delete that information.</p>
        
        <h2>8. Changes to This Privacy Policy</h2>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.</p>
        
        <h2>9. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <p>Email: privacy@meetingbuddy.com</p>
      </div>
    </main>
  );
};

export default PrivacyPolicyPage;
