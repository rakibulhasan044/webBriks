import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PaginateParams } from '../../common/decorators/paginate.decorator';
import { PaginateHelper } from '../../common/helper/paginate.helper';
import * as bcrypt from 'bcrypt';
import { MinioService } from '../minio/minio.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly minioService: MinioService,
  ) {}

  async register(registerDto: RegisterDto, photo?: Express.Multer.File) {
    const { name, email, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password
    const saltOrRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltOrRounds);

    // Handle optional photo upload
    let photoUrl: string | null = null;
    if (photo) {
      photoUrl = await this.minioService.uploadFile(photo, 'profiles');
    }

    // Create the user
    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        passwordHash,
        photo: photoUrl,
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        photo: user.photo,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find the user
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        photo: user.photo,
      },
    };
  }

  async getAllUsers(paginateParams: PaginateParams) {
    const { skip, limit, search, page } = paginateParams;

    const where = search 
      ? { 
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } }
          ]
        }
      : {};

    const [users, total] = await Promise.all([
      this.prismaService.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          photo: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prismaService.user.count({ where }),
    ]);

    return PaginateHelper.response(users, total, { page, limit });
  }

  async getMe(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        photo: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async updateProfile(userId: string, name?: string, photo?: Express.Multer.File) {
    const user = await this.prismaService.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    let photoUrl = user.photo;
    if (photo) {
      photoUrl = await this.minioService.uploadFile(photo, 'profiles');
      
      // Clean up old profile picture from MinIO
      if (user.photo) {
        await this.minioService.deleteFile(user.photo);
      }
    }

    return this.prismaService.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        photo: photoUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        photo: true,
      },
    });
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prismaService.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const isPasswordValid = await bcrypt.compare(dto.oldPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new ConflictException('Incorrect old password');
    }

    const saltOrRounds = 10;
    const newPasswordHash = await bcrypt.hash(dto.newPassword, saltOrRounds);

    await this.prismaService.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    return { success: true };
  }
}
