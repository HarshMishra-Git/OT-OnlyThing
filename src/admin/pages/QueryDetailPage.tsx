import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { QueryService } from '@/services/query.service';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Textarea } from '@/components/common/Textarea';
import { Select } from '@/components/common/Select';
import { Spinner } from '@/components/common/Spinner';
import { ArrowLeft, User, Mail, Phone, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { QUERY_STATUS_LABELS, QUERY_PRIORITY_LABELS } from '@/lib/constants';
import toast from 'react-hot-toast';

export const QueryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [response, setResponse] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newPriority, setNewPriority] = useState('');

  const { data: query, isLoading, refetch } = useQuery({
    queryKey: ['admin-query', id],
    queryFn: async () => {
      if (!id) throw new Error('Query ID required');
      const { data, error } = await QueryService.getQueryById(id);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!id,
  });

  const respondMutation = useMutation({
    mutationFn: async (responseText: string) => {
      if (!id) throw new Error('Query ID required');
      const { error } = await QueryService.respondToQuery(id, responseText);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      toast.success('Response sent successfully');
      setResponse('');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      if (!id) throw new Error('Query ID required');
      const { error } = await QueryService.updateQueryStatus(id, status);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      toast.success('Status updated');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updatePriorityMutation = useMutation({
    mutationFn: async (priority: string) => {
      if (!id) throw new Error('Query ID required');
      const { error} = await QueryService.updateQueryPriority(id, priority);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      toast.success('Priority updated');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleSendResponse = () => {
    if (!response.trim()) {
      toast.error('Please enter a response');
      return;
    }
    respondMutation.mutate(response);
  };

  const handleUpdateStatus = () => {
    if (!newStatus) return;
    updateStatusMutation.mutate(newStatus);
  };

  const handleUpdatePriority = () => {
    if (!newPriority) return;
    updatePriorityMutation.mutate(newPriority);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!query) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Query not found</p>
          <Button onClick={() => navigate('/admin/queries')} className="mt-4">
            Back to Queries
          </Button>
        </div>
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
              <h1 className="text-2xl font-bold text-gray-900">{query.subject}</h1>
              <p className="text-sm text-gray-600 mt-1">
                Submitted on {formatDate(query.created_at)}
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/admin/queries')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Queries
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Query Message */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Message</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{query.message}</p>
            </Card>

            {/* Admin Response */}
            {query.admin_response ? (
              <Card className="p-6 bg-blue-50 border-blue-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Response</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{query.admin_response}</p>
                {query.responded_at && (
                  <p className="text-sm text-gray-500 mt-4">
                    Responded on {formatDate(query.responded_at)}
                  </p>
                )}
              </Card>
            ) : (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Send Response</h2>
                <Textarea
                  rows={6}
                  placeholder="Type your response here..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                />
                <Button
                  onClick={handleSendResponse}
                  disabled={!response.trim() || respondMutation.isPending}
                  isLoading={respondMutation.isPending}
                  className="mt-4"
                >
                  Send Response
                </Button>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Info</h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-sm font-medium text-gray-900">{query.name}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{query.email}</p>
                  </div>
                </div>
                {query.phone && (
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{query.phone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Submitted</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(query.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Status Management */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Status
                  </label>
                  <Badge variant="primary" className="text-base px-3 py-1">
                    {QUERY_STATUS_LABELS[query.status]}
                  </Badge>
                </div>
                <div>
                  <Select
                    label="Update Status"
                    options={[
                      { value: '', label: 'Select new status' },
                      ...Object.entries(QUERY_STATUS_LABELS).map(([value, label]) => ({
                        value,
                        label,
                      })),
                    ]}
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  />
                  <Button
                    onClick={handleUpdateStatus}
                    disabled={!newStatus || updateStatusMutation.isPending}
                    isLoading={updateStatusMutation.isPending}
                    className="w-full mt-2"
                    size="sm"
                  >
                    Update Status
                  </Button>
                </div>
              </div>
            </Card>

            {/* Priority Management */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Priority</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Priority
                  </label>
                  <Badge variant="warning" className="text-base px-3 py-1">
                    {QUERY_PRIORITY_LABELS[query.priority]}
                  </Badge>
                </div>
                <div>
                  <Select
                    label="Update Priority"
                    options={[
                      { value: '', label: 'Select new priority' },
                      ...Object.entries(QUERY_PRIORITY_LABELS).map(([value, label]) => ({
                        value,
                        label,
                      })),
                    ]}
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                  />
                  <Button
                    onClick={handleUpdatePriority}
                    disabled={!newPriority || updatePriorityMutation.isPending}
                    isLoading={updatePriorityMutation.isPending}
                    className="w-full mt-2"
                    size="sm"
                  >
                    Update Priority
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};