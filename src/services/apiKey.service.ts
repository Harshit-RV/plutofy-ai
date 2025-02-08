import ApiKey, { ApiKeyDoc, ApiKeyProps } from "../models/ApiKey.model";
import crypto from 'crypto';

const generateSecureApiKey = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const createNewApiKey = async (args: ApiKeyProps): Promise<ApiKeyDoc> => {
  const apiKey = new ApiKey({ ...args, secretKey: generateSecureApiKey() });
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

export const isSecretKeyValid = async (secretKey: string): Promise<boolean> => {
  try {
    const apiKey = await ApiKey.findOne({ secretKey });
    return !!apiKey;
  } catch (error) {
    console.error('Error validating secret key:', error);
    return false;
  }
};