import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Button, DatePicker } from 'antd'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>第一个页面</title>
      </Head>
      <Button>test</Button>
      <DatePicker />
      <div className={'form'}>12</div>
      <style jsx>{`
        .form {
          color: red;
        }
        .form--theme-xmas {
        }
        .form--simple {
        }
        .form__input {
        }
        .form__submit {
        }
        .form__submit--disabled {
        }
      `}</style>
      <div className={'form'}>12</div>
      <div>22</div>
      {/* <style jsx>{`
        div {
          background: green;
        }
      `}</style> */}
    </>
  )
}
