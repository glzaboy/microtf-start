import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'antd/dist/reset.css'
import { ConfigProvider, theme } from 'antd'
import zh_CN from 'antd/locale/zh_CN'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.compactAlgorithm,
      }}
      locale={zh_CN}
      // theme={{
      //   token: {
      //     colorPrimary: '#00b96b',
      //   },
      // }}
    >
      <Component {...pageProps} />
    </ConfigProvider>
  )
}
