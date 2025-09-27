export interface AuthProd {
  botToken: string
}

export interface SendMessageProps extends AuthProd { 
  chatId: string,
  message: string
}
