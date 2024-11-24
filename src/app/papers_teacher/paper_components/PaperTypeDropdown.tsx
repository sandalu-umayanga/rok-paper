import React from "react";

interface PaperTypeDropdownProps {
  value: string;
  setValue: (value: string) => void;
  disabled: boolean;
}

const PaperTypeDropdown: React.FC<PaperTypeDropdownProps> = ({
  value,
  setValue,
  disabled,
}) => (
  <div className="flex flex-col">
    <label htmlFor="paperType" className="font-semibold">Paper Type</label>
    <select
      id="paperType"
      value={value}
      onChange={(e) => setValue(e.target.value.toUpperCase())} // Convert value to uppercase for consistency
      disabled={disabled}
      required
      className={`border p-2 rounded-md focus:outline-none focus:border-blue-500 ${
        disabled ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    >
      <option value="READING">Reading</option>
      <option value="LISTENING">Listening</option>
      <option value="FULL">Full</option>
    </select>
  </div>
);

export default PaperTypeDropdown;
