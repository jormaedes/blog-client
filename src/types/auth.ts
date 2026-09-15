export interface User {
	id: number;
	firstName: string;
	lastName: string;
	username: string;
	userType: string;
}

export interface LoginResponse {
	token: string;
	user: User;
}

export interface UserState {
	user: User | null;
	isAuthLoading: boolean;
	isAuthenticated: boolean;
	setUser: (userData: User) => void;
	logout: () => void;
	restoreAuth: () => Promise<void>;
}