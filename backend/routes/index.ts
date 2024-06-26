import { Application, Router } from 'express';

import messageRouter from './messages.routes';
import channelRouter from './channel.routes';
import authRouter from './auth.routes';

const router = Router();

export const connect = (app: Application, path: string): void => {
    router.use('/auth', authRouter)
    router.use('/messages', messageRouter);
    router.use('/channel', channelRouter);

    app.use(path, router);
}
