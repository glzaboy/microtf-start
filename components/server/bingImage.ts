import { request } from './utils/request';

/**
 * bin背景图
 * @returns 转换后的背景图
 */
const getImage = async (): Promise<string> => {
  try {
    const data = await request<{ images: Array<{ url: string }> }>(
      'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1',
      {
        checkCode: false,
      }
    );
    return Promise.resolve('https://cn.bing.com' + data.images[0].url);
  } catch (err) {
    return Promise.reject('获取图片出错' + err);
  }
};
export default getImage;
