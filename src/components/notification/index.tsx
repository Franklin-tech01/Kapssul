"use client";
import React, { useState } from 'react';
import { Bell, AlertTriangle, User, Clock, Filter, Search, Eye, CheckCircle, XCircle } from 'lucide-react';

// TypeScript interfaces
interface Alert {
  id: number;
  patientName: string;
  patientId: string;
  reason: string;
  timestamp: Date;
  severity: 'high' | 'medium' | 'low';
  status: 'unread' | 'read' | 'acknowledged';
  type: 'adverse_effect';
}

type AlertStatus = 'all' | 'unread' | 'read' | 'acknowledged';
type SeverityLevel = 'high' | 'medium' | 'low';

// Mock data - replace with your actual API calls
const mockAlerts: Alert[] = [
  {
    id: 1,
    patientName: "John Smith",
    patientId: "P001",
    reason: "Severe headache and dizziness after taking prescribed medication",
    timestamp: new Date('2024-06-04T10:30:00'),
    severity: "high",
    status: "unread",
    type: "adverse_effect"
  },
  {
    id: 2,
    patientName: "Maria Garcia",
    patientId: "P002", 
    reason: "Nausea and vomiting 2 hours after medication intake",
    timestamp: new Date('2024-06-04T09:15:00'),
    severity: "medium",
    status: "read",
    type: "adverse_effect"
  },
  {
    id: 3,
    patientName: "David Johnson",
    patientId: "P003",
    reason: "Skin rash and itching on arms and chest",
    timestamp: new Date('2024-06-04T08:45:00'),
    severity: "medium",
    status: "unread",
    type: "adverse_effect"
  },
  {
    id: 4,
    patientName: "Sarah Williams",
    patientId: "P004",
    reason: "Rapid heartbeat and chest tightness",
    timestamp: new Date('2024-06-04T07:22:00'),
    severity: "high",
    status: "acknowledged",
    type: "adverse_effect"
  },
  {
    id: 5,
    patientName: "Michael Brown",
    patientId: "P005",
    reason: "Stomach pain and loss of appetite",
    timestamp: new Date('2024-06-03T16:30:00'),
    severity: "low",
    status: "read",
    type: "adverse_effect"
  }
];

const DoctorAlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<AlertStatus>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const getSeverityColor = (severity: SeverityLevel): string => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: Alert['status']): string => {
    switch (status) {
      case 'unread': return 'bg-red-50 border-l-red-500';
      case 'read': return 'bg-gray-50 border-l-gray-400';
      case 'acknowledged': return 'bg-green-50 border-l-green-500';
      default: return 'bg-gray-50 border-l-gray-400';
    }
  };

  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  const filteredAlerts = alerts.filter((alert: Alert) => {
    const matchesFilter = filter === 'all' || alert.status === filter;
    const matchesSearch = alert.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = alerts.filter((alert: Alert) => alert.status === 'unread').length;

  const markAsRead = (alertId: number): void => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'read' } : alert
    ));
  };

  const markAsAcknowledged = (alertId: number): void => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'acknowledged' } : alert
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients or symptoms..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter(e.target.value as AlertStatus)}
                >
                  <option value="all">All Alerts</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="acknowledged">Acknowledged</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Alerts</p>
                <p className="text-2xl font-semibold text-gray-900">{alerts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Unread</p>
                <p className="text-2xl font-semibold text-red-600">{unreadCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Read</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {alerts.filter((a: Alert) => a.status === 'read').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Acknowledged</p>
                <p className="text-2xl font-semibold text-green-600">
                  {alerts.filter((a: Alert) => a.status === 'acknowledged').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Alerts ({filteredAlerts.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No alerts found matching your criteria.</p>
              </div>
            ) : (
              filteredAlerts.map((alert: Alert) => (
                <div
                  key={alert.id}
                  className={`p-6 border-l-4 ${getStatusColor(alert.status)} hover:bg-gray-50 cursor-pointer transition-colors`}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-600" />
                          <span className="font-semibold text-gray-900">{alert.patientName}</span>
                          <span className="text-sm text-gray-500">({alert.patientId})</span>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-3 line-clamp-2">{alert.reason}</p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTimestamp(alert.timestamp)}</span>
                        </div>
                        <span className="capitalize">{alert.status.replace('_', ' ')}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {alert.status === 'unread' && (
                        <button
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            markAsRead(alert.id);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Mark as Read
                        </button>
                      )}
                      {alert.status !== 'acknowledged' && (
                        <button
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            markAsAcknowledged(alert.id);
                          }}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Acknowledge
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Alert Details</h3>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                <p className="text-gray-900">{selectedAlert.patientName} ({selectedAlert.patientId})</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(selectedAlert.severity)}`}>
                  {selectedAlert.severity.toUpperCase()}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reported Issue</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedAlert.reason}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timestamp</label>
                <p className="text-gray-900">{selectedAlert.timestamp.toLocaleString()}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <p className="text-gray-900 capitalize">{selectedAlert.status.replace('_', ' ')}</p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              {selectedAlert.status !== 'acknowledged' && (
                <button
                  onClick={() => {
                    markAsAcknowledged(selectedAlert.id);
                    setSelectedAlert(null);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Acknowledge Alert
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAlertsPage;