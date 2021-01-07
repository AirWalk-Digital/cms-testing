import React from 'react'
import App from 'next/app'
import { TinaProvider, TinaCMS } from 'tinacms'
import {
  GithubClient,
  TinacmsGithubProvider,
  GithubMediaStore,
} from 'react-tinacms-github'
// import { GitClient, GitMediaStore } from '@tinacms/git-client'
import { MarkdownFieldPlugin } from 'react-tinacms-editor'
import { DateFieldPlugin } from 'react-tinacms-date'
import { BrowserStorageApi } from 'utils/plugins/BrowserStorageApi'
// import { BlogPostCreatorPlugin } from 'plugins/BlogPostCreator'

export default class Site extends App {
  cms: TinaCMS

  constructor(props) {
    super(props)

    const github = new GithubClient({
      proxy: '/api/proxy-github',
      authCallbackRoute: '/api/create-github-access-token',
      clientId: process.env.GITHUB_CLIENT_ID,
      baseRepoFullName: process.env.BASE_REPO_FULL_NAME, // e.g: tinacms/tinacms.org,
      baseBranch: process.env.BASE_BRANCH, // e.g. 'master' or 'main' on newer repos
      authScope: 'repo' // normally defaults to 'public_repo'

    })
    this.cms = new TinaCMS({
      // enabled: process.env.NODE_ENV === 'development',
      enabled: !!props.pageProps.preview,
      // sidebar: {
      //   position: 'overlay',
      // },
      apis: {
        github,
        storage:
        typeof window !== 'undefined'
          ? new BrowserStorageApi(window.localStorage)
          : {},
      },
      media: new GithubMediaStore(github),
      /**
       * 4. Use the Sidebar and Toolbar
       */
      sidebar: props.pageProps.preview,
      toolbar: props.pageProps.preview,
    })

    this.cms.plugins.add(MarkdownFieldPlugin)
    this.cms.plugins.add(DateFieldPlugin)
    // this.cms.plugins.add(BlogPostCreatorPlugin)
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <TinaProvider cms={this.cms}>
        <TinacmsGithubProvider
          onLogin={onLogin}
          onLogout={onLogout}
          error={pageProps.error}
        >
          {/* <EditLink cms={this.cms} /> */}
          <Component {...pageProps} />
        </TinacmsGithubProvider>
      </TinaProvider>
    )
  }
}

const onLogin = async () => {
  const token = localStorage.getItem('tinacms-github-token') || null
  const headers = new Headers()

  if (token) {
    headers.append('Authorization', 'Bearer ' + token)
  }

  const resp = await fetch(`/api/preview`, { headers: headers })
  const data = await resp.json()

  if (resp.status == 200) window.location.href = window.location.pathname
  else throw new Error(data.message)
}

const onLogout = () => {
  return fetch(`/api/reset-preview`).then(() => {
    window.location.reload()
  })
}

export interface EditLinkProps {
  cms: TinaCMS
}

// export const EditLink = ({ cms }: EditLinkProps) => {
//   return (
//     <button onClick={() => cms.toggle()}>
//       {cms.enabled ? 'Exit Edit Mode' : 'Edit This Site'}
//     </button>
//   )
// }
