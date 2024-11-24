import React from "react";

interface PaperIDInputProps {
  value: string;
  setValue: (value: string) => void;
  disabled: boolean;
}

const PaperIDInput: React.FC<PaperIDInputProps> = ({ value, setValue, disabled }) => (
  <div className="flex flex-col">
    <label htmlFor="paperId" className="font-semibold">Paper ID</label>
    <input
      id="paperId"
      type="number"
      min="1"
      max="100"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      disabled={disabled}
      required
      className="border p-2 rounded-md focus:outline-none focus:border-blue-500"
    />
  </div>
);

export default PaperIDInput;
