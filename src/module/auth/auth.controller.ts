import { Body, Controller, Post } from '@nestjs/common';
import { ROUTE } from 'shared/route';
import {
  SignUpWithFirebaseAdminBodyDTO,
  SignUpWithFirebaseAdminResponseDTO,
} from './auth.dto';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post(ROUTE.SIGN_IN)
  public async signUpWithFirebaseAdmin(
    @Body() body: SignUpWithFirebaseAdminBodyDTO,
  ): Promise<SignUpWithFirebaseAdminResponseDTO> {
    return await this.authService.signInWithFirebaseAdmin(body);
  }
}
