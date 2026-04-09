export type User = {
	id: string;
	email: string;
	full_name: string;
	phone?: string | null;
	address?: string | null;
	avatar?: string | null;
	date_of_birth?: string | Date | null;
	role?: string | null;
	created_at?: string | Date;
	updated_at?: string | Date | null;
};