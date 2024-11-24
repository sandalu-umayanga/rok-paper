import React from "react";

interface DiscussionLinkInputProps {
  value: string;
  setValue: (value: string) => void;
  disabled: boolean;
}

const DiscussionLinkInput: React.FC<DiscussionLinkInputProps> = ({ value, setValue, disabled }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let link = e.target.value;
    if (link && !/^https?:\/\//i.test(link)) {
      link = `https://${link}`;
    }
    setValue(link);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="discussionLink" className="font-semibold">Discussion Link</label>
      <input
        id="discussionLink"
        type="text"
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        required
        className="border p-2 rounded-md focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default DiscussionLinkInput;
