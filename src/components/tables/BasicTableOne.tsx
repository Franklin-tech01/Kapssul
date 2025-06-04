"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal/index";

interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
}

interface Prescription {
  id: string;
  patient_phone: string;
  doctor_id: string;
  generic_medication_name: string;
  brand_medication_name: string;
  instructions: string;
  dosage_amount: string;
  dosage_unit: string;
  frequency: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  refill_date: string;
}

interface Patient {
  id: string;
  name: string;
  phone: string;
  language: string;
  last_checkin: string | null;
  location: Location;
  allergies: string[];
  medications: string[];
  conditions: string[];
  family_history: string[];
  medical_history: string[];
  prescriptions: Prescription[];
}

const getLanguageName = (code: string): string => {
  const languages: { [key: string]: string } = {
    en: "English",
    ha: "Hausa",
    ig: "Igbo",
    yo: "Yoruba",
  };
  return languages[code] || code;
};

const formatLastCheckIn = (dateString: string | null): string => {
  if (!dateString) return "Never";

  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Today";
  if (diffDays === 2) return "Yesterday";
  if (diffDays <= 7) return `${diffDays - 1} days ago`;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusBadge = (lastCheckIn: string | null, conditions: string[]) => {
  const hasConditions = conditions.length > 0;
  const recentCheckIn =
    lastCheckIn && new Date(lastCheckIn) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  if (!lastCheckIn) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
        New
      </span>
    );
  }

  if (hasConditions && !recentCheckIn) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
        Needs Follow-up
      </span>
    );
  }

  if (recentCheckIn) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
      Inactive
    </span>
  );
};

