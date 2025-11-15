import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './Button';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  productId: string;
  onSuccess: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          rating,
          title,
          comment,
        });

      if (reviewError) throw reviewError;

      setRating(0);
      setTitle('');
      setComment('');
      onSuccess();
    } catch (err: any) {
      if (err.code === '23505') {
        setError('You have already reviewed this product');
      } else {
        setError(err.message || 'Failed to submit review');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-2 border-black p-8 space-y-6">
      <h3 className="text-2xl font-black">WRITE A REVIEW</h3>

      {error && (
        <div className="p-4 bg-gray-100 border-2 border-gray-300">
          <p className="text-sm text-gray-700">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-bold mb-3">Your Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={32}
                fill={star <= (hoverRating || rating) ? 'black' : 'none'}
                stroke="black"
                strokeWidth={2}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">Review Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black focus:outline-none"
          placeholder="Sum up your experience"
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">Your Review</label>
        <textarea
          required
          rows={5}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black focus:outline-none"
          placeholder="Share your experience with this product"
        />
      </div>

      <Button type="submit" disabled={loading || rating === 0}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}
