"use client";
import React, { useState } from 'react';
import ComponentCard from '../../common/ComponentCard';
import Label from '../Label';
import Input from '../input/InputField';
import Select from '../Select';
import { ChevronDownIcon, UserIcon, Phone, Location, Heart } from '../../../icons';
import Button from '../../ui/button/Button';
import axios from 'axios';

interface PatientFormData {
  name: string;
  phone: string;
  language: string;
  address: string;
  city: string;
  state: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  familyHistory: string[];
  medicalHistory: string[];
}

export default function CreatePatientForm() {
  const [formData, setFormData] = useState<PatientFormData>({
    name: '',
    phone: '',
    language: '',
    address: '',
    city: '',
    state: '',
    allergies: [],
    medications: [],
    conditions: [],
    familyHistory: [],
    medicalHistory: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [allergyInput, setAllergyInput] = useState('');
  const [medicationInput, setMedicationInput] = useState('');
  const [conditionInput, setConditionInput] = useState('');
  const [familyHistoryInput, setFamilyHistoryInput] = useState('');
  const [medicalHistoryInput, setMedicalHistoryInput] = useState('');

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "ha", label: "Hausa" },
    { value: "ig", label: "Igbo" },
    { value: "yo", label: "Yoruba" },
  ];

  const nigerianStates = [
    { value: "rivers", label: "Rivers State" },
    { value: "lagos", label: "Lagos State" },
    { value: "abuja", label: "FCT - Abuja" },
    { value: "kano", label: "Kano State" },
    { value: "kaduna", label: "Kaduna State" },
    { value: "oyo", label: "Oyo State" },
    { value: "delta", label: "Delta State" },
    { value: "edo", label: "Edo State" },
    { value: "anambra", label: "Anambra State" },
    { value: "imo", label: "Imo State" },
  ];

  const handleInputChange = (field: keyof PatientFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectChange = (field: keyof PatientFormData) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addItem = (field: keyof PatientFormData, value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()]
      }));
      setter('');
    }
  };

  const removeItem = (field: keyof PatientFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://51fc-102-90-115-22.ngrok-free.app/api/v1/patient', formData);
      console.log('Patient created successfully:', response.data);
      // Optionally, reset form or route to another page here
      // e.g., router.push('/patients') if you use next/router
    } catch (error: any) {
      console.error('Error creating patient:', error.response?.data || error.message);
      // Show error notification to user if you have UI for that
    }
  };

  const isStep1Valid = formData.name && formData.phone && formData.language;
  const isStep2Valid = formData.address && formData.city && formData.state;

  const totalSteps = 3;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
            Create New Patient
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step <= currentStep 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                {step}
              </div>
              {step < totalSteps && (
                <div className={`flex-1 h-1 rounded-full transition-colors ${
                  step < currentStep ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Basic Info</span>
          <span>Location</span>
          <span>Medical Info</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <ComponentCard title="👤 Basic Information">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <div className="relative">
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter patient's full name"
                      defaultValue={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10"
                    />
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="08123456789"
                      defaultValue={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pl-10"
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="language">Preferred Language *</Label>
                <div className="relative">
                  <Select
                    options={languageOptions}
                    placeholder="Select preferred language"
                    onChange={handleSelectChange('language')}
                    className="dark:bg-dark-900"
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-blue-500 mt-0.5">ℹ️</div>
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Getting Started</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      We'll collect basic information first, then location details, and finally any medical information you'd like to add.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ComponentCard>
        )}

        {/* Step 2: Location Information */}
        {currentStep === 2 && (
          <ComponentCard title="📍 Location Information">
            <div className="space-y-6">
              <div>
                <Label htmlFor="address">Street Address *</Label>
                <div className="relative">
                  <Input
                    id="address"
                    type="text"
                    placeholder="Enter street address"
                    defaultValue={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="pl-10"
                  />
                  <Location className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="e.g., Port Harcourt"
                    defaultValue={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="state">State *</Label>
                  <div className="relative">
                    <Select
                      options={nigerianStates}
                      placeholder="Select state"
                      onChange={handleSelectChange('state')}
                      className="dark:bg-dark-900"
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-green-500 mt-0.5">📍</div>
                  <div>
                    <h4 className="font-medium text-green-900 dark:text-green-100">Location Privacy</h4>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Location information helps us provide better localized care and emergency services when needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ComponentCard>
        )}

        {/* Step 3: Medical Information */}
        {currentStep === 3 && (
          <ComponentCard title="🏥 Medical Information">
            <div className="space-y-8">
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-amber-500 mt-0.5">⚕️</div>
                  <div>
                    <h4 className="font-medium text-amber-900 dark:text-amber-100">Optional Medical Information</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      This information is optional but helps provide better care. You can always add or update this later.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Allergies */}
                <div>
                  <Label htmlFor="allergies">Allergies</Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        id="allergies"
                        type="text"
                        placeholder="e.g., Penicillin, Peanuts"
                        defaultValue={allergyInput}
                        onChange={(e) => {
                          setAllergyInput(e.target.value);
                          if (e.nativeEvent instanceof KeyboardEvent && e.nativeEvent.key === 'Enter') {
                            e.preventDefault();
                            addItem('allergies', e.target.value, setAllergyInput);
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addItem('allergies', allergyInput, setAllergyInput)}
                        className="whitespace-nowrap"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.allergies.map((allergy, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 rounded-full text-sm"
                        >
                          {allergy}
                          <button
                            type="button"
                            onClick={() => removeItem('allergies', index)}
                            className="ml-1 hover:bg-red-200 dark:hover:bg-red-800 rounded-full p-0.5"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Current Medications */}
                <div>
                  <Label htmlFor="medications">Current Medications</Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        id="medications"
                        type="text"
                        placeholder="e.g., Lisinopril, Metformin"
                        defaultValue={medicationInput}
                        onChange={(e) => {
                          setMedicationInput(e.target.value);
                          if (e.nativeEvent instanceof KeyboardEvent && e.nativeEvent.key === 'Enter') {
                            e.preventDefault();
                            addItem('medications', e.target.value, setMedicationInput);
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addItem('medications', medicationInput, setMedicationInput)}
                        className="whitespace-nowrap"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.medications.map((medication, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 px-2 py-1 rounded-full text-sm"
                        >
                          {medication}
                          <button
                            type="button"
                            onClick={() => removeItem('medications', index)}
                            className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Medical Conditions */}
                <div>
                  <Label htmlFor="conditions">Current Medical Conditions</Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        id="conditions"
                        type="text"
                        placeholder="e.g., Hypertension, Diabetes"
                        defaultValue={conditionInput}
                        onChange={(e) => {
                          setConditionInput(e.target.value);
                          if (e.nativeEvent instanceof KeyboardEvent && e.nativeEvent.key === 'Enter') {
                            e.preventDefault();
                            addItem('conditions', e.target.value, setConditionInput);
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addItem('conditions', conditionInput, setConditionInput)}
                        className="whitespace-nowrap"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.conditions.map((condition, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 px-2 py-1 rounded-full text-sm"
                        >
                          {condition}
                          <button
                            type="button"
                            onClick={() => removeItem('conditions', index)}
                            className="ml-1 hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full p-0.5"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Family History */}
                <div>
                  <Label htmlFor="familyHistory">Family Medical History</Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        id="familyHistory"
                        type="text"
                        placeholder="e.g., Heart Disease, Cancer"
                        defaultValue={familyHistoryInput}
                        onChange={(e) => {
                          setFamilyHistoryInput(e.target.value);
                          if (e.nativeEvent instanceof KeyboardEvent && e.nativeEvent.key === 'Enter') {
                            e.preventDefault();
                            addItem('familyHistory', e.target.value, setFamilyHistoryInput);
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addItem('familyHistory', familyHistoryInput, setFamilyHistoryInput)}
                        className="whitespace-nowrap"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.familyHistory.map((history, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 px-2 py-1 rounded-full text-sm"
                        >
                          {history}
                          <button
                            type="button"
                            onClick={() => removeItem('familyHistory', index)}
                            className="ml-1 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div>
                <Label htmlFor="medicalHistory">Past Medical History</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      id="medicalHistory"
                      type="text"
                      placeholder="e.g., Surgery 2020, Broken bone 2018"
                      defaultValue={medicalHistoryInput}
                      onChange={(e) => {
                        setMedicalHistoryInput(e.target.value);
                        if (e.nativeEvent instanceof KeyboardEvent && e.nativeEvent.key === 'Enter') {
                          e.preventDefault();
                          addItem('medicalHistory', e.target.value, setMedicalHistoryInput);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addItem('medicalHistory', medicalHistoryInput, setMedicalHistoryInput)}
                      className="whitespace-nowrap"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.medicalHistory.map((history, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded-full text-sm"
                      >
                        {history}
                        <button
                          type="button"
                          onClick={() => removeItem('medicalHistory', index)}
                          className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
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
                disabled={
                  (currentStep === 1 && !isStep1Valid) ||
                  (currentStep === 2 && !isStep2Valid)
                }
                className="flex items-center gap-2"
              >
                Next →
              </Button>
            ) : (
              <Button
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                ✅ Create Patient
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}