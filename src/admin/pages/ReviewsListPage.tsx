import { useQuery, useMutation } from '@tanstack/react-query';
import { ReviewService } from '@/services/review.service';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Rating } from '@/components/common/Rating';
import { Spinner } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Check, X, Star, ArrowLeft } from 'lucide-react';
import { Undo2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const ReviewsListPage = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      const { data, error } = await ReviewService.getAllReviews(true);
      if (error) throw new Error(error);
      return data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await ReviewService.approveReview(id);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      toast.success('Review approved');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const unapproveMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await ReviewService.unapproveReview(id);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      toast.success('Review unapproved');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await ReviewService.deleteReview(id);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      toast.success('Review deleted');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleApprove = (id: string) => {
    approveMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Reviews</h1>
              <p className="text-sm text-gray-600 mt-1">Moderate customer reviews</p>
            </div>
            <Link to="/admin">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!data || data.length === 0 ? (
          <Card className="p-12">
            <EmptyState
              icon={<Star className="w-16 h-16 text-gray-400" />}
              title="No reviews yet"
              description="Customer reviews will appear here"
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {data.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Rating value={review.rating} readonly size="sm" />
                      <Badge variant={review.is_approved ? 'success' : 'warning'}>
                        {review.is_approved ? 'Approved' : 'Pending'}
                      </Badge>
                      {review.is_verified_purchase && (
                        <Badge variant="info">Verified Purchase</Badge>
                      )}
                    </div>

                    {review.title && (
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {review.title}
                      </h3>
                    )}

                    <p className="text-gray-700 mb-3">{review.comment}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>By {review.user?.full_name || 'Anonymous'}</span>
                      <span>•</span>
                      <span>{formatDate(review.created_at)}</span>
                      {review.product && (
                        <>
                          <span>•</span>
                          <span>Product: {review.product.name}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {!review.is_approved ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(review.id)}
                        isLoading={approveMutation.isPending}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => unapproveMutation.mutate(review.id)}
                        isLoading={unapproveMutation.isPending}
                      >
                        <Undo2 className="w-4 h-4 mr-2" />
                        Unapprove
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(review.id)}
                      isLoading={deleteMutation.isPending}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};