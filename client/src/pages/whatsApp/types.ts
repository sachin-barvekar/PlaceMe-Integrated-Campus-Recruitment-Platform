export interface TokenRequest {
  phoneNumberId: string;
  whatsappBusinessID: string;
  code: string;
}

export interface FacebookBusinessResponse {
  success: boolean;
  data: {
    id: string,
    name: string,
    owner_business_info: {
      name: string,
      id: string
    }
  };
}
