import styled from 'styled-components'
import { useRouter } from 'next/router'

import * as React from 'react'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import { formatDate } from 'utils'
import { Button } from 'components/ui/Button'
import Error from 'next/error'
import { usePlugin, useCMS } from 'tinacms'
import { useGithubMarkdownForm } from 'react-tinacms-github'
import Layout from 'components/layout/Layout'
import { MarkdownContent } from 'components/layout/MarkdownContent'
import { CloseIcon, EditIcon } from '@tinacms/icons'
import { getMarkdownPreviewProps } from 'utils/getMarkdownPreviewProps'
const fg = require('glob')
import { fileToUrl } from 'utils/urls'
import { InlineWysiwyg } from 'components/layout/inline-wysiwyg'
import { InlineGithubForm } from 'components/layout/InlineGithubForm'
import { getDocProps } from 'utils/docs/getDocProps'
import { GithubError } from 'next-tinacms-github'
import { NotFoundError } from 'utils/error/NotFoundError'

export default function BlogTemplate(props) {
  // fallback workaround
  // if (!file) {
  //   return <Error statusCode={404} />
  // }
  // const router = useRouter()
  // if (!file?.slug) {
  //   return <Error statusCode={404} />
  // }
  
  const [data, form] = useGithubMarkdownForm(props.file, formOptions)
  usePlugin(form)
  // useLastEdited(form)

  const frontmatter = data.frontmatter
  const markdownBody = data.markdownBody
  const excerpt = data.excerpt
   

  function reformatDate(fullDate) {
    const date = new Date(fullDate)
    return date.toDateString().slice(4)
  }

  return (
    <InlineGithubForm form={form}>
    <Layout siteTitle='temp'>

      <article className="blog">
        <EditLink/>
        <figure className="blog__hero">
          <img
            src={frontmatter.hero_image}
            alt={`blog_hero_${frontmatter.title}`}
          />
        </figure>
        <div className="blog__info">
          <h1>{frontmatter.title}</h1>
          <h3>{reformatDate(frontmatter.date)}</h3>
        </div>
        <div className="blog__body">
          {/* <ReactMarkdown source={markdownBody} /> */}
          <InlineWysiwyg
              name="markdownBody"
              imageProps={{
                uploadDir: () => '/img/blog',
                parse: media => `/img/blog/${media.filename}`,
              }}
            >
              <MarkdownContent escapeHtml={false} content={markdownBody} />
            </InlineWysiwyg>
        </div>
        <h2 className="blog__footer">Written By: {frontmatter.author}</h2>
      </article>
      <style jsx>
        {`
          .blog h1 {
            margin-bottom: 0.7rem;
          }

          .blog__hero {
            min-height: 300px;
            height: 60vh;
            width: 100%;
            margin: 0;
            overflow: hidden;
          }
          .blog__hero img {
            margin-bottom: 0;
            object-fit: cover;
            min-height: 100%;
            min-width: 100%;
            object-position: center;
          }

          .blog__info {
            padding: 1.5rem 1.25rem;
            width: 100%;
            max-width: 768px;
            margin: 0 auto;
          }
          .blog__info h1 {
            margin-bottom: 0.66rem;
          }
          .blog__info h3 {
            margin-bottom: 0;
          }

          .blog__body {
            width: 100%;
            padding: 0 1.25rem;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .blog__body a {
            padding-bottom: 1.5rem;
          }
          .blog__body:last-child {
            margin-bottom: 0;
          }
          .blog__body h1 h2 h3 h4 h5 h6 p {
            font-weight: normal;
          }
          .blog__body p {
            color: inherit;
          }
          .blog__body ul {
            list-style: initial;
          }
          .blog__body ul ol {
            margin-left: 1.25rem;
            margin-bottom: 1.25rem;
            padding-left: 1.45rem;
          }

          .blog__footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 1.25rem;
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
          }
          .blog__footer h2 {
            margin-bottom: 0;
          }
          .blog__footer a {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .blog__footer a svg {
            width: 20px;
          }

          @media (min-width: 768px) {
            .blog {
              display: flex;
              flex-direction: column;
            }
            .blog__body {
              max-width: 800px;
              padding: 0 2rem;
            }
            .blog__body span {
              width: 100%;
              margin: 1.5rem auto;
            }
            .blog__body ul ol {
              margin-left: 1.5rem;
              margin-bottom: 1.5rem;
            }
            .blog__hero {
              min-height: 600px;
              height: 75vh;
            }
            .blog__info {
              text-align: center;
              padding: 2rem 0;
            }
            .blog__info h1 {
              max-width: 500px;
              margin: 0 auto 0.66rem auto;
            }
            .blog__footer {
              padding: 2.25rem;
            }
          }

          @media (min-width: 1440px) {
            .blog__hero {
              height: 70vh;
            }
            .blog__info {
              padding: 3rem 0;
            }
            .blog__footer {
              padding: 2rem 2rem 3rem 2rem;
            }
          }
        `}
      </style>
    </Layout>
    </InlineGithubForm>
  )
}


