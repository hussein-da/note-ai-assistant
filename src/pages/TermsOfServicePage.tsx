
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const TermsOfServicePage = () => {
  return (
    <main className="flex-1 container max-w-4xl mx-auto py-10 px-4">
      <Link to="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Button>
      </Link>
      
      <div className="prose max-w-none">
        <h1>Terms of Service</h1>
        <p>Last updated: April 13, 2025</p>
        
        <h2>1. Introduction</h2>
        <p>Welcome to MeetingBuddy ("we," "our," or "us"). By using our service, you agree to these Terms of Service ("Terms"). Please read them carefully.</p>
        
        <h2>2. Using Our Services</h2>
        <p>You must follow any policies made available to you within the Services. You may use our Services only as permitted by law. We may suspend or stop providing our Services to you if you do not comply with our terms or policies or if we are investigating suspected misconduct.</p>
        
        <h2>3. Your MeetingBuddy Account</h2>
        <p>You need a MeetingBuddy account to use our services. You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account.</p>
        
        <h2>4. Privacy and Copyright Protection</h2>
        <p>Our privacy policy explains how we treat your personal data and protect your privacy when you use our Services. By using our Services, you agree that MeetingBuddy can use such data in accordance with our privacy policies.</p>
        
        <h2>5. Your Content in Our Services</h2>
        <p>Our Services allow you to upload, submit, store, send, and receive content. You retain ownership of any intellectual property rights that you hold in that content.</p>
        
        <p>When you upload, submit, store, send, or receive content to or through our Services, you give MeetingBuddy a worldwide license to use, host, store, reproduce, modify, create derivative works, communicate, publish, publicly perform, publicly display, and distribute such content.</p>
        
        <h2>6. Modifying and Terminating our Services</h2>
        <p>We are constantly changing and improving our Services. We may add or remove functionalities or features, and we may suspend or stop a Service altogether.</p>
        
        <h2>7. Our Warranties and Disclaimers</h2>
        <p>We provide our Services using reasonable skill and care. But there are certain things that we don't promise about our Services.</p>
        
        <p>OTHER THAN AS EXPRESSLY SET OUT IN THESE TERMS, NEITHER MEETINGBUDDY NOR ITS SUPPLIERS OR DISTRIBUTORS MAKE ANY SPECIFIC PROMISES ABOUT THE SERVICES. FOR EXAMPLE, WE DON'T MAKE ANY COMMITMENTS ABOUT THE CONTENT WITHIN THE SERVICES, THE SPECIFIC FUNCTIONS OF THE SERVICES, OR THEIR RELIABILITY, AVAILABILITY, OR ABILITY TO MEET YOUR NEEDS. WE PROVIDE THE SERVICES "AS IS".</p>
        
        <h2>8. Liability for our Services</h2>
        <p>WHEN PERMITTED BY LAW, MEETINGBUDDY, AND MEETINGBUDDY'S SUPPLIERS AND DISTRIBUTORS, WILL NOT BE RESPONSIBLE FOR LOST PROFITS, REVENUES, OR DATA, FINANCIAL LOSSES OR INDIRECT, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES.</p>
        
        <h2>9. Business Uses of our Services</h2>
        <p>If you are using our Services on behalf of a business, that business accepts these terms. It will hold harmless and indemnify MeetingBuddy and its affiliates, officers, agents, and employees from any claim, suit or action arising from or related to the use of the Services or violation of these terms, including any liability or expense arising from claims, losses, damages, suits, judgments, litigation costs and attorneys' fees.</p>
        
        <h2>10. About these Terms</h2>
        <p>We may modify these terms or any additional terms that apply to a Service to, for example, reflect changes to the law or changes to our Services. You should look at the terms regularly. We'll post notice of modifications to these terms on this page. Changes will not apply retroactively and will become effective no sooner than fourteen days after they are posted. However, changes addressing new functions for a Service or changes made for legal reasons will be effective immediately.</p>
      </div>
    </main>
  );
};

export default TermsOfServicePage;
