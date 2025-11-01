import React from "react";
import { useStore } from "../services/store";
import { useEffect } from "react";



export default function TermsAndConditions() {

  const { setIsSearchDisabled } = useStore();

  useEffect(() => {
    setIsSearchDisabled(true);
    return () => setIsSearchDisabled(false);
  }, [setIsSearchDisabled]);

  return (
    <div className="h-full w-full bg-gradient-to-br from-sky-50 to-blue-100">
    <div className="max-w-4xl mx-auto px-6 py-16 text-slate-800 ">
      <h1 className="text-4xl font-bold text-sky-600 mb-6">
        Terms and Conditions
      </h1>
      <p className="mb-4 text-slate-600">
        Last updated: October 26, 2025
      </p>

      <p className="mb-6">
        Welcome to <span className="font-semibold">StoryMint</span>.  
        By accessing or using our platform, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-sky-500">
        1. Use of Our Platform
      </h2>
      <p className="mb-6">
        You agree to use StoryMint only for lawful purposes and in accordance with these Terms. You must not use the platform in any way that could harm others, disrupt services, or violate any applicable laws.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-sky-500">
        2. User Accounts
      </h2>
      <p className="mb-6">
        When you create an account using Google or another provider, you are responsible for maintaining the confidentiality of your credentials. You agree to notify us immediately of any unauthorized use of your account.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-sky-500">
        3. Content Ownership
      </h2>
      <p className="mb-6">
        All content you create or publish on StoryMint remains your property.  
        However, by posting on StoryMint, you grant us a non-exclusive, royalty-free license to display and distribute your content on our platform.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-sky-500">
        4. Prohibited Activities
      </h2>
      <ul className="list-disc list-inside mb-6 space-y-2">
        <li>Posting or promoting hateful, abusive, or illegal content.</li>
        <li>Attempting to access others’ accounts or data.</li>
        <li>Using StoryMint for spam or commercial solicitation.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-sky-500">
        5. Limitation of Liability
      </h2>
      <p className="mb-6">
        StoryMint and its team shall not be held liable for any direct, indirect, or incidental damages resulting from your use of our platform or any content posted by users.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-sky-500">
        6. Termination
      </h2>
      <p className="mb-6">
        We reserve the right to suspend or terminate your access to StoryMint at any time if you violate these Terms or engage in harmful behavior.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-sky-500">
        7. Changes to These Terms
      </h2>
      <p className="mb-6">
        We may update these Terms from time to time. Continued use of the platform after updates means you accept the revised Terms.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-sky-500">
        8. Contact Us
      </h2>
      <p>
        For questions about these Terms, please contact us at{" "}
        <a
          href="mailto:connectdocsmedia@gmail.com"
          className="text-sky-600 underline hover:text-sky-800"
        >
          connectdocsmedia@gmail.com
        </a>.
      </p>
    </div>
    </div>
  );
}
