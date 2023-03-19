import { LoginType, User } from '@prisma/client';
import prisma from './utils/prisma';
import { validPassword, verifyJwt } from '@/components/server/utils/password';
export type LoginParament = {
  user: string;
  password?: string;
  loginType: LoginType;
};
import type { NextApiRequest } from 'next';
import type { response } from '@/components/server/dto/response';
export const login = (input: LoginParament): Promise<User | null> => {
  if (input.loginType == LoginType.PASSWORD) {
    return loginPassword(input);
  }
  return Promise.reject('不支持的登录');
};

const loginPassword = async (input: LoginParament): Promise<User | null> => {
  const login = await prisma?.login.findFirst({
    where: { accessName: input.user, type: 'PASSWORD' },
  });
  if (!login) {
    throw new Error('登录失败');
  }
  if (validPassword(input.password || '', login.accessPwd || '')) {
    return await getUser(login.userId);
  }
  throw new Error('登录失败');
};

const getUser = async (userId: number): Promise<User | null> => {
  const login = await prisma?.user.findUnique({
    where: { id: userId },
  });
  if (login !== null) {
    return login;
  } else {
    return null;
  }
};

export type loginCheckResult = {
  login: boolean;
  user: User | null;
} & response;

/**
 * 获取用户登录信息
 * 此方法只能用于服务端
 * @param req
 * @returns
 */
export const getLoginUser = (
  req: NextApiRequest,
  opts?: { reqLogin: boolean }
): Promise<loginCheckResult> => {
  const ret: loginCheckResult = { login: false, user: null };
  const cookieStr = req.cookies['auth'] ?? '';
  if (cookieStr !== null && cookieStr !== undefined && cookieStr.length > 0) {
    try {
      const verify: any = verifyJwt(cookieStr);
      if (verify) {
        ret.login = true;
        ret.code = 0;
        ret.user = { ...verify };
      }
    } catch (err) {
      console.error(err);
      ret.login = false;
      ret.user = {
        id: -1,
        name: 'guest',
        avatar: '',
        createAt: new Date(),
        updatedAt: new Date(),
      };
    }
  } else {
    ret.login = false;
    ret.user = {
      id: -1,
      name: 'guest',
      avatar: '',
      createAt: new Date(),
      updatedAt: new Date(),
    };
  }
  if (opts?.reqLogin && ret.login === false) {
    return Promise.reject('功能需要登录再使用');
  } else {
    return Promise.resolve(ret);
  }
};