export default function PatientTable() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("https://51fc-102-90-115-22.ngrok-free.app/api/v1/patient", {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        
        // Handle both array and object responses
        const patientsData = Array.isArray(response.data) ? response.data : Object.values(response.data);
        setPatients(patientsData);
      } catch (err) {
        setError("Failed to fetch patients");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter patients based on search term and language
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm);
    const matchesLanguage =
      languageFilter === "all" || patient.language === languageFilter;

    return matchesSearch && matchesLanguage;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading patients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-lg">{error}</div>
        <Button onClick={() => window.location.reload()} className="ml-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Language Filter */}
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Languages</option>
            <option value="en">English</option>
            <option value="ha">Hausa</option>
            <option value="ig">Igbo</option>
            <option value="yo">Yoruba</option>
          </select>
        </div>

        <Link href="/patient">
          <Button size="sm" className="w-full sm:w-auto">
            ➕ Create Patient
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {patients.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total Patients
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">
            {
              patients.filter(
                (p) =>
                  p.last_checkin &&
                  new Date(p.last_checkin) >
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              ).length
            }
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Active This Week
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-yellow-600">
            {patients.filter((p) => p.conditions.length > 0).length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            With Conditions
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-red-600">
            {patients.filter((p) => !p.last_checkin).length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Never Checked In
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] shadow-sm">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1200px]">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                  <TableCell className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                    Patient
                  </TableCell>
                  <TableCell className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                    Contact & Language
                  </TableCell>
                  <TableCell className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                    Location
                  </TableCell>
                  <TableCell className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                    Health Status
                  </TableCell>
                  <TableCell className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                    Last Check-in
                  </TableCell>
                  <TableCell className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow
                    key={patient.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    {/* Patient Info */}
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {patient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {patient.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {patient.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Contact & Language */}
                    <TableCell className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {patient.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                            />
                          </svg>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {getLanguageName(patient.language)}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Location */}
                    <TableCell className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {patient.location.city}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {patient.location.state}
                        </div>
                      </div>
                    </TableCell>

                    {/* Health Status */}
                    <TableCell className="px-6 py-4">
                      <div className="space-y-2">
                        {getStatusBadge(
                          patient.last_checkin,
                          patient.conditions
                        )}
                        <div className="flex flex-wrap gap-1">
                          {patient.conditions.length > 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                              {patient.conditions.length} condition
                              {patient.conditions.length !== 1 ? "s" : ""}
                            </span>
                          )}
                          {patient.allergies.length > 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                              {patient.allergies.length} allerg
                              {patient.allergies.length !== 1 ? "ies" : "y"}
                            </span>
                          )}
                          {patient.medications.length > 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                              {patient.medications.length} med
                              {patient.medications.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Last Check-in */}
                    <TableCell className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatLastCheckIn(patient.last_checkin)}
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewingPatient(patient)}
                          className="text-xs"
                        >
                          👁️ View
                        </Button>
                        <Link href={`/patients/edit/${patient.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            ✏️ Edit
                          </Button>
                        </Link>
                        <Link
                          href={`/prescription?patientPhone=${patient.phone}`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            💊 Add Prescription
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No patients found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Enhanced Modal */}
      {viewingPatient && (
        <Modal
          isOpen={!!viewingPatient}
          onClose={() => setViewingPatient(null)}
          className="max-w-4xl mx-4"
        >
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {viewingPatient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {viewingPatient.name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Patient ID: {viewingPatient.id}
                </p>
              </div>
              {getStatusBadge(
                viewingPatient.last_checkin,
                viewingPatient.conditions
              )}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="text-gray-900 dark:text-white">
                      {viewingPatient.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      />
                    </svg>
                    <span className="text-gray-900 dark:text-white">
                      {getLanguageName(viewingPatient.language)}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-gray-400 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      <div className="text-gray-900 dark:text-white">
                        {viewingPatient.location.address}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {viewingPatient.location.city},{" "}
                        {viewingPatient.location.state}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Overview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  Health Overview
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last Check-in:
                    </span>
                    <div className="text-gray-900 dark:text-white">
                      {formatLastCheckIn(viewingPatient.last_checkin)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Conditions & Allergies */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Current Conditions
                  </h4>
                  <div className="space-y-1">
                    {viewingPatient.conditions.length > 0 ? (
                      viewingPatient.conditions.map((condition, index) => (
                        <span
                          key={index}
                          className="inline-block bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 rounded text-xs mr-1 mb-1"
                        >
                          {condition}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        No current conditions
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Allergies
                  </h4>
                  <div className="space-y-1">
                    {viewingPatient.allergies.length > 0 ? (
                      viewingPatient.allergies.map((allergy, index) => (
                        <span
                          key={index}
                          className="inline-block bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 px-2 py-1 rounded text-xs mr-1 mb-1"
                        >
                          {allergy}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        No known allergies
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Medications & History */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Current Medications
                  </h4>
                  <div className="space-y-1">
                    {viewingPatient.medications.length > 0 ? (
                      viewingPatient.medications.map((medication, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 px-2 py-1 rounded text-xs mr-1 mb-1"
                        >
                          {medication}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        No current medications
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Family History
                  </h4>
                  <div className="space-y-1">
                    {viewingPatient.family_history.length > 0 ? (
                      viewingPatient.family_history.map((history, index) => (
                        <span
                          key={index}
                          className="inline-block bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 px-2 py-1 rounded text-xs mr-1 mb-1"
                        >
                          {history}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        No family history recorded
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Medical History */}
            {viewingPatient.medical_history.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Medical History
                </h4>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-1">
                  {viewingPatient.medical_history.map((history, index) => (
                    <div key={index} className="text-sm text-gray-700 dark:text-gray-300">
                      {history}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prescriptions Section */}
            {viewingPatient.prescriptions.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Active Prescriptions
                </h4>
                <div className="space-y-3">
                  {viewingPatient.prescriptions
                    .filter((prescription) => prescription.is_active)
                    .map((prescription) => (
                      <div
                        key={prescription.id}
                        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {prescription.brand_medication_name}
                            </h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {prescription.generic_medication_name}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              prescription.is_active
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {prescription.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Dosage:</span>{" "}
                            {prescription.dosage_amount} {prescription.dosage_unit}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Frequency:</span>{" "}
                            {prescription.frequency}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Instructions:</span>{" "}
                            {prescription.instructions}
                          </p>
                          <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <p>
                              <span className="font-medium">Start:</span>{" "}
                              {new Date(prescription.start_date).toLocaleDateString()}
                            </p>
                            <p>
                              <span className="font-medium">End:</span>{" "}
                              {new Date(prescription.end_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => setViewingPatient(null)}
              >
                Close
              </Button>
              <Link href={`/patients/edit/${viewingPatient.id}`}>
                <Button>Edit Patient</Button>
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}