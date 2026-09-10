"use client";

import { useActionState, useState, useEffect } from "react";
import { updateProfile, type ProfileActionResult } from "@/actions/profile";
import { useNativeHaptics } from "@/hooks/useNativeHaptics";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState: ProfileActionResult = {};

export default function ProfileForm({ initialData }: { initialData: Record<string, string | number | null> }) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialState);
  const [salary, setSalary] = useState(initialData.annualIncome || "300000");
  const [selectedState, setSelectedState] = useState(initialData.state?.toString() || "");
  const [selectedOccupation, setSelectedOccupation] = useState(initialData.occupation?.toString() || "");
  const { triggerSuccess } = useNativeHaptics();
  const { t } = useTranslation();

  useEffect(() => {
    if (state.success) {
      triggerSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  const STATE_OPTIONS: Record<string, string> = {
    "AP": "Andhra Pradesh", "AR": "Arunachal Pradesh", "AS": "Assam", "BR": "Bihar",
    "CT": "Chhattisgarh", "GA": "Goa", "GJ": "Gujarat", "HR": "Haryana",
    "HP": "Himachal Pradesh", "JH": "Jharkhand", "KA": "Karnataka", "KL": "Kerala",
    "MP": "Madhya Pradesh", "MH": "Maharashtra", "MN": "Manipur", "ML": "Meghalaya",
    "MZ": "Mizoram", "NL": "Nagaland", "OR": "Odisha", "PB": "Punjab", "RJ": "Rajasthan",
    "SK": "Sikkim", "TN": "Tamil Nadu", "TG": "Telangana", "TR": "Tripura",
    "UP": "Uttar Pradesh", "UT": "Uttarakhand", "WB": "West Bengal",
    "AN": "Andaman and Nicobar Islands", "CH": "Chandigarh", "DN": "Dadra and Nagar Haveli and Daman and Diu",
    "DL": "Delhi", "JK": "Jammu and Kashmir", "LA": "Ladakh", "LD": "Lakshadweep", "PY": "Puducherry"
  };

  const OCCUPATION_OPTIONS: Record<string, string> = {
    "tech": "Technology & Software", "healthcare": "Healthcare & Medical",
    "education": "Education & Research", "finance": "Finance & Accounting",
    "government": "Public Sector & Government", "farmer": "Farmer / Agriculture",
    "doctor": "Doctor", "student": "Student", "other": "Other / Independent"
  };

  return (
    <div className="w-full">
      {state.error && (
        <div className="w-full mb-6 p-4 rounded-xl bg-[var(--color-eg-error-light)] text-[var(--color-eg-error)] text-sm font-medium shadow-[var(--shadow-eg-sm)]">
          {t('profile.error')}
        </div>
      )}
      
      {state.success && (
        <div className="w-full mb-6 p-4 rounded-xl bg-[var(--color-eg-success-light)] text-[var(--color-eg-success-dark)] text-sm font-medium shadow-[var(--shadow-eg-sm)] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {t('profile.success')}
        </div>
      )}

      <form action={formAction} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        
        {/* Section 1: Identity */}
        <div className="col-span-1 md:col-span-2 bg-[var(--color-eg-surface)] rounded-3xl shadow-[var(--shadow-eg-sm)] border border-[var(--color-eg-border)] p-8 sm:p-10 flex flex-col transition-all hover:shadow-[var(--shadow-eg-md)]">
          <h3 className="text-xl font-bold mb-6 text-[var(--color-eg-text-primary)] border-b border-[var(--color-eg-surface-highest)] pb-4">{t('profile.identity')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="fullName" className="block text-sm font-semibold mb-2">{t('profile.fullName')}</label>
              <input id="fullName" name="fullName" type="text" defaultValue={initialData.fullName || ""} required
                className="w-full h-12 px-4 bg-[var(--color-eg-surface)] border border-[var(--color-eg-border-strong)] rounded-xl text-base placeholder:text-[var(--color-eg-text-disabled)] focus:outline-none focus:ring-2 focus:ring-[var(--color-eg-border-focus)] transition-all" />
            </div>

            <div className="flex flex-col">
              <label htmlFor="age" className="block text-sm font-semibold mb-2">{t('profile.age')}</label>
              <input id="age" name="age" type="number" min="0" max="120" defaultValue={initialData.age || ""} required
                className="w-full h-12 px-4 bg-[var(--color-eg-surface)] border border-[var(--color-eg-border-strong)] rounded-xl text-base placeholder:text-[var(--color-eg-text-disabled)] focus:outline-none focus:ring-2 focus:ring-[var(--color-eg-border-focus)] transition-all" />
            </div>

            <div className="flex flex-col md:col-span-2">
              <label htmlFor="state" className="block text-sm font-semibold mb-2">{t('profile.state')}</label>
              <Select name="state" value={selectedState} onValueChange={(val) => setSelectedState(val || "")}>
                <SelectTrigger className="w-full h-12 px-4 bg-[var(--color-eg-surface)] border border-[var(--color-eg-border-strong)] rounded-xl text-base focus:ring-[var(--color-eg-border-focus)] transition-all">
                  <SelectValue placeholder={t('profile.selectJurisdiction')}>
                    {selectedState ? STATE_OPTIONS[selectedState] || selectedState : null}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATE_OPTIONS).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Section 2: Personalization */}
        <div className="col-span-1 md:col-span-2 bg-[var(--color-eg-surface)] rounded-3xl shadow-[var(--shadow-eg-sm)] border border-[var(--color-eg-border)] p-8 sm:p-10 flex flex-col transition-all hover:shadow-[var(--shadow-eg-md)]">
          <h3 className="text-xl font-bold mb-6 text-[var(--color-eg-text-primary)] border-b border-[var(--color-eg-surface-highest)] pb-4">{t('profile.personalization')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <legend className="text-sm font-semibold mb-3">{t('profile.preferredLanguage')}</legend>
              <div className="flex flex-col gap-3">
                {[
                  { val: "english", label: "English", icon: "language" },
                  { val: "hindi", label: "हिंदी", icon: "translate" },
                ].map(lang => (
                  <label key={lang.val} className="cursor-pointer relative group">
                    <input type="radio" name="language" value={lang.val} defaultChecked={(initialData.preferredLanguage || "english") === lang.val} className="peer sr-only" />
                    <div className="bg-[var(--color-eg-background)] rounded-xl p-3 flex items-center gap-3 border border-[var(--color-eg-border-strong)] transition-all peer-checked:bg-[var(--color-eg-accent)] peer-checked:border-[var(--color-eg-text-primary)] peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 hover:shadow-[var(--shadow-eg-sm)]">
                      <span className="material-symbols-outlined text-[18px]">{lang.icon}</span>
                      <span className="text-sm font-medium">{lang.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <legend className="text-sm font-semibold mb-3">{t('profile.gender')}</legend>
              <div className="flex flex-col gap-3">
                {[
                  { val: "female", label: t('profile.female') },
                  { val: "male", label: t('profile.male') },
                  { val: "non-binary", label: t('profile.nonBinary') },
                  { val: "prefer-not", label: t('profile.preferNot') },
                ].map(gender => (
                  <label key={gender.val} className="cursor-pointer relative group">
                    <input type="radio" name="gender" value={gender.val} defaultChecked={(initialData.gender || "prefer-not") === gender.val} className="peer sr-only" />
                    <div className="bg-[var(--color-eg-background)] rounded-xl p-3 flex items-center gap-3 border border-[var(--color-eg-border-strong)] transition-all peer-checked:bg-[var(--color-eg-accent)] peer-checked:border-[var(--color-eg-text-primary)] peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 hover:shadow-[var(--shadow-eg-sm)]">
                      <span className="text-sm font-medium">{gender.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Professional */}
        <div className="col-span-1 md:col-span-2 bg-[var(--color-eg-surface)] rounded-3xl shadow-[var(--shadow-eg-sm)] border border-[var(--color-eg-border)] p-8 sm:p-10 flex flex-col transition-all hover:shadow-[var(--shadow-eg-md)]">
          <h3 className="text-xl font-bold mb-6 text-[var(--color-eg-text-primary)] border-b border-[var(--color-eg-surface-highest)] pb-4">{t('profile.professional')}</h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col">
              <label htmlFor="occupation" className="block text-sm font-semibold mb-2">{t('profile.occupation')}</label>
              <Select name="occupation" value={selectedOccupation} onValueChange={(val) => setSelectedOccupation(val || "")}>
                <SelectTrigger className="relative w-full h-12 pl-12 pr-4 bg-[var(--color-eg-surface)] border border-[var(--color-eg-border-strong)] rounded-xl text-base focus:ring-[var(--color-eg-border-focus)] transition-all">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-eg-text-muted)] group-focus-within:text-[var(--color-eg-text-primary)] pointer-events-none transition-colors">work</span>
                  <SelectValue placeholder={t('profile.selectIndustry')}>
                    {selectedOccupation ? OCCUPATION_OPTIONS[selectedOccupation] || selectedOccupation : null}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(OCCUPATION_OPTIONS).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-semibold mb-3">{t('profile.employmentStatus')}</label>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: "Full-Time", label: t('profile.fullTime') },
                  { id: "Part-Time", label: t('profile.partTime') },
                  { id: "Self-Employed", label: t('profile.selfEmployed') },
                  { id: "Unemployed", label: t('profile.unemployed') }
                ].map(status => (
                  <label key={status.id} className="cursor-pointer">
                    <input type="radio" name="status" value={status.id} defaultChecked={(initialData.employmentStatus || "Full-Time") === status.id} className="peer sr-only" />
                    <div className="px-4 py-2 rounded-full border border-[var(--color-eg-border-strong)] text-sm font-medium text-[var(--color-eg-text-secondary)] peer-checked:bg-[var(--color-eg-text-primary)] peer-checked:text-[var(--color-eg-text-inverse)] peer-checked:border-[var(--color-eg-text-primary)] transition-all">
                      {status.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col mt-4">
              <div className="flex justify-between items-end mb-4">
                <label htmlFor="salary" className="block text-sm font-semibold">{t('profile.salary')}</label>
                <span className="text-xl font-bold text-[var(--color-eg-text-primary)]">₹{Number(salary).toLocaleString('en-IN')}</span>
              </div>
              <div className="relative w-full">
                <input id="salary" name="salary" type="range" min="0" max="2500000" step="50000"
                  value={salary} onChange={(e) => setSalary(e.target.value)}
                  className="w-full h-2 bg-[var(--color-eg-surface-highest)] rounded-lg appearance-none cursor-pointer accent-[var(--color-eg-text-primary)]"
                />
              </div>
              <div className="flex justify-between text-xs font-medium text-[var(--color-eg-text-muted)] mt-2">
                <span>₹0</span>
                <span>₹25L+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
          <button type="submit" disabled={isPending} className="h-12 px-8 bg-[var(--color-eg-text-primary)] text-[var(--color-eg-text-inverse)] text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 group disabled:opacity-50 disabled:pointer-events-none">
            {isPending ? t('profile.saving') : t('profile.saveChanges')}
            {!isPending && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">save</span>}
          </button>
        </div>

      </form>
    </div>
  );
}
