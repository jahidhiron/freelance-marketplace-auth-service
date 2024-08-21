import { getUserByUsername, signToken } from '@auth/services/auth.service';
import { NotFoundError } from '@jahidhiron/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export async function token(req: Request, res: Response): Promise<void> {
  const existingUser = await getUserByUsername(req.currentUser?.username as string);
  if (!existingUser) {
    throw new NotFoundError('User not found', 'Refresh token token() method error');
  }

  const userJWT = signToken(existingUser.id!, existingUser.email!, existingUser.username!);

  res.status(StatusCodes.OK).json({ message: 'Refresh token', user: existingUser, token: userJWT });
}
