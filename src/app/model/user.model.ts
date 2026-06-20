export class User{
  username!:string ;
  password !: string ;
  roles!:string[];
  email!: string ;
  enabled!: boolean
}

export interface UserRole {
  role_id?: number;
  role: string;
}

export interface AppUser {
  user_id: number;
  username: string;
  email: string;
  enabled: boolean;
  roles: UserRole[];
}
