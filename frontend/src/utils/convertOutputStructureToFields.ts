import { Field } from "@/components/json-forms/JsonInput";
import { OutputStructure } from "@/types/agent";

const convertOutputStructureToFields = (outputStructure: OutputStructure[]): Field[] => {
  return outputStructure.map(({ id, name, type, fields }) => ({
    id,
    name,
    type,
    fields: fields ? convertOutputStructureToFields(fields) : undefined,
  }));
};

export default convertOutputStructureToFields;