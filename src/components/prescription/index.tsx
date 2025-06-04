"use client";
import { Calendar, ChevronDownIcon, Clock, FileText, Phone, Pill, UserIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import ComponentCard from '../common/ComponentCard';
import Button from '../ui/button/Button';
import Select from '../form/Select';
import DatePicker from '../form/date-picker';

interface PrescriptionFormData {
  patientPhone: string;
  doctorId: string;
  genericMedicationName: string;
  brandMedicationName: string;
  instructions: string;
  dosageAmount: string;
  dosageUnit: string;
  frequency: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  refillDate: string;
}

interface FrequencyOption {
  value: string;
  label: string;
  timesPerDay: number;
  intervalHour: number;
}

export default function CreatePrescriptionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Get patient phone from URL params and doctor ID from session
  const patientPhoneFromUrl = searchParams.get('patientPhone') || '';
  // You'll need to replace this with your actual session management
  // const { data: session } = useSession(); // if using NextAuth
  // const doctorIdFromSession = session?.user?.doctorId || '';
  const doctorIdFromSession = 'DR001234'; // Replace with actual session data
  
  const [formData, setFormData] = useState<PrescriptionFormData>({
    patientPhone: patientPhoneFromUrl,
    doctorId: doctorIdFromSession,
    genericMedicationName: '',
    brandMedicationName: '',
    instructions: '',
    dosageAmount: '',
    dosageUnit: '',
    frequency: '',
    startDate: '',
    endDate: '',
    isActive: true,
    refillDate: ''
  });

  const [currentStep, setCurrentStep] = useState(1);

  // Update form data when URL params or session changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      patientPhone: patientPhoneFromUrl,
      doctorId: doctorIdFromSession
    }));
  }, [patientPhoneFromUrl, doctorIdFromSession]);

  const frequencyOptions: FrequencyOption[] = [
    { value: "once daily", label: "Once daily", timesPerDay: 1, intervalHour: 24 },
    { value: "twice daily", label: "Twice daily", timesPerDay: 2, intervalHour: 12 },
    { value: "three times daily", label: "Three times daily", timesPerDay: 3, intervalHour: 8 },
    { value: "every 8 hours", label: "Every 8 hours", timesPerDay: 3, intervalHour: 8 },
    { value: "every 6 hours", label: "Every 6 hours", timesPerDay: 4, intervalHour: 6 },
    { value: "every 4 hours", label: "Every 4 hours", timesPerDay: 6, intervalHour: 4 },
  ];

  const dosageUnitOptions = [
    { value: "mg", label: "mg (milligrams)" },
    { value: "g", label: "g (grams)" },
    { value: "ml", label: "ml (milliliters)" },
    { value: "mcg", label: "mcg (micrograms)" },
    { value: "units", label: "units" },
    { value: "tablets", label: "tablets" },
    { value: "capsules", label: "capsules" },
    { value: "drops", label: "drops" },
    { value: "tsp", label: "tsp (teaspoons)" },
    { value: "tbsp", label: "tbsp (tablespoons)" },
  ];

  const handleInputChange = (field: keyof PrescriptionFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectChange = (field: keyof PrescriptionFormData) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Prescription Data:', formData);
    // Handle form submission here
    // After successful submission, you might want to redirect
    // router.push('/prescriptions'); // or wherever you want to go
  };

  const isStep1Valid = formData.genericMedicationName && formData.dosageAmount && formData.dosageUnit && formData.frequency;
  const isStep2Valid = formData.startDate && formData.endDate;

  const totalSteps = 2;

  // Calculate suggested end date based on frequency and common treatment duration
  const getSuggestedEndDate = () => {
    if (formData.startDate && formData.frequency) {
      const start = new Date(formData.startDate);
      const suggested = new Date(start);
      
      // Default to 7-30 days based on frequency
      const daysToAdd = formData.frequency.includes('daily') ? 14 : 7;
      suggested.setDate(start.getDate() + daysToAdd);
      
      return suggested.toISOString().split('T')[0];
    }
    return '';
  };

  const getCurrentFrequencyInfo = () => {
    const freq = frequencyOptions.find(f => f.value === formData.frequency);
    return freq ? `${freq.timesPerDay} times per day (every ${freq.intervalHour} hours)` : '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Patient Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <Pill className="w-5 h-5 text-white" />
            </div>
            Create New Prescription
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        {/* Patient & Doctor Info Display */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Patient: {formData.patientPhone || 'Not specified'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Doctor ID: {formData.doctorId}
              </span>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center space-x-4">
          {[1, 2].map((step) => (
            <React.Fragment key={step}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step <= currentStep 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                {step}
              </div>
              {step < totalSteps && (
                <div className={`flex-1 h-1 rounded-full transition-colors ${
                  step < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Medication Details</span>
          <span>Treatment Schedule</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Medication Information */}
        {currentStep === 1 && (
          <ComponentCard title="💊 Medication Details">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="genericMedicationName">Generic Medication Name *</Label>
                  <div className="relative">
                    <Input
                      id="genericMedicationName"
                      type="text"
                      placeholder="e.g., Ibuprofen"
                      defaultValue={formData.genericMedicationName}
                      onChange={(e) => handleInputChange('genericMedicationName', e.target.value)}
                      className="pl-10"
                    />
                    <Pill className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="brandMedicationName">Brand Name (Optional)</Label>
                  <Input
                    id="brandMedicationName"
                    type="text"
                    placeholder="e.g., Advil, Motrin"
                    defaultValue={formData.brandMedicationName}
                    onChange={(e) => handleInputChange('brandMedicationName', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="dosageAmount">Dosage Amount *</Label>
                  <Input
                    id="dosageAmount"
                    type="number"
                    placeholder="e.g., 200"
                    defaultValue={formData.dosageAmount}
                    onChange={(e) => handleInputChange('dosageAmount', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="dosageUnit">Unit *</Label>
                  <div className="relative">
                    <Select
                      options={dosageUnitOptions}
                      placeholder="Select unit"
                      onChange={handleSelectChange('dosageUnit')}
                      className="dark:bg-dark-900"
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="frequency">Frequency *</Label>
                  <div className="relative">
                    <Select
                      options={frequencyOptions.map(f => ({ value: f.value, label: f.label }))}
                      placeholder="Select frequency"
                      onChange={handleSelectChange('frequency')}
                      className="dark:bg-dark-900"
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                      <Clock />
                    </span>
                  </div>
                  {formData.frequency && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {getCurrentFrequencyInfo()}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="instructions">Special Instructions</Label>
                <div className="relative">
                  <textarea
                    id="instructions"
                    rows={4}
                    placeholder="e.g., Take with food, avoid alcohol, complete full course even if symptoms improve"
                    value={formData.instructions}
                    onChange={(e) => handleInputChange('instructions', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
                  />
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {formData.dosageAmount && formData.dosageUnit && formData.frequency && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 text-green-500 mt-0.5">✅</div>
                    <div>
                      <h4 className="font-medium text-green-900 dark:text-green-100">Prescription Summary</h4>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        <strong>{formData.genericMedicationName}</strong> {formData.dosageAmount}{formData.dosageUnit} - {formData.frequency}
                        {formData.brandMedicationName && ` (Brand: ${formData.brandMedicationName})`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ComponentCard>
        )}

        {/* Step 2: Schedule Information */}
        {currentStep === 2 && (
          <ComponentCard title="📅 Treatment Schedule">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="relative">
                  <DatePicker
                id="startDate"
                label="Start Date *"
                placeholder="Select start date"
                defaultDate={formData.startDate}
                onChange={([selectedDate]) =>
                    handleInputChange('startDate', selectedDate?.toISOString().split('T')[0] || '')
      }/>
                  </div>
                </div>

                <div>
                  <div className="relative">
                  <DatePicker
      id="endDate"
      label="End Date *"
      placeholder="Select end date"
      defaultDate={formData.endDate || getSuggestedEndDate()}
      onChange={([selectedDate]) =>
        handleInputChange('endDate', selectedDate?.toISOString().split('T')[0] || '')
      }
    />
                  </div>
                  {formData.startDate && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => handleInputChange('endDate', getSuggestedEndDate())}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Use suggested: {getSuggestedEndDate()}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="relative">
                <DatePicker
                id="refillDate"
                label="Next Refill Date (Optional)"
                placeholder="Select refill Date"
                defaultDate={formData.refillDate}
                onChange={([selectedDate]) =>
                    handleInputChange('refillDate', selectedDate?.toISOString().split('T')[0] || '')
                }
                />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  When the patient should return for a refill (if applicable)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <Label htmlFor="isActive" className="!mb-0">
                  Prescription is active
                </Label>
              </div>

              {formData.startDate && formData.endDate && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 text-amber-500 mt-0.5">⏰</div>
                    <div>
                      <h4 className="font-medium text-amber-900 dark:text-amber-100">Treatment Duration</h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                        Treatment period: {Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                        {formData.frequency && (
                          <span className="block mt-1">
                            Total doses: {Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) * (frequencyOptions.find(f => f.value === formData.frequency)?.timesPerDay || 1)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ComponentCard>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            ← Previous
          </Button>

          <div className="flex gap-3">
            {currentStep < totalSteps ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!isStep1Valid}
                className="flex items-center gap-2"
              >
                Next →
              </Button>
            ) : (
              <Button
                
                disabled={!isStep2Valid}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              >
                💊 Create Prescription
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}