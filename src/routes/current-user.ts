import { read, resendEmail } from '@auth/controllers/current-user';
import { changePassword } from '@auth/controllers/password';
import { token } from '@auth/controllers/refresh-token';
import express, { Router } from 'express';

const router: Router = express.Router();

export function currentUserRoutes(): Router {
  router.get('/currentuser', read);
  router.post('/resend-email', resendEmail);
  router.put('/change-password', changePassword);
  router.get('/refresh-token', token);

  return router;
}
