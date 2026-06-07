import React, { useEffect } from 'react';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    document.title = "Privacy Policy - EduFlow AI";
  }, []);

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-100">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-10 tracking-tight">
          Privacy Policy
        </h1>
        
        <div className="space-y-8 text-lg text-gray-600 leading-relaxed">
          <p>
            We respect your privacy. This application collects and processes user messages solely to provide automated responses and improve user experience.
          </p>

          <p>
            We do not sell, share, or misuse any personal data. All information is securely stored and used only for communication purposes between users and the respective business.
          </p>

          <p className="font-medium text-gray-800">
            By using this service, you consent to the collection and use of information as described in this policy.
          </p>

          <div className="mt-16 pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              For any questions, contact: <span className="text-indigo-600 font-semibold">[your email]</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
