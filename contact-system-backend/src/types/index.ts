export type UserType = {
  id: number;
  username: string;
  password: string;
  base64Photo: string;
  role_id: number;
  role: string;
};

export type CountryType = {
  id: number;
  country: string;
};

export type MessageType = {
  id: number;
  name: string;
  message: string;
  country_id: number;
  country: string;
  gender_id: number;
  gender: string;
  creationDate: string;
  read: boolean;
};
