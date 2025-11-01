import React from "react";
import { useStore } from "../services/store";
import { useEffect } from "react";


export default function PrivacyPolicy() {
  const { setIsSearchDisabled } = useStore();

  useEffect(() => {
    setIsSearchDisabled(true);
    return () => setIsSearchDisabled(false);
  }, [setIsSearchDisabled]);

  return (
    <div className="h-full w-full bg-gradient-to-br from-sky-50 to-blue-100">

    <div className="max-w-4xl mx-auto px-6 py-16 text-slate-800">
      <h1 className="text-4xl font-bold text-sky-600 mb-6">
        Privacy Policy
      </h1>
      <p className="mb-4 text-slate-600">
        Last updated: October 26, 2025
      </p>

      <p className="mb-6">
        Welcome to <span className="font-semibold">StoryMint</span>.  
        Your privacy is very important to us. This Privacy Policy explains how we collect, use, disclose, and protect your information when you visit or use our platform.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-sky-500">
        1. Information We Collect
      </h2>
      <p className="mb-4">
        We collect the following types of information when you use StoryMint:
      </p>
      <ul className="list-disc list-inside mb-6 space-y-2">
        <li>
          <span className="font-semibold">Personal Information:</span> such as your name, email address, and profile picture (if you sign in using Google or other providers).
        </li>
        <li>
          <span className="font-semibold">Usage Data:</span> such as pages you visit, time spent, and interactions with content.
        </li>
        <li>
          <span className="font-semibold">Cookies:</span> small files stored on your device to enhance your browsing experience and remember your preferences.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-sky-500">
        2. How We Use Your Information
      </h2>
      <p className="mb-6">
        We use the collected data to:
      </p>
      <ul className="list-disc list-inside mb-6 space-y-2">
        <li>Provide and improve our services.</li>
        <li>Personalize your StoryMint experience.</li>
        <li>Send updates or notifications about your account or content.</li>
        <li>Ensure security and prevent unauthorized access.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-sky-500">
        3. Data Security
      </h2>
      <p className="mb-6">
        We take appropriate technical and organizational measures to protect your information from unauthorized access, alteration, or disclosure. However, no system is 100% secure, and we cannot guarantee absolute security.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-sky-500">
        4. Sharing of Information
      </h2>
      <p className="mb-6">
        We do not sell or rent your personal data. We may share limited data with:
      </p>
      <ul className="list-disc list-inside mb-6 space-y-2">
        <li>Trusted third-party tools used for analytics or authentication (e.g., Google Firebase).</li>
        <li>Authorities, if required by law or to protect our legal rights.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-sky-500">
        5. Your Rights
      </h2>
      <p className="mb-6">
        You have the right to access, update, or delete your information. You can do this by managing your account settings or contacting us directly.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-sky-500">
        6. Changes to This Policy
      </h2>
      <p className="mb-6">
        We may update this Privacy Policy from time to time. Any updates will be reflected on this page with a revised “Last Updated” date.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-sky-500">
        7. Contact Us
      </h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at{" "}
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
