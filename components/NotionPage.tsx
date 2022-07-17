/** @jsxImportSource @emotion/react */
import { css, darken, useTheme } from '@mui/material'
import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
// import cs from 'classnames'
import { useRouter } from 'next/router'
import { useSearchParam } from 'react-use'
// import BodyClassName from 'react-body-classname'
import { PageBlock } from 'notion-types'

import TweetEmbed from 'react-tweet-embed'

// core notion renderer
import { NotionRenderer } from 'react-notion-x'

// utils
import { getBlockTitle, getPageProperty, formatDate } from 'notion-utils'
import { mapPageUrl, getCanonicalPageUrl } from 'lib/map-page-url'
import { mapImageUrl } from 'lib/map-image-url'
import { searchNotion } from 'lib/search-notion'
// import { useDarkMode } from 'lib/use-dark-mode'
import * as types from 'lib/types'
import * as config from 'lib/config'

// components
import { Loading } from './Loading'
import { Page404 } from './Page404'
import { PageHead } from './PageHead'
import { PageAside } from './PageAside'

import { NotionPageHeader } from './NotionPageHeader'

// import styles from './styles.module.css'

// -----------------------------------------------------------------------------
// dynamic imports for optional components
// -----------------------------------------------------------------------------

const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then(async (m) => {
    // add / remove any prism syntaxes here
    await Promise.all([
      import('prismjs/components/prism-markup-templating.js'),
      import('prismjs/components/prism-markup.js'),
      import('prismjs/components/prism-bash.js'),
      import('prismjs/components/prism-c.js'),
      import('prismjs/components/prism-cpp.js'),
      import('prismjs/components/prism-csharp.js'),
      import('prismjs/components/prism-docker.js'),
      import('prismjs/components/prism-java.js'),
      import('prismjs/components/prism-js-templates.js'),
      import('prismjs/components/prism-coffeescript.js'),
      import('prismjs/components/prism-diff.js'),
      import('prismjs/components/prism-git.js'),
      import('prismjs/components/prism-go.js'),
      import('prismjs/components/prism-graphql.js'),
      import('prismjs/components/prism-handlebars.js'),
      import('prismjs/components/prism-less.js'),
      import('prismjs/components/prism-makefile.js'),
      import('prismjs/components/prism-markdown.js'),
      import('prismjs/components/prism-objectivec.js'),
      import('prismjs/components/prism-ocaml.js'),
      import('prismjs/components/prism-python.js'),
      import('prismjs/components/prism-reason.js'),
      import('prismjs/components/prism-rust.js'),
      import('prismjs/components/prism-sass.js'),
      import('prismjs/components/prism-scss.js'),
      import('prismjs/components/prism-solidity.js'),
      import('prismjs/components/prism-sql.js'),
      import('prismjs/components/prism-stylus.js'),
      import('prismjs/components/prism-swift.js'),
      import('prismjs/components/prism-wasm.js'),
      import('prismjs/components/prism-yaml.js')
    ])
    return m.Code
  })
)

const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
)
const Pdf = dynamic(
  () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
  {
    ssr: false
  }
)
const Modal = dynamic(
  () =>
    import('react-notion-x/build/third-party/modal').then((m) => {
      m.Modal.setAppElement('.notion-viewport')
      return m.Modal
    }),
  {
    ssr: false
  }
)

const Tweet = ({ id }: { id: string }) => {
  return <TweetEmbed tweetId={id} />
}

const propertyLastEditedTimeValue = (
  { block, pageHeader },
  defaultFn: () => React.ReactNode
) => {
  if (pageHeader && block?.last_edited_time) {
    return `Last updated ${formatDate(block?.last_edited_time, {
      month: 'long'
    })}`
  }

  return defaultFn()
}

const propertyDateValue = (
  { data, schema, pageHeader },
  defaultFn: () => React.ReactNode
) => {
  if (pageHeader && schema?.name?.toLowerCase() === 'published') {
    const publishDate = data?.[0]?.[1]?.[0]?.[1]?.start_date

    if (publishDate) {
      return `Published ${formatDate(publishDate, {
        month: 'long'
      })}`
    }
  }

  return defaultFn()
}

