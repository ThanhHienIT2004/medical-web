import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { LoginResponse } from './models/auth.model';
import { User } from '../user/types/user.type';

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) { }

    @Mutation(() => User)
    async register(@Args("userData") userData: RegisterDto): Promise<User> {
        const registeredUser = await this.authService.register(userData);
        return {
            ...registeredUser,
            password: userData.password
        };
    }

    @Mutation(() => LoginResponse)
    async login(@Args("userData") userData: LoginDto): Promise<LoginResponse> {
        return await this.authService.login(userData);
    }
}
