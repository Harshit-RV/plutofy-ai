import React, { useState } from "react";

interface KeyValue {
  key: string;
  type: string;
}

const JsonInputWithFields: React.FC = () => {
  const [jsonObject, setJsonObject] = useState<Record<string, any>>({});
  const [keyInput, setKeyInput] = useState<string>("");
  const [valueType, setValueType] = useState<string>("string");

  const handleAddKeyValue = () => {
    if (!keyInput.trim()) {
      alert("Key cannot be empty!");
      return;
    }

    let defaultValue: any;
    switch (valueType) {
      case "string":
        defaultValue = "";
        break;
      case "number":
        defaultValue = 0;
        break;
      case "boolean":
        defaultValue = false;
        break;
      default:
        return;
    }

    setJsonObject((prev) => ({
      ...prev,
      [keyInput]: defaultValue,
    }));

    setKeyInput(""); // Reset key input
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white shadow-md rounded-lg w-1/2 mx-auto">
      <h2 className="text-2xl font-bold mb-4">JSON Builder</h2>
      
      {/* Key and Value Type Input */}
      <div className="flex flex-col w-full">
        <div className="flex gap-6 mb-4">
          <input
            type="text"
            placeholder="Key"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="w-full">
            <div className="relative">
              <select
                value={valueType}
                onChange={(e) => setValueType(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
              </select>
            </div>
          </div>
        </div>
        <button
          onClick={handleAddKeyValue}
          className="w-[100px] p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {/* JSON Object Display */}
      <pre className="mt-6 p-3 bg-gray-100 border rounded-lg w-full overflow-auto text-sm">
        {JSON.stringify(jsonObject, null, 2)}
      </pre>
    </div>
  );
};

export default JsonInputWithFields;