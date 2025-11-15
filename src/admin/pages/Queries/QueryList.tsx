import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, MessageSquare, Clock, CheckCircle, 
  XCircle, AlertCircle, Mail, Phone, Calendar 
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { QueryService } from '@/services/query.service';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Spinner } from '@/components/common/Spinner';
import { Badge } from '@/components/common/Badge';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface Query {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
  admin_response?: string;
  responded_at?: string;
}

const statusConfig = {
  open: { color: 'blue', icon: MessageSquare, label: 'Open' },
  in_progress: { color: 'yellow', icon: Clock, label: 'In Progress' },
  resolved: { color: 'green', icon: CheckCircle, label: 'Resolved' },
  closed: { color: 'gray', icon: XCircle, label: 'Closed' },
};

const priorityConfig = {
  low: { color: 'gray', label: 'Low' },
  medium: { color: 'blue', label: 'Medium' },
  high: { color: 'orange', label: 'High' },
  urgent: { color: 'red', label: 'Urgent' },
};

export function QueryList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const { data: queriesData, isLoading, refetch } = useQuery({
    queryKey: ['admin-queries'],
    queryFn: async () => {
      const { data, error } = await QueryService.getAllQueries();
      if (error) throw new Error(error);
      return data as any as Query[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ queryId, status }: { queryId: string; status: string }) => {
      const { error } = await QueryService.updateQueryStatus(queryId, status);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      toast.success('Status updated successfully');
      refetch();
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  const filteredQueries = useMemo(() => {
    const queries = queriesData || [];
    const matchesSearch = (q: Query) =>
      q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = (q: Query) => filterStatus === 'all' || q.status === filterStatus;
    const matchesPriority = (q: Query) => filterPriority === 'all' || q.priority === filterPriority;
    
    return queries.filter((q) => matchesSearch(q) && matchesStatus(q) && matchesPriority(q));
  }, [queriesData, searchTerm, filterStatus, filterPriority]);

  const stats = {
    total: queriesData?.length || 0,
    open: queriesData?.filter(q => q.status === 'open').length || 0,
    in_progress: queriesData?.filter(q => q.status === 'in_progress').length || 0,
    resolved: queriesData?.filter(q => q.status === 'resolved').length || 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Queries</h1>
          <p className="text-gray-600 mt-1">Manage customer support requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Queries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MessageSquare className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open</p>
              <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.in_progress}</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search queries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Queries List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredQueries.map((query) => {
            const StatusIcon = statusConfig[query.status].icon;
            const statusColor = statusConfig[query.status].color;
            const priorityColor = priorityConfig[query.priority].color;

            return (
              <Link
                key={query.id}
                to={`/admin/queries/${query.id}`}
                className="block hover:bg-gray-50 transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {query.subject}
                        </h3>
                        <Badge color={priorityColor}>
                          {priorityConfig[query.priority].label}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          <span>{query.email}</span>
                        </div>
                        {query.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <span>{query.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(query.created_at), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 line-clamp-2 mb-3">
                        {query.message}
                      </p>

                      {query.admin_response && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-sm text-green-800 font-medium mb-1">
                            Admin Response:
                          </p>
                          <p className="text-sm text-green-700 line-clamp-2">
                            {query.admin_response}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <select
                        value={query.status}
                        onChange={(e) => {
                          e.preventDefault();
                          updateStatusMutation.mutate({ queryId: query.id, status: e.target.value });
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className={`px-3 py-1 rounded-full text-sm font-medium border-2 cursor-pointer
                          ${statusColor === 'blue' ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}
                          ${statusColor === 'yellow' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : ''}
                          ${statusColor === 'green' ? 'bg-green-50 border-green-200 text-green-700' : ''}
                          ${statusColor === 'gray' ? 'bg-gray-50 border-gray-200 text-gray-700' : ''}
                        `}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>

                      <span className="text-xs text-gray-500">
                        Updated {format(new Date(query.updated_at), 'MMM dd, HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredQueries.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No queries found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your filters'
                : 'No customer queries yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}