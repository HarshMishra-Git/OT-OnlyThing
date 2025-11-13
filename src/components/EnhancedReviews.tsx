import { useState } from 'react';
import { Star, ThumbsUp, BadgeCheck, Filter, Image } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
  helpful_count?: number;
  is_verified?: boolean;
  photos?: string[];
}

interface EnhancedReviewsProps {
  reviews: Review[];
  averageRating: number;
  productId: string;
}

export function EnhancedReviews({ reviews, averageRating, productId }: EnhancedReviewsProps) {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showPhotosOnly, setShowPhotosOnly] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    stars: star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: reviews.length > 0 ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  const filteredReviews = reviews.filter((review) => {
    if (filterRating && review.rating !== filterRating) return false;
    if (showPhotosOnly && (!review.photos || review.photos.length === 0)) return false;
    return true;
  });

  const handleHelpful = (reviewId: string) => {
    setHelpfulReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="text-center lg:text-left">
            <div className="text-6xl font-black mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex items-center justify-center lg:justify-start gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  fill={i < Math.round(averageRating) ? 'black' : 'none'}
                  stroke="black"
                  strokeWidth={2}
                />
              ))}
            </div>
            <p className="text-gray-600 font-bold">
              Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ stars, count, percentage }) => (
              <button
                key={stars}
                onClick={() => setFilterRating(filterRating === stars ? null : stars)}
                className={`w-full flex items-center gap-3 group hover:bg-white transition-colors p-2 rounded-lg ${
                  filterRating === stars ? 'bg-white' : ''
                }`}
              >
                <span className="text-sm font-bold whitespace-nowrap">{stars} ★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black transition-all duration-300 group-hover:bg-gray-800"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-600 w-8 text-right">{count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter size={18} />
          <span className="text-sm font-bold">Filters:</span>
        </div>
        
        <button
          onClick={() => setShowPhotosOnly(!showPhotosOnly)}
          className={`px-4 py-2 text-sm font-bold rounded-full border-2 transition-all duration-300 flex items-center gap-2 ${
            showPhotosOnly
              ? 'bg-black text-white border-black'
              : 'border-gray-200 hover:border-black'
          }`}
        >
          <Image size={16} />
          With Photos ({reviews.filter((r) => r.photos && r.photos.length > 0).length})
        </button>

        {filterRating && (
          <button
            onClick={() => setFilterRating(null)}
            className="px-4 py-2 text-sm font-bold rounded-full bg-black text-white flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            {filterRating} Stars
            <span className="text-lg">×</span>
          </button>
        )}

        {(filterRating || showPhotosOnly) && (
          <button
            onClick={() => {
              setFilterRating(null);
              setShowPhotosOnly(false);
            }}
            className="text-sm font-bold text-gray-600 hover:text-black underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="border-2 border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-colors"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                      {review.profiles?.full_name?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{review.profiles?.full_name || 'Anonymous'}</span>
                        {review.is_verified && (
                          <div className="flex items-center gap-1 text-xs text-green-600 font-bold">
                            <BadgeCheck size={16} />
                            Verified
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < review.rating ? 'black' : 'none'}
                        stroke="black"
                        strokeWidth={2}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Content */}
              {review.title && <h4 className="font-bold text-lg mb-2">{review.title}</h4>}
              <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

              {/* Review Photos */}
              {review.photos && review.photos.length > 0 && (
                <div className="flex gap-2 mb-4 overflow-x-auto">
                  {review.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 shrink-0"
                    >
                      <img src={photo} alt={`Review ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Helpful Button */}
              <button
                onClick={() => handleHelpful(review.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  helpfulReviews.has(review.id)
                    ? 'bg-black text-white'
                    : 'border-2 border-gray-200 hover:border-black'
                }`}
              >
                <ThumbsUp
                  size={16}
                  fill={helpfulReviews.has(review.id) ? 'currentColor' : 'none'}
                />
                Helpful ({(review.helpful_count || 0) + (helpfulReviews.has(review.id) ? 1 : 0)})
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="font-bold mb-2">No reviews match your filters</p>
            <button
              onClick={() => {
                setFilterRating(null);
                setShowPhotosOnly(false);
              }}
              className="text-black underline font-bold"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
