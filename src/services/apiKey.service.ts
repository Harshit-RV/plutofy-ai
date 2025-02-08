import ApiKey, { ApiKeyDoc, ApiKeyProps } from "../models/ApiKey.model";
import { v4 as uuidv4 } from 'uuid';

export const createNewApiKey = async (args: ApiKeyProps): Promise<ApiKeyDoc> => {
  const apiKey = new ApiKey({ ...args, secretKey: uuidv4() });
  return apiKey.save();
};

export const getApiKeysByUserId = async (userId: string): Promise<ApiKeyDoc[]> => {
  return ApiKey.find({ userId });
};

export const getApiKeyById = async (id: string): Promise<ApiKeyDoc | null> => {
  return ApiKey.findById(id);
};

export const deleteApiKey = async (id: string) => {
  return ApiKey.findByIdAndDelete(id);
};

export const getAllApiKeys = async (): Promise<ApiKeyDoc[]> => {
  return ApiKey.find({});
};

export const updateApiKey = async (id: string, updateFields: Partial<ApiKeyProps>) => {
  return ApiKey.findByIdAndUpdate(id, updateFields, { new: true });
};
