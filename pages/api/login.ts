// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { login } from '@/components/server/login';
import type { LoginParament } from '@/components/server/login';
import { signJwt } from '@/components/server/utils/password';
import { setCookie } from '@/components/server/utils/cookie';
import { response } from '@/components/server/dto/response';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<response>
) {
  const { type, userName, password } = req.body;
  const loginP: LoginParament = { user: userName, loginType: type, password };
  login(loginP)
    .then((loginUser) => {
      setCookie(
        res,
        'auth',
        signJwt({
          id: loginUser?.id,
          avatar: loginUser?.avatar,
          name: loginUser?.name,
        }),
        { path: '/', maxAge: 2592000, httpOnly: true }
      );
      res.status(200).json({ code: 0, msg: '' });
    })
    .catch((error: Error) => {
      res.status(200).json({ code: -1, msg: '失败' + error.message });
    });
}
