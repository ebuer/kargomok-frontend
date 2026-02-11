export interface User {
    id: string;
    name: string;
    email: string;
    image: string;
}

export interface Session {
    user: User;
    accessToken: string;
    refreshToken: string;
}