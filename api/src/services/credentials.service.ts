import CredentialsEntity, { CredentialsProps } from "../models/Credentials.model";

class CredentialsService {
  static async createCredentials(data: CredentialsProps, userId: string) {
    const Credentials =  new CredentialsEntity({
      ...data, userId
    })
    return Credentials.save();
  }

  static async deleteCredentials(id: string) {
    return await CredentialsEntity.findOneAndDelete({ _id: id })
  } 

  static async getAllCredentialsByUser(userId: string) {
    return CredentialsEntity.find({ userId });
  }

  static async getCredentialsById(id: string, userId: string) {
    return CredentialsEntity.find({ _id: id, userId: userId});
  }
}

export default CredentialsService;