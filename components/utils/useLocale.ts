import { useAppSelector, selectGlobal } from '@/modules/store';

/**
 * 获取用户翻译项目
 * @param locale 语言翻译文件
 * @returns 翻译项目
 */
function useLocale(locale: any = null): Record<string, string> {
  return getLocaleTable(locale, useLocaleName());
}
/**
 * 返回客户端使用语言名称
 * @returns 语言名称
 */
export function useLocaleName(): 'zh-CN' | 'en-US' {
  const globalState = useAppSelector(selectGlobal);

  return globalState.lang || 'zh-CN';
}
export function getLocaleTable(
  locale: any = null,
  lang: string
): Record<string, string> {
  if (locale) {
    return locale[lang];
  } else {
    return {};
  }
}
export default useLocale;
