import React from "react";
// This is a placeholder as form components are usually integrated into pages or separate small atoms.
// I'll leave it simple for now or use it if needed for complex shared forms.
export const Input = ({ label, icon: Icon, ...props }) => (
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text font-semibold">{label}</span>
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
          <Icon size={18} />
        </div>
      )}
      <input
        className={`input input-bordered w-full ${Icon ? "pl-10" : ""} focus:input-primary`}
        {...props}
      />
    </div>
  </div>
);
