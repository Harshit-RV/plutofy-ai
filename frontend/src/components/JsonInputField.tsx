import React, { useEffect, useState } from "react";
import JSONPretty from "react-json-pretty";
import "react-json-pretty/themes/monikai.css";

interface JsonInputProps {
  onChange: (value: object | null) => void;
}

const JsonInput = ({ onChange } : JsonInputProps) => {
  const [jsonString, setJsonString] = useState<string>("{\"key\": \"value\"}");
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = event.target.value;
    setJsonString(input);
    try {
      const parsed = JSON.parse(input);
      setError(null);
      onChange(parsed);
    } catch (_) {
      setError("Invalid JSON");
      onChange(null);
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonString);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonString(formatted);
      setError(null);
    } catch (_) {
      setError("Invalid JSON");
    }
  };

  useEffect(() => {
    handleFormat();
  }, [jsonString])

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto p-4 bg-gray-800 rounded-lg shadow-lg">
      <label htmlFor="json-input" className="text-white text-lg mb-2">
        JSON Input
      </label>
      <textarea
        id="json-input"
        value={jsonString}
        onChange={handleInputChange}
        className="bg-gray-900 text-white font-mono p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-48"
        placeholder="Enter JSON here..."
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={handleFormat}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Format
        </button>
      </div>
      <div className="mt-4 bg-gray-700 p-4 rounded-lg">
        <p className="text-white text-sm">Preview:</p>
        <JSONPretty
          id="json-preview"
          data={jsonString}
          // theme={JSONPretty}
        />
      </div>
    </div>
  );
};

export default JsonInput;
