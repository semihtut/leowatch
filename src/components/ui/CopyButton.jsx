import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyButton({ text, label = '', className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 text-xs transition-all duration-200 ${
        copied
          ? 'text-green-400'
          : 'text-[var(--text-muted)] hover:text-cyan-400'
      } ${className}`}
      title={copied ? 'Copied!' : `Copy ${label}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          {label && <span>{label}</span>}
        </>
      )}
    </button>
  );
}
