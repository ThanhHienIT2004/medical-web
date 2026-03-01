// src/role.enum.ts
import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  GUEST = 'GUEST',
}

registerEnumType(Role, { name: 'Role', description: 'User role types' });