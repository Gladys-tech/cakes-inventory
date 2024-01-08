import { UserRole } from "../models/user";

export interface CreateUsers {
    firstName: string;
    lastName: string;
    email: string;
    image?: string;
    password: string;
    role?: UserRole;
    isEmailVerified?: boolean;
    emailVerificationToken?: string;
    agreeToTerms?: boolean;
    rememberMe?: boolean;
    apiToken?: string;
    resetToken?: string;
    resetTokenExpires?: Date;
}

export interface UpdateUsers {
    //  optional fields for the UpdateUsers
    firstName?: string;
    lastName?: string;
    email?: string;
    image?: string;
    password?: string;
    role?: UserRole;
    isEmailVerified?: boolean;
    emailVerificationToken?: string;
    agreeToTerms?: boolean;
    rememberMe?: boolean;
    apiToken?: string;
    resetToken?: string;
    resetTokenExpires?: Date;
}
