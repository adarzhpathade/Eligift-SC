"use client";

import { useState, useActionState } from "react";
import { completeProfile, type ProfileActionResult } from "@/actions/profile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { STATE_DISTRICTS_MAP } from "@/constants/locations";

const initialState: ProfileActionResult = {};

const TOTAL_STEPS = 4;

const STEP_INFO = [
  { label: "Identity", title: "Establish Identity", description: "Please provide your basic information to begin the verification process." },
  { label: "Personalize", title: "Personalize Your Experience", description: "Tell us a bit about yourself so we can tailor the platform to your needs." },
  { label: "Professional", title: "Professional Details", description: "Tell us about your current occupation and financial standing." },
  { label: "Declaration", title: "SC Category Declaration", description: "Confirm your eligibility for SC concessional credit schemes." },
];

function StepHeader({ currentStep, title, description }: { currentStep: number, title: string, description: string }) {
  const steps = STEP_INFO.map((s, i) => i + 1);

  return (
    <div className="w-full sticky top-16 z-50">
      <div className="absolute w-[100vw] left-1/2 -translate-x-1/2 -top-[200vh] bottom-[-32px] bg-[var(--color-eg-background)] backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black_85%,transparent)] pointer-events-none -z-10" />

      <div className="bg-[var(--color-eg-surface)]/95 rounded-2xl shadow-[var(--shadow-eg-md)] border border-[var(--color-eg-border)] p-6 sm:p-8 flex flex-col md:flex-row justify-between md:items-center gap-6 relative">
        <div className="md:w-2/5">
          <h2 className="text-2xl font-bold text-[var(--color-eg-text-primary)] mb-1.5">{title}</h2>
          <p className="text-sm text-[var(--color-eg-text-secondary)]">{description}</p>
        </div>
        <div className="md:w-3/5 relative w-full">
          <div className="flex items-center justify-between relative z-10 pt-4">
            {steps.map((s, i) => (
              <div key={s} className="contents">
                {/* Step circle */}
                <div className="flex flex-col items-center gap-2 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-sm relative z-10 transition-all duration-500 ${
                    currentStep === s
                      ? "bg-[var(--color-eg-text-primary)] border-2 border-[var(--color-eg-text-primary)] font-bold text-[var(--color-eg-text-inverse)] ring-4 ring-[var(--color-eg-text-primary)]/20"
                      : currentStep > s
                      ? "bg-[var(--color-eg-text-primary)] text-[var(--color-eg-text-inverse)]"
                      : "bg-[var(--color-eg-surface)] border-2 border-[var(--color-eg-border-strong)] font-semibold text-[var(--color-eg-text-secondary)]"
                  }`}>
                    {currentStep > s ? <span className="material-symbols-outlined text-[14px]">check</span> : s}
                  </div>
                  <span className={`text-[10px] font-bold absolute -top-4 whitespace-nowrap transition-colors duration-500 ${currentStep >= s ? "text-[var(--color-eg-text-primary)]" : "text-[var(--color-eg-text-muted)]"}`}>
                    {STEP_INFO[i].label}
                  </span>
                </div>
                {/* Connecting line (not after last step) */}
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-[2px] mx-1.5 relative z-0 transition-colors duration-500 ${
                    currentStep > s ? "bg-[var(--color-eg-text-primary)]" : "bg-[var(--color-eg-border-strong)]"
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [state, formAction, isPending] = useActionState(completeProfile, initialState);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [localError, setLocalError] = useState("");

  // Step 1: Identity
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");

  // Step 2: Personalize
  const [language, setLanguage] = useState("english");
  const [gender, setGender] = useState("prefer-not");

  // Step 3: Professional
  const [selectedEducation, setSelectedEducation] = useState("");
  const [selectedOccupation, setSelectedOccupation] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("Full-Time");
  const [salary, setSalary] = useState("500000");

  // Step 4: Declaration
  const [scDeclaration, setScDeclaration] = useState(false);

  const STATE_OPTIONS: Record<string, string> = {
    "andhra_pradesh": "Andhra Pradesh", "arunachal_pradesh": "Arunachal Pradesh", "assam": "Assam", "bihar": "Bihar",
    "chhattisgarh": "Chhattisgarh", "goa": "Goa", "gujarat": "Gujarat", "haryana": "Haryana",
    "himachal_pradesh": "Himachal Pradesh", "jharkhand": "Jharkhand", "karnataka": "Karnataka", "kerala": "Kerala",
    "madhya_pradesh": "Madhya Pradesh", "maharashtra": "Maharashtra", "manipur": "Manipur", "meghalaya": "Meghalaya",
    "mizoram": "Mizoram", "nagaland": "Nagaland", "odisha": "Odisha", "punjab": "Punjab", "rajasthan": "Rajasthan",
    "sikkim": "Sikkim", "tamil_nadu": "Tamil Nadu", "telangana": "Telangana", "tripura": "Tripura",
    "uttar_pradesh": "Uttar Pradesh", "uttarakhand": "Uttarakhand", "west_bengal": "West Bengal",
    "andaman_and_nicobar_islands": "Andaman and Nicobar Islands", "chandigarh": "Chandigarh", "dadra_and_nagar_haveli_and_daman_and_diu": "Dadra and Nagar Haveli and Daman and Diu",
    "delhi": "Delhi", "jammu_and_kashmir": "Jammu and Kashmir", "ladakh": "Ladakh", "lakshadweep": "Lakshadweep", "puducherry": "Puducherry"
  };

  const availableDistricts = selectedState ? (STATE_DISTRICTS_MAP[selectedState] || []) : [];

  const OCCUPATION_OPTIONS: Record<string, string> = {
    "tech": "Technology & Software", "healthcare": "Healthcare & Medical",
    "education": "Education & Research", "finance": "Finance & Accounting",
    "government": "Public Sector & Government", "farmer": "Farmer / Agriculture",
    "doctor": "Doctor", "student": "Student", "other": "Other / Independent"
  };

  const nextStep = () => {
    setLocalError("");
    setAttemptedSubmit(true);

    if (step === 1) {
      if (!fullName || !age || !selectedState || !district || !address) {
        setLocalError("Please fill out all required fields.");
        return;
      }
    }

    if (step === 3) {
      if (!selectedEducation || (employmentStatus !== "Unemployed" && !selectedOccupation)) {
        setLocalError("Please fill out all required fields.");
        return;
      }
    }

    if (step === 4) {
      if (!scDeclaration) {
        setLocalError("SC declaration is required to proceed.");
        return;
      }
    }

    if (step < TOTAL_STEPS) {
      setAttemptedSubmit(false);
      setDirection(1);
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setAttemptedSubmit(false);
      setDirection(-1);
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const { title, description } = STEP_INFO[step - 1];

  const slideVariants: Variants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" }
    })
  };

  return (
    <div className="min-h-screen font-sans text-[var(--color-eg-text-primary)] antialiased flex flex-col items-center justify-start pt-16 pb-8 px-4 md:px-8 w-full max-w-[1200px] mx-auto">
      <main className="w-full max-w-4xl relative z-10 flex flex-col items-center">
        {/* Error message */}
        {(state.error || localError) && (
          <div className="w-full mb-4 p-3 rounded-xl bg-[var(--color-eg-error-light)] text-[var(--color-eg-error)] text-sm font-medium shadow-[var(--shadow-eg-sm)]">
            {state.error || localError}
          </div>
        )}

        <form id="onboarding-form" action={formAction} data-attempted={attemptedSubmit} className="w-full flex flex-col gap-4 relative group/form">

          {/* Hidden fields for form submission — these are the ONLY named inputs.
              Visible inputs in each step drive React state only (no name attr). */}
          <input type="hidden" name="fullName" value={fullName} />
          <input type="hidden" name="age" value={age} />
          <input type="hidden" name="district" value={district} />
          <input type="hidden" name="address" value={address} />
          <input type="hidden" name="salary" value={salary} />
          <input type="hidden" name="category" value="sc" />
          <input type="hidden" name="language" value={language} />
          <input type="hidden" name="gender" value={gender} />
          <input type="hidden" name="status" value={employmentStatus} />
          <input type="hidden" name="scDeclaration" value={scDeclaration ? "true" : "false"} />
          <input type="hidden" name="state" value={selectedState} />
          <input type="hidden" name="education" value={selectedEducation} />
          <input type="hidden" name="occupation" value={employmentStatus === "Unemployed" ? "Unemployed" : selectedOccupation} />

          <StepHeader currentStep={step} title={title} description={description} />

          <AnimatePresence mode="wait" custom={direction}>

            {/* ===== STEP 1: IDENTITY ===== */}
            {step === 1 && (
              <motion.div key="step1" custom={direction} variants={slideVariants} initial="initial" animate="animate" exit="exit"
                className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">

                {/* Full Name */}
                <div className="col-span-1 md:col-span-4 bg-[var(--color-eg-surface)] rounded-2xl shadow-[var(--shadow-eg-sm)] border border-[var(--color-eg-border)] p-5 sm:p-6 flex flex-col justify-center transition-all hover:shadow-[var(--shadow-eg-md)]">
                  <label htmlFor="fullName" className="block text-sm font-semibold mb-1.5">Full Legal Name</label>
                  <input id="fullName" type="text" placeholder="e.g., Ramesh Kumar"
                    value={fullName} onChange={(e) => setFullName(e.target.value)}
                    className={`w-full h-12 px-4 bg-[var(--color-eg-surface)] border border-[var(--color-eg-border-strong)] rounded-xl text-sm placeholder:text-[var(--color-eg-text-disabled)] focus:outline-none focus:ring-2 focus:ring-[var(--color-eg-border-focus)] transition-all ${attemptedSubmit && !fullName ? "border-[var(--color-eg-error)] ring-1 ring-[var(--color-eg-error)]" : ""}`} />
                </div>

                {/* Age */}
                <div className="col-span-1 md:col-span-2 bg-[var(--color-eg-surface)] rounded-2xl shadow-[var(--shadow-eg-sm)] border border-[var(--color-eg-border)] p-5 sm:p-6 flex flex-col justify-center transition-all hover:shadow-[var(--shadow-eg-md)]">
                  <label htmlFor="age" className="block text-sm font-semibold mb-1.5">Age</label>
                  <input id="age" type="number" min="0" max="120" placeholder="YY"
                    value={age} onChange={(e) => setAge(e.target.value)}
                    className={`w-full h-12 px-4 bg-[var(--color-eg-surface)] border border-[var(--color-eg-border-strong)] rounded-xl text-sm placeholder:text-[var(--color-eg-text-disabled)] focus:outline-none focus:ring-2 focus:ring-[var(--color-eg-border-focus)] transition-all ${attemptedSubmit && !age ? "border-[var(--color-eg-error)] ring-1 ring-[var(--color-eg-error)]" : ""}`} />
                </div>

                {/* State */}
                <div className="col-span-1 md:col-span-2 bg-[var(--color-eg-surface)] rounded-2xl shadow-[var(--shadow-eg-sm)] border border-[var(--color-eg-border)] p-5 sm:p-6 flex flex-col justify-center transition-all hover:shadow-[var(--shadow-eg-md)]">
                  <label htmlFor="state" className="block text-sm font-semibold mb-1.5">State of Residence</label>
                  <Select required value={selectedState} onValueChange={(val) => { setSelectedState(val || ""); setDistrict(""); }}>
                    <SelectTrigger className={`w-full h-12 px-4 bg-[var(--color-eg-surface)] border border-[var(--color-eg-border-strong)] rounded-xl text-sm focus:ring-[var(--color-eg-border-focus)] transition-all ${attemptedSubmit && !selectedState ? "border-[var(--color-eg-error)] ring-1 ring-[var(--color-eg-error)]" : ""}`}>
                      <SelectValue placeholder="Select a state/UT...">
                        {selectedState ? STATE_OPTIONS[selectedState] || selectedState : null}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATE_OPTIONS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* District */}
                <div className="col-span-1 md:col-span-2 bg-[var(--color-eg-surface)] rounded-2xl shadow-[var(--shadow-eg-sm)] border border-[var(--color-eg-border)] p-5 sm:p-6 flex flex-col justify-center transition-all hover:shadow-[var(--shadow-eg-md)]">
                  <label htmlFor="district" className="block text-sm font-semibold mb-1.5">District</label>
                  <Select required value={district} onValueChange={(val) => setDistrict(val || "")} disabled={!selectedState || availableDistricts.length === 0}>
                    <SelectTrigger className={`w-full h-12 px-4 bg-[var(--color-eg-surface)] border border-[var(--color-eg-border-strong)] rounded-xl text-sm focus:ring-[var(--color-eg-border-focus)] transition-all ${attemptedSubmit && !district ? "border-[var(--color-eg-error)] ring-1 ring-[var(--color-eg-error)]" : ""}`}>
                      <SelectValue placeholder={!selectedState ? "Select State first" : "Select District"}>
                        {district ? district : null}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {availableDistricts.map((d: string) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Address */}
                <div className="col-span-1 md:col-span-4 bg-[var(--color-eg-surface)] rounded-2xl shadow-[var(--shadow-eg-sm)] border border-[var(--color-eg-border)] p-5 sm:p-6 flex flex-col justify-center transition-all hover:shadow-[var(--shadow-eg-md)]">
                  <label htmlFor="address" className="block text-sm font-semibold mb-1.5">Full Address</label>
                  <input id="address" type="text" placeholder="e.g., 123 Main St, Appt 4B"
                    value={address} onChange={(e) => setAddress(e.target.value)}
                    className={`w-full h-12 px-4 bg-[var(--color-eg-surface)] border border-[var(--color-eg-border-strong)] rounded-xl text-sm placeholder:text-[var(--color-eg-text-disabled)] focus:outline-none focus:ring-2 focus:ring-[var(--color-eg-border-focus)] transition-all ${attemptedSubmit && !address ? "border-[var(--color-eg-error)] ring-1 ring-[var(--color-eg-error)]" : ""}`} />
                </div>
              </motion.div>
            )}

            {/* ===== STEP 2: PERSONALIZE ===== */}
            {step === 2 && (
              <motion.div key="step2" custom={direction} variants={slideVariants} initial="initial" animate="animate" exit="exit"
                className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">

                {/* Language */}
                <div className="col-span-1 md:col-span-2 bg-[var(--color-eg-surface)] rounded-2xl shadow-[var(--shadow-eg-sm)] border border-[var(--color-eg-border)] p-5 sm:p-6 flex flex-col justify-start">
                  <legend className="text-lg font-semibold mb-4">Preferred Language</legend>
                  <div className="flex flex-col gap-3">
                    {[
                      { val: "english", label: "English", icon: "language" },
                      { val: "hindi", label: "Hindi", icon: "translate" },
                    ].map(lang => (
                      <label key={lang.val} className="cursor-pointer relative group">
                        <input type="radio" name="language_radio" value={lang.val} checked={language === lang.val} onChange={() => setLanguage(lang.val)} className="peer sr-only" />
                        <div className="bg-[var(--color-eg-background)] rounded-xl p-3 flex items-center gap-3 border border-[var(--color-eg-border-strong)] transition-all peer-checked:bg-[var(--color-eg-text-primary)] peer-checked:text-[var(--color-eg-text-inverse)] peer-checked:border-[var(--color-eg-text-primary)] peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 hover:shadow-[var(--shadow-eg-sm)]">
                          <span className="material-symbols-outlined text-[20px]">{lang.icon}</span>
                          <span className="text-sm font-medium">{lang.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div className="col-span-1 md:col-span-2 bg-[var(--color-eg-surface)] rounded-2xl shadow-[var(--shadow-eg-sm)] border border-[var(--color-eg-border)] p-5 sm:p-6 flex flex-col justify-start">
                  <legend className="text-lg font-semibold mb-1">Gender Identity</legend>
                  <p className="text-[11px] text-[var(--color-eg-text-secondary)] font-medium mb-4">This helps us recommend gender-specific schemes (e.g., Mahila Samriddhi Yojana).</p>
                  <div className="flex flex-col gap-3">
                    {[
                      { val: "female", label: "Female" },
                      { val: "male", label: "Male" },
                      { val: "non-binary", label: "Non-binary" },
                      { val: "prefer-not", label: "Prefer not to say" },
                    ].map(g => (
                      <label key={g.val} className="cursor-pointer relative group">
                        <input type="radio" name="gender_radio" value={g.val} checked={gender === g.val} onChange={() => setGender(g.val)} className="peer sr-only" />
                        <div className="bg-[var(--color-eg-background)] rounded-xl p-3 flex items-center gap-3 border border-[var(--color-eg-border-strong)] transition-all peer-checked:bg-[var(--color-eg-text-primary)] peer-checked:text-[var(--color-eg-text-inverse)] peer-checked:border-[var(--color-eg-text-primary)] peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 hover:shadow-[var(--shadow-eg-sm)]">
                          <span className="text-sm font-medium">{g.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ===== STEP 3: PROFESSIONAL ===== */}
            {step === 3 && (
              <motion.div key="step3" custom={direction} variants={slideVariants} initial="initial" animate="animate" exit="exit"
                className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">

                {/* Employment Status */}
                <div className="col-span-1 md:col-span-4 bg-[var(--color-eg-surface)] rounded-2xl shadow-[var(--shadow-eg-sm)] border border-[var(--color-eg-border)] p-5 sm:p-6 flex flex-col justify-center transition-all hover:shadow-[var(--shadow-eg-md)]">
                  <label className="block text-sm font-semibold mb-3">Employment Status</label>
                  <div className="flex flex-wrap gap-2">
                    {["Full-Time", "Part-Time", "Self-Employed", "Unemployed"].map(s => (
                      <label key={s} className="cursor-pointer">
                        <input type="radio" name="status_radio" value={s} checked={employmentStatus === s} onChange={() => setEmploymentStatus(s)} className="peer sr-only" />
                        <div className="px-3 py-1.5 rounded-full border border-[var(--color-eg-border-strong)] text-[13px] font-medium text-[var(--color-eg-text-secondary)] peer-checked:bg-[var(--color-eg-text-primary)] peer-checked:text-[var(--color-eg-text-inverse)] peer-checked:border-[var(--color-eg-text-primary)] transition-all">
                          {s}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className={`col-span-1 ${employmentStatus === "Unemployed" ? "md:col-span-4" : "md:col-span-2"} bg-[var(--color-eg-surface)] rounded-2xl shadow-[var(--shadow-eg-sm)] border border-[var(--color-eg-border)] p-5 sm:p-6 flex flex-col justify-center transition-all hover:shadow-[var(--shadow-eg-md)]`}>
                  <label htmlFor="education" className="block text-sm font-semibold mb-1.5">Education Level</label>
                  <Select required value={selectedEducation} onValueChange={(val) => setSelectedEducation(val || "")}>
                    <SelectTrigger className={`w-full h-12 px-4 bg-[var(--color-eg-surface)] border border-[var(--color-eg-border-strong)] rounded-xl text-sm focus:ring-[var(--color-eg-border-focus)] transition-all ${attemptedSubmit && !selectedEducation ? "border-[var(--color-eg-error)] ring-1 ring-[var(--color-eg-error)]" : ""}`}>
                      <SelectValue placeholder="Select highest education..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="below_10">Below 10th</SelectItem>
                      <SelectItem value="10th_pass">10th Pass</SelectItem>
                      <SelectItem value="12th_pass">12th Pass</SelectItem>
                      <SelectItem value="diploma">Diploma / ITI</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                      <SelectItem value="post_graduate">Post Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Occupation */}
                {employmentStatus !== "Unemployed" && (
                  <div className="col-span-1 md:col-span-2 bg-[var(--color-eg-surface)] rounded-2xl shadow-[var(--shadow-eg-sm)] border border-[var(--color-eg-border)] p-5 sm:p-6 flex flex-col justify-center transition-all hover:shadow-[var(--shadow-eg-md)]">
                    <label htmlFor="occupation" className="block text-sm font-semibold mb-1.5">Current Occupation</label>
                    <Select required value={selectedOccupation} onValueChange={(val) => setSelectedOccupation(val || "")}>
                      <SelectTrigger className={`w-full h-12 px-4 bg-[var(--color-eg-surface)] border border-[var(--color-eg-border-strong)] rounded-xl text-sm focus:ring-[var(--color-eg-border-focus)] transition-all ${attemptedSubmit && !selectedOccupation ? "border-[var(--color-eg-error)] ring-1 ring-[var(--color-eg-error)]" : ""}`}>
                        <SelectValue placeholder="Select an industry...">
                          {selectedOccupation ? OCCUPATION_OPTIONS[selectedOccupation] || selectedOccupation : null}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(OCCUPATION_OPTIONS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Salary */}
                <div className="col-span-1 md:col-span-4 bg-[var(--color-eg-surface)] rounded-2xl shadow-[var(--shadow-eg-sm)] border border-[var(--color-eg-border)] p-5 sm:p-6 flex flex-col justify-center transition-all hover:shadow-[var(--shadow-eg-md)]">
                  <div className="flex justify-between items-end mb-3">
                    <label htmlFor="salary" className="block text-sm font-semibold">Annual Family Income</label>
                    <span className="text-xl font-bold text-[var(--color-eg-text-primary)]">₹{Number(salary).toLocaleString('en-IN')}</span>
                  </div>
                  <input id="salary" type="range" min="0" max="500000" step="10000"
                    value={Number(salary) > 500000 ? 500000 : salary} onChange={(e) => setSalary(e.target.value)}
                    className="w-full h-1.5 bg-[var(--color-eg-surface-highest)] rounded-lg appearance-none cursor-pointer accent-[var(--color-eg-text-primary)]"
                  />
                  <div className="flex justify-between text-[11px] font-medium text-[var(--color-eg-text-muted)] mt-1.5">
                    <span>₹0</span>
                    <span>₹5L (Max Limit)</span>
                  </div>
                  <p className="text-xs text-[var(--color-eg-text-secondary)] mt-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">info</span>
                    SC concessional credit schemes are specifically designed for beneficiaries with an annual family income up to ₹5,00,000.
                  </p>
                </div>
              </motion.div>
            )}

            {/* ===== STEP 4: DECLARATION ===== */}
            {step === 4 && (
              <motion.div key="step4" custom={direction} variants={slideVariants} initial="initial" animate="animate" exit="exit"
                className="w-full grid grid-cols-1 gap-4">

                {/* SC Declaration */}
                <div className="col-span-1 bg-[var(--color-eg-surface)] rounded-2xl shadow-[var(--shadow-eg-sm)] border border-[var(--color-eg-border)] p-5 sm:p-6 flex flex-col justify-center transition-all hover:shadow-[var(--shadow-eg-md)]">
                  <label className="cursor-pointer flex items-start gap-4 group">
                    <div className="relative mt-0.5 shrink-0">
                      <input
                        type="checkbox"
                        name="scDeclarationCheck"
                        checked={scDeclaration}
                        onChange={(e) => setScDeclaration(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all
                        ${scDeclaration
                          ? "bg-[var(--color-eg-text-primary)] border-[var(--color-eg-text-primary)]"
                          : attemptedSubmit && !scDeclaration
                          ? "border-[var(--color-eg-error)] bg-transparent"
                          : "border-[var(--color-eg-border-strong)] bg-transparent"
                        }`}>
                        {scDeclaration && <span className="material-symbols-outlined text-[var(--color-eg-text-inverse)] text-[16px]">check</span>}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-[var(--color-eg-text-primary)] block mb-1">SC Declaration</span>
                      <span className="text-[12px] text-[var(--color-eg-text-secondary)] leading-relaxed">
                        I hereby declare that I belong to the Scheduled Caste (SC) category as per the Government of India classification. I understand that concessional credit schemes under this platform are specifically designed for SC beneficiaries.
                      </span>
                    </div>
                  </label>
                  {attemptedSubmit && !scDeclaration && (
                    <p className="text-xs text-[var(--color-eg-error)] mt-3 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">warning</span>
                      SC declaration is mandatory to access concessional credit schemes.
                    </p>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Action Area */}
          <div className="w-full bg-[var(--color-eg-surface)] rounded-2xl shadow-[var(--shadow-eg-sm)] border border-[var(--color-eg-border)] p-5 flex items-center justify-between mt-2">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="text-sm font-semibold text-[var(--color-eg-text-secondary)] hover:text-[var(--color-eg-text-primary)] transition-colors flex items-center gap-2 group">
                <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                Back
              </button>
            ) : (
              <div></div>
            )}

            {step < TOTAL_STEPS ? (
              <button type="button" onClick={nextStep} className="h-12 px-6 bg-[var(--color-eg-text-primary)] text-[var(--color-eg-text-inverse)] text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 group">
                Next Step
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            ) : (
              <button type="submit" onClick={() => setAttemptedSubmit(true)} disabled={isPending} className="h-12 px-6 bg-[var(--color-eg-text-primary)] text-[var(--color-eg-text-inverse)] text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 group disabled:opacity-50">
                {isPending ? "Finding Schemes..." : "Complete & Find Schemes"}
                {!isPending && <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>}
              </button>
            )}
          </div>

        </form>
      </main>

      {/* Decorative Atmosphere */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-[var(--color-eg-accent)]/20 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-[var(--color-eg-surface-highest)]/40 blur-[120px]"></div>
      </div>
    </div>
  );
}
