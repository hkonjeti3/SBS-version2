export class user{
    userId: number  | null | undefined;
    username: string | null | undefined;
    firstName!: string | null | undefined;
    lastName!: string | null | undefined;
    address!: string | null | undefined;
    passwordHash!: string | null | undefined;
    emailAddress!: string | null | undefined;
    phoneNumber!: string | null | undefined;
    status!: string | null | undefined;
    role!: {
        roleId: number  | null | undefined;
        roleName: string | null | undefined;
    }
    token!: string | null | undefined;
}