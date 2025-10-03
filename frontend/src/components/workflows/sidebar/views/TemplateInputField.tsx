import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import Templater from '@/utils/template.utils';
import { OutputStructure } from '@/types/agent';

interface TemplateInputFieldProps {
  value: string;
  onValueChange: (value: string) => void;
  name: string;
  displayName: string;
  outputStructure?: OutputStructure[];
}

export interface TemplateVariable {
  key: string;
  startIndex: number;
  endIndex: number;
  isValid: boolean;
}

const TemplateInputField: React.FC<TemplateInputFieldProps> = ({
  value,
  onValueChange,
  displayName,
  outputStructure
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [variables, setVariables] = useState<TemplateVariable[]>([]);

  useEffect(() => {
    if (outputStructure?.length != 0) {
      const validatedVariables = Templater.getValidatedTemplateVars(value, outputStructure ?? []);
      setVariables(validatedVariables);
    } else {
      setVariables([]);
    }
  }, [value, outputStructure]);

  // return (
  //   <div>{JSON.stringify(variables.map((i) => i.isValid))}</div>
  // )

  // If there are no template variables or no previous node data, render as normal input
  if (variables.length === 0) {
    return (
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className=""
        placeholder={`Enter ${displayName.toLowerCase()}`}
      />
    );
  }

  // Render the input with template variable highlighting
  const renderHighlightedText = () => {
    const textParts = Templater.getRenderableItems(value, variables);
    console.log(textParts)
    
    return textParts.map((part, index) => {
      if (!part.isTemplate) {
        return <span key={index}>{part.text}</span>;
      }
      
      return (
        <span
          key={index}
          className={`px-1 rounded ${
            part.isValid 
              ? 'bg-green-100 text-green-800 border border-green-300' 
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}
        >
          {part.text}
        </span>
      );
    });
  };

  return (
    <div className="space-y-2">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className=""
        placeholder={`Enter ${displayName.toLowerCase()}`}
      />
      
      {/* Preview with highlighted text - only visible when focused and has template variables */}
      {isFocused && variables.length > 0 && (
        <div className="p-2 text-sm border border-gray-200 rounded-md bg-gray-50">
          <div className="whitespace-pre-wrap">
            {renderHighlightedText()}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateInputField;