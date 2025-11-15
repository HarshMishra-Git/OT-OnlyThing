import { Facebook, Twitter, Linkedin, Share2, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ShareButtonsProps {
  url: string;
  title?: string;
  compact?: boolean;
}

export function ShareButtons({ url, title, compact = false }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title || '');

  const links = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const size = compact ? 'w-8 h-8' : 'w-10 h-10';

  return (
    <div className="flex items-center gap-2">
      <a
        href={links.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center border rounded-full ${size} border-gray-300 text-gray-700 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors`}
        aria-label="Share on Facebook"
      >
        <Facebook className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
      </a>
      <a
        href={links.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center border rounded-full ${size} border-gray-300 text-gray-700 hover:bg-black hover:border-black hover:text-white transition-colors`}
        aria-label="Share on Twitter"
      >
        <Twitter className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
      </a>
      <a
        href={links.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center border rounded-full ${size} border-gray-300 text-gray-700 hover:bg-green-600 hover:border-green-600 hover:text-white transition-colors`}
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
      </a>
      <a
        href={links.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center border rounded-full ${size} border-gray-300 text-gray-700 hover:bg-blue-700 hover:border-blue-700 hover:text-white transition-colors`}
        aria-label="Share on LinkedIn"
      >
        <Linkedin className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
      </a>
      <button
        type="button"
        onClick={copyLink}
        className={`inline-flex items-center justify-center border rounded-full ${size} border-gray-300 text-gray-700 hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-colors`}
        aria-label="Copy Link"
      >
        {copied ? <Share2 className={compact ? 'w-4 h-4' : 'w-5 h-5'} /> : <LinkIcon className={compact ? 'w-4 h-4' : 'w-5 h-5'} />}
      </button>
    </div>
  );
}