const formOptions = {
  label: 'Blog Page',
  fields: [
    {
      label: 'Hero Image',
      name: 'frontmatter.hero_image',
      component: 'image',
      // Generate the frontmatter value based on the filename
      parse: media => `/static/${media.filename}`,

      // Decide the file upload directory for the post
      uploadDir: () => '/public/static/',

      // Generate the src attribute for the preview image.
      previewSrc: fullSrc => fullSrc.replace('/public', ''),
    },
    {
      name: 'frontmatter.title',
      label: 'Title',
      component: 'text',
    },
    {
      name: 'frontmatter.date',
      label: 'Date',
      component: 'date',
    },
    {
      name: 'frontmatter.author',
      label: 'Author',
      component: 'text',
    },
    {
      name: 'markdownBody',
      label: 'Blog Body',
      component: 'markdown',
    },
  ],
}

export const getStaticProps: GetStaticProps = async function(props) {
  let { slug: slugs } = props.params

  // @ts-ignore This should maybe always be a string[]?
  const slug = slugs.join('/')
  console.log(slug)

  try {
    return await getDocProps(props, slug)
  } catch (e) {
    if (e instanceof GithubError) {
      console.log("getDocProps: GithubError")
      return {
        props: {
          error: { ...e }, //workaround since we cant return error as JSON
        },
      }
    } else if (e instanceof NotFoundError) {
      console.log("getDocProps: NotFoundError")
      return {
        props: {
          notFound: true,
        },
      }
    }
  }
}

export const getStaticPaths: GetStaticPaths = async function() {
  const fg = require('fast-glob')
  const contentDir = './posts/'
  const files = await fg(`${contentDir}**/*.md`)
  // console.log(files)
  return {
    fallback: 'blocking',
    paths: files
      // .filter(file => !file.endsWith('index.md'))
      .map(file => {
        const path = file.substring(contentDir.length, file.length - 3)
        return { params: { slug: path.split('/') } }
      }),
  }
}


// export async function getStaticProps({ ctx }) {
// // BlogTemplate.getInitialProps = async function(ctx) {
//   const { slug } = ctx.params
//   console.log(slug)

//   const content = await import(`../../posts/${slug}.md`)
//   // const config = await import(`../../data/config.json`)
//   const data = matter(content.default)
//   return {
//     markdownFile: {
//       fileRelativePath: `posts/${slug}.md`,
//       frontmatter: data.data,
//       markdownBody: data.content,
//     },
//     title: '',
//   }
// }


// export async function getStaticProps({ preview,
//   previewData,
//   ...ctx }) {

//   const { slug } = ctx.params

//   //TODO - move to readFile
//   // const { default: siteConfig } = await import('../../content/siteConfig.json')
//   const currentBlog = await getMarkdownPreviewProps(
//     `posts/${slug}.md`,
//     preview,
//     previewData
//   )
//   console.log("slug: " + slug)
//   console.log(currentBlog)

//   if ((currentBlog.props.error?.status || '') === 'ENOENT') {
//     return { props: {} } // will render the 404 error
//   }

//   return {
//     props: {
//       ...currentBlog.props,
//       siteConfig: { title: "site title" },
//     },
//   }
// }

// export const getStaticPaths: GetStaticPaths = async function() {
//   const blogs = await fg(`./posts/*.md`)
//   // console.log(blogs)
//   // console.log(blogs.map(file => {
//   //   // console.log(file)
//   //   const slug = fileToUrl(file, 'posts')
//   //   // const slug = file.split('/')
//   //   return { params: { slug } }
//   // }))

//   return {
//     paths: blogs.map(file => {
//       // console.log(file)
//       const slug = fileToUrl(file, 'posts')
//       // const slug = file.split('/')
//       return { params: { slug } }
//         }),
//     fallback: true,
//   }
// }

// export const getStaticPaths: GetStaticPaths = async function() {
//   const blogs = await fg(`./posts/**/*.md`)
//   return {
//     paths: blogs.map(file => {
//       const slug = fileToUrl(file)
//       return { params: { slug } }
//     }),
//     fallback: false,
//   }
// }

/*
 ** Edit Button ------------------------------------------------------
 */

const EditLink = () => {
  const cms = useCMS()

  return (
    <EditButton id="OpenAuthoringBlogEditButton" onClick={cms.toggle}>
      {cms.enabled ? <CloseIcon /> : <EditIcon />}
      {cms.enabled ? 'Exit Edit Mode' : 'Edit This Post'}
    </EditButton>
  )
}

const EditButton = styled(Button)`
  background: none;
  display: flex;
  align-items: center;
  border: 1px solid var(--color-primary);
  padding: 0 1.25rem;
  height: 45px;
  color: var(--color-primary);
  transition: all 150ms ease-out;
  transform: translate3d(0px, 0px, 0px);
  svg {
    fill: currentColor;
    margin: 0 4px 0 -4px;
  }
`