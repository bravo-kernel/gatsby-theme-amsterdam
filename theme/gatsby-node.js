const path = require(`path`)
const fs = require(`fs`)
const mkdirp = require(`mkdirp`)
const _ = require(`lodash`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const { paginate } = require(`gatsby-awesome-pagination`)

// Ensure that content directory exist at the site-level
exports.onPreBootstrap = ({ store }, themeOptions) => {
  const { program } = store.getState()
  const contentPath = themeOptions.contentPath || `content`
  const dirs = [path.join(program.directory, contentPath)]
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      mkdirp.sync(dir)
    }
  })
}

// Schema Customization
exports.sourceNodes = ({ actions, schema }) => {
  const { createTypes } = actions
  createTypes(`
    type Frontmatter @infer {
      title: String
      date: Date @dateformat
      cover: File @fileByRelativePath
      tags: [String]
    }
    type Fields @infer {
      slug: String
    }
    type MarkdownRemark implements Node @infer {
      frontmatter: Frontmatter
      fields: Fields
    }
  `)
}

// Create Pages
exports.createPages = async ({ graphql, actions, reporter }, themeOptions) => {
  const { createPage } = actions
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                tags
                cover {
                  childImageSharp {
                    fluid(maxWidth: 1000) {
                      aspectRatio
                      src
                      srcSet
                      srcWebp
                      srcSetWebp
                      sizes
                    }
                  }
                }
              }
            }
          }
        }
      }
    `
  )
  if (result.errors) {
    reporter.panic(result.errors)
  }
  const posts = result.data.allMarkdownRemark.edges

  // Create individual post pages
  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node
    createPage({
      path: post.node.fields.slug,
      component: require.resolve(`./src/templates/post`),
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  })

  // Create posts list page and paginate
  const basePath = themeOptions.basePath || `/`
  const postsPerPage = themeOptions.postsPerPage || 6
  const grid = themeOptions.grid || `basic`
  paginate({
    createPage,
    items: posts,
    itemsPerPage: postsPerPage,
    pathPrefix: basePath,
    component: require.resolve(`./src/templates/posts`),
    context: {
      grid: grid,
    },
  })

  // Create tag pages and paginate
  let tags = []
  _.each(posts, post => {
    if (_.get(post, 'node.frontmatter.tags')) {
      tags = tags.concat(post.node.frontmatter.tags)
    }
  })
  tags = _.uniq(tags)
  tags.forEach(tag => {
    const postsWithTag = posts.filter(
      post =>
        post.node.frontmatter.tags &&
        post.node.frontmatter.tags.indexOf(tag) !== -1
    )
    paginate({
      createPage,
      items: postsWithTag,
      itemsPerPage: postsPerPage,
      pathPrefix: `${basePath}tag/${_.kebabCase(tag)}`,
      component: require.resolve(`./src/templates/tag`),
      context: {
        tag,
        grid: grid,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
