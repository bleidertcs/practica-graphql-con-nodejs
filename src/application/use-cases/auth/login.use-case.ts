import type { IUserRepository } from '../../../domain/repositories/user.repository.interface.js';
import { comparePassword, generateToken, type AuthTokens } from '../../services/auth.service.js';
import { InvalidEntityError } from '../../../domain/errors/domain-errors.js';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  user: {
    id: number;
    username: string;
    email: string;
  };
  tokens: AuthTokens;
}

export class LoginUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: LoginInput): Promise<LoginResult> {
    // Find user by email
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new InvalidEntityError('Invalid email or password');
    }

    // Verify password
    const isValid = await comparePassword(input.password, user.passwordHash);
    if (!isValid) {
      throw new InvalidEntityError('Invalid email or password');
    }

    // Generate tokens
    const tokens = generateToken(user);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      tokens,
    };
  }
}
