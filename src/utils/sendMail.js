import React from "react";
import Link from "next/link"; // or use a div/span

export const SendMail = ({ subject, body, children }) => {
  const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <a
      href={mailto}
      onClick={(e) => {
        window.open(mailto);
        e.preventDefault();
      }}
      className="flex-1 inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-md text-center py-3"
    >
      {children}
    </a>
  );
};