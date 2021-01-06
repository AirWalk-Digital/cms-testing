import matter from 'gray-matter'
// import { useJsonForm } from 'next-tinacms-json'

import { getGithubPreviewProps, parseJson } from 'next-tinacms-github'
import { GetStaticProps } from 'next'
import { usePlugin } from 'tinacms'
import { useGithubJsonForm, useGithubToolbarPlugins} from 'react-tinacms-github'

import Layout from '../components/Layout'
import BlogList from '../components/BlogList'

export default function Home({ file, allBlogs }) {
  const formOptions = {
    label: 'Site Config',
    fields: [
      {
        name: 'title',
        label: 'Site Title',
        component: 'text',
      },
      {
        name: 'description',
        label: 'Site Description',
        component: 'text',
      },
      {
        name: 'repositoryUrl',
        label: 'Repository Url',
        component: 'text',
      },
    ],
  }
  const [data, form] = useGithubJsonForm(file, formOptions)
  usePlugin(form)
  useGithubToolbarPlugins()
  return (
    <Layout
      pathname="/"
      siteTitle={data.title}
      siteDescription={data.description}
    >
      <section>
        <BlogList allBlogs={allBlogs} />
      </section>
    </Layout>
  )
}

// export default Index

Home.getInitialProps = async function() {
  const content = await import(`../data/config.json`)
  // get all blog data for list
  const posts = (context => {
    const keys = context.keys()
    const values = keys.map(context)
    const data = keys.map((key, index) => {
      // Create slug from filename
      const slug = key
        .replace(/^.*[\\\/]/, '')
        .split('.')
        .slice(0, -1)
        .join('.')
      const value = values[index]
      // Parse yaml metadata & markdownbody in document
      const document = matter(value.default)
      return {
        document,
        slug,
      }
    })
    return data
  })(require.context('../posts', true, /\.md$/))

  return {
    file: {
      fileRelativePath: `data/config.json`,
      data: content.default,
    },

    allBlogs: posts,
  }
}



// export const getStaticProps: GetStaticProps = async function ({
//   preview,
//   previewData,
// }) {

//   //   // get all blog data for list
//   const posts = (context => {
//     const keys = context.keys()
//     const values = keys.map(context)
//     const data = keys.map((key, index) => {
//       // Create slug from filename
//       const slug = key
//         .replace(/^.*[\\\/]/, '')
//         .split('.')
//         .slice(0, -1)
//         .join('.')
//       const value = values[index]
//       // Parse yaml metadata & markdownbody in document
//       const document = matter(value.default)
//       return {
//         document,
//         slug,
//       }
//     })
//     return data
//    })(require.context('../posts', true, /\.md$/))

//   console.log(posts)

//   if (preview) {
//     return getGithubPreviewProps({
//       ...previewData,
//       fileRelativePath: 'data/config.json',
//       parse: parseJson,
//       allBlogs: posts,

//     })
//   }
//   return {
//     props: {
//       sourceProvider: null,
//       error: null,
//       preview: false,
//       file: {
//         fileRelativePath: 'data/config.json',
//         data: (await import('../data/config.json')).default,
//       },
//       allBlogs: posts,
//     },
//   }
// }