const propertyTextValue = (
  { schema, pageHeader },
  defaultFn: () => React.ReactNode
) => {
  if (pageHeader && schema?.name?.toLowerCase() === 'author') {
    return <b>{defaultFn()}</b>
  }

  return defaultFn()
}

export const NotionPage: React.FC<types.PageProps> = ({
  site,
  recordMap,
  error,
  pageId
}) => {
  const router = useRouter()
  const theme = useTheme()
  const lite = useSearchParam('lite')

  const components = React.useMemo(
    () => ({
      nextImage: Image,
      nextLink: Link,
      Code,
      Collection,
      Equation,
      Pdf,
      Modal,
      Tweet,
      Header: NotionPageHeader,
      propertyLastEditedTimeValue,
      propertyTextValue,
      propertyDateValue
    }),
    []
  )

  // lite mode is for oembed
  const isLiteMode = lite === 'true'

  const siteMapPageUrl = React.useMemo(() => {
    const params: any = {}
    if (lite) params.lite = lite

    const searchParams = new URLSearchParams(params)
    return mapPageUrl(site, recordMap, searchParams)
  }, [site, recordMap, lite])

  const keys = Object.keys(recordMap?.block || {})
  const block = recordMap?.block?.[keys[0]]?.value

  // const isRootPage =
  //   parsePageId(block?.id) === parsePageId(site?.rootNotionPageId)
  const isBlogPost =
    block?.type === 'page' && block?.parent_table === 'collection'

  const showTableOfContents = !!isBlogPost
  const minTableOfContentsItems = 3

  const pageAside = React.useMemo(
    () => <PageAside block={block} recordMap={recordMap} isBlogPost />,
    [block, recordMap]
  )

  if (router.isFallback) {
    return <Loading />
  }

  if (error || !site || !block) {
    return <Page404 site={site} pageId={pageId} error={error} />
  }

  const title = getBlockTitle(block, recordMap) || site.name

  // console.log('notion page', {
  //   isDev: config.isDev,
  //   title,
  //   pageId,
  //   rootNotionPageId: site.rootNotionPageId,
  //   recordMap
  // })

  if (!config.isServer) {
    // add important objects to the window global for easy debugging
    const g = window as any
    g.pageId = pageId
    g.recordMap = recordMap
    g.block = block
  }

  const canonicalPageUrl =
    !config.isDev && getCanonicalPageUrl(site, recordMap)(pageId)

  const socialImage = mapImageUrl(
    getPageProperty<string>('Social Image', block, recordMap) ||
      (block as PageBlock).format?.page_cover ||
      config.defaultPageCover,
    block
  )

  const socialDescription =
    getPageProperty<string>('Description', block, recordMap) ||
    config.description

  return (
    <>
      <PageHead
        pageId={pageId}
        site={site}
        title={title}
        description={socialDescription}
        image={socialImage}
        url={canonicalPageUrl}
      />

      <div
        css={css`
          position: relative;
          /* overflow-x: hidden; */

          background: ${theme.palette.background.default};
          .notion-collection-card-body {
            background: ${theme.palette.background.paper};
          }
          svg.notion-page-icon {
            background-color: ${theme.palette.divider};
            border-radius: 10rem;
            path {
              display: none;
            }
          }
          .notion-collection-card-cover {
            background: ${theme.palette.background.paper};
            border-bottom: none;
          }
          .notion-collection-row {
            border-bottom: 1px solid ${theme.palette.divider};
          }
          .notion-gallery-grid {
            border-top: 1px solid ${theme.palette.divider};
          }
          .notion-asset-wrapper iframe {
            background: ${theme.palette.background.default};
          }
          .breadcrumb:hover {
            border: none;
            outline: none;
          }
          .notion-header {
            background: rgba(0, 0, 0, 0);
            backdrop-filter: blur(1rem) brightness(0.8);
            position: fixed;
            bottom: 0;
            left: 0;
            top: auto;
            width: 100%;
            .notion-nav-header .breadcrumbs {
              /* width: 100%; */
              overflow-x: scroll;
            }
            .notion-search-button {
              @media only screen and (max-width: 800px) {
                span {
                  display: none;
                }
              }
            }
            /* display: none; */
          }
          .dark-mode {
            background-color: ${theme.palette.background.default};
          }
          .notion-title {
            text-align: center;
            font-size: 3rem;
            /* font-family: "Product Sans", sans-serif; */
          }
          .notion-page-title-text {
            /* font-family: "Product Sans", sans-serif; */
            font-family: 'Circular Std', sans-serif;
          }
          .notion-page-title-icon,
          .notion-page-icon,
          .notion-page-icon-span {
            font-family: 'Times New Roman', Times, serif;
            text-align: center;
          }

          .notion-page-icon-wrapper {
            padding: 0 1rem;
            justify-content: center;
            /* justify-content: flex-start; */
            .notion-page-icon {
              /* border-radius: 50%; */
              overflow: hidden;
            }
          }
          .notion-page-cover {
            background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7));
          }
          .notion-file-icon {
            color: ${theme.palette.primary.main};
            fill: ${theme.palette.primary.main};
          }
          .notion-hr {
            border-color: ${theme.palette.divider};
          }
          .notion-page {
            padding-left: 1.6rem;
            padding-right: 1.6rem;
          }
          .notion-code {
            font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
              monospace;
          }
          .notion-page-title-text {
            border-bottom: 1px solid #494949;
          }
          .notion-text {
            color: ${theme.palette.text.secondary};
          }
          .notion-text a.notion-link {
            /* color: ${theme.palette.text.secondary}; */
            /* border-bottom: 1px solid ${theme.palette.primary.main}; */
            /* opacity: 0.9; */
          }
          .notion-page-link {
            color: inherit;
            font-family: inherit;
          }
          .notion-page-link:hover {
            outline-offset: -1px;
            /* outline: 1px solid ${darken(theme.palette.primary.main, 0.6)}; */
            background-color: ${theme.palette.background.paper};
            border-radius: 4px;
          }
          .notion-collection-card-cover-empty {
            background-color: ${theme.palette.background.paper};
          }
          .notion-property-multi_select-item {
            /* outline-offset: -1px; */
            /* padding: 1rem; */
            outline: 1px solid ${darken(theme.palette.primary.main, 0.5)};
          }
          .notion-collection-page-properties .notion-collection-row-body {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            grid-auto-flow: column;
            @media only screen and (max-width: 800px) {
              display: flex;
            }
          }
          .notion-aside {
            background: rgba(0, 0, 0, 0);
            position: sticky;
            top: 148px;
            left: 0;
            z-index: 101;
            display: flex;
          }
          .notion-aside-table-of-contents {
            /* background: ${theme.palette.background.default}; */
            background: rgba(0, 0, 0, 0);
          }
          .notion-aside-table-of-contents-header {
            align-self: flex-start;
          }
          .notion-table-of-contents-active-item {
            color: ${theme.palette.primary.main} !important;
          }
          .notion-external-block {
            border: 1px solid ${theme.palette.divider};
          }
        `}
      >
        <NotionRenderer
          darkMode
          components={components}
          recordMap={recordMap}
          rootPageId={site.rootNotionPageId}
          rootDomain={site.domain}
          fullPage={!isLiteMode}
          previewImages={!!recordMap.preview_images}
          showCollectionViewDropdown={false}
          showTableOfContents={true || showTableOfContents}
          minTableOfContentsItems={minTableOfContentsItems}
          defaultPageIcon={config.defaultPageIcon}
          defaultPageCover={config.defaultPageCover}
          defaultPageCoverPosition={config.defaultPageCoverPosition}
          mapPageUrl={siteMapPageUrl}
          mapImageUrl={mapImageUrl}
          searchNotion={config.isSearchEnabled ? searchNotion : null}
          pageAside={pageAside}
        />
      </div>
    </>
  )
}
