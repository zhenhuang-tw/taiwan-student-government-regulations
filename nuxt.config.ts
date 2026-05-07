// https://nuxt.com/docs/api/configuration/nuxt-config
const baseURL = 'https://student-regs.zhenhuang.tw/'
const siteNameCh = '臺灣學生自治規章彙編'
const repoURL = 'https://github.com/zhenhuang-tw/taiwan-student-government-regulations'

export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@nuxt/content'
  ],
  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-TW',
        'data-color-mode': '' // 用於配合 color-mode 套件
      },
      title: siteNameCh,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '蒐集臺灣各校學生自治組織規章，包含歷史版本。' }
      ],
      link: [
        { rel: 'apple-touch-icon', sizes: '180x180', href: baseURL+'apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: baseURL+'favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: baseURL+'favicon-16x16.png' },
        { rel: 'manifest', href: baseURL+'site.webmanifest' },
        { rel: 'icon', type: 'image/x-icon', href: baseURL+'favicon.ico' }
      ]
    },
    
    
  },
  appConfig: {
    siteName: siteNameCh,
    repoURL: repoURL
  },

  // 為了靜態生成 (SSG)，啟用 SSR，這樣 nuxt generate 才能產出 HTML
  ssr: true,

  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true, // 確保爬蟲抓取所有連結頁面
      failOnError: false, // 容許部分資源錯誤（如外部圖片）而不中斷部署
    }
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.ts',
    exposeConfig: false,
    viewer: true,
  },
  css: [
    '~/assets/css/main.css', // Ensure your main CSS is included
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  compatibilityDate: '2025-02-17' // 確保 Content V3 相容性日期
})