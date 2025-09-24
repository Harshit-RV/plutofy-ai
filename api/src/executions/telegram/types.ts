export interface AuthProd {
  apiKey: string
}

export interface SendMessageProps extends AuthProd { 
  chatId: string,
  text: string
}
