import { TemplateVariable } from "@/components/workflows/sidebar/views/TemplateInputField";
import { OutputStructure } from "@/types/agent";


interface RenderableItem {
  text: string, 
  isTemplate: boolean,
  isValid: boolean
}


class Templater {
  static extractTemplateVars = (text: string): TemplateVariable[] => {
    const variables: TemplateVariable[] = [];
    const regex = /\{\{([^}]+)\}\}/g;
    let match;
  
    while ((match = regex.exec(text)) !== null) {
      variables.push({
        key: match[1].trim(),
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        isValid: false // Will be validated later
      });
    }
  
    return variables;
  }
  
  static isTemplateVarValid = (key: string, structure: OutputStructure[]): boolean => {
    if (structure.length == 0) {
      return false;
    }
  
    const keys = key.split('.');
    let currentLevel = structure
    let outputType;
  
    for (const k of keys) {
      const field = currentLevel.find((i) => i.name == k)
  
      if (!field){
        return false
      }
  
      if (field.type == "object") {
        currentLevel = field.fields ?? []
      }
      outputType = field.type
    }
  
    if (outputType == "object") return false
    return true;
  }

  static getValidatedTemplateVars(text: string, outputStructure: OutputStructure[]): TemplateVariable[] {
    const variables = this.extractTemplateVars(text);
    
    return variables.map(variable => ({
      ...variable,
      isValid: this.isTemplateVarValid(variable.key, outputStructure)
    }));
  }

  static getRenderableItems = (text: string, variables: TemplateVariable[]): RenderableItem[] => {
    if (variables.length === 0) {
      return [ { text, isTemplate: false, isValid: true } ];
    }
  
    const result: RenderableItem[] = [];
    let lastIndex = 0;
  
    variables.forEach(variable => {
      // Add text before the template variable
      if (variable.startIndex > lastIndex) {
        result.push({
          text: text.slice(lastIndex, variable.startIndex),
          isTemplate: false,
          isValid: true
        });
      }
  
      // Add the template variable
      result.push({
        text: text.slice(variable.startIndex, variable.endIndex),
        isTemplate: true,
        isValid: variable.isValid
      });
  
      lastIndex = variable.endIndex;
    });
  
    // Add remaining text after the last template variable
    if (lastIndex < text.length) {
      result.push({
        text: text.slice(lastIndex),
        isTemplate: false,
        isValid: true
      });
    }
  
    return result;
  }
}

export default Templater



