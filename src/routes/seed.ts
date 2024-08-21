import { create } from '@auth/controllers/seeds';
import express, { Router } from 'express';

const router = express.Router();

export function seedRoutes(): Router {
  router.put('/seed/:count', create);

  return router;
}
