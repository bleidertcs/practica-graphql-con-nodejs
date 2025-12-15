import type { IUserRepository } from '../../../domain/repositories/user.repository.interface.js';
import { hashPassword, generateToken, type AuthTokens } from '../../services/auth.service.js';
import { InvalidEntityError } from '../../../domain/errors/domain-errors.js';

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResult {
  user: {
    id: number;
    username: string;
    email: string;
  };
  tokens: AuthTokens;
}

export class RegisterUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: RegisterInput): Promise<RegisterResult> {
    // Check if email already exists
    const existingEmail = await this.userRepository.findByEmail(input.email);
    if (existingEmail) {
      throw new InvalidEntityError('Email already in use');
    }

    // Check if username already exists
    const existingUsername = await this.userRepository.findByUsername(input.username);
    if (existingUsername) {
      throw new InvalidEntityError('Username already in use');
    }

    // Hash password
    const passwordHash = await hashPassword(input.password);

    // Create user
    const user = await this.userRepository.create({
      username: input.username,
      email: input.email,
      passwordHash,
    });

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
