import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'
import Img from 'gatsby-image'
import Placeholder from './Placeholder'
const _ = require(`lodash`)

const List = styled.ul`
  margin: 3rem auto;
  max-width: ${props => props.theme.sizes.maxWidth};
  padding: 0 1.5rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  li:first-child {
    border: 0;
    padding-top: 0;
  }
  li:last-child {
    padding-bottom: 0;
    margin-bottom: 2rem;
  }
`

const Cover = styled(Img)`
  transition: opacity 0.4s;
  img {
    transition: transform 0.6s !important;
  }
  &:hover {
    opacity: 0.8;
    img {
      transform: scale(1.03);
    }
  }
  @media (hover: none) {
    opacity: 1 !important;
    img {
      transform: scale(1) !important;
    }
  }
`

const Item = styled.li`
  position: relative;
  display: inline-block;
  flex: 0 100%;
  margin: 0 0 2rem;
  @media screen and (min-width: ${props => props.theme.responsive.small}) {
    margin: 0;
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    padding: 2rem 0;
    border-top: 1px solid ${props => props.theme.colors.border};
  }
  a {
    text-decoration: none;
    transition: color 0.3s;
    color: ${props => props.theme.colors.base};
    &:hover {
      color: ${props => props.theme.colors.highlight};
    }
    @media (hover: none) {
      color: ${props => props.theme.colors.base} !important;
    }
  }
`

const Title = styled.h2`
  font-weight: ${props => props.theme.fonts.boldWeight};
  padding: 0.5rem 0 0 0;
  display: block;
  line-height: 1.25;
  font-size: 1rem;
  @media screen and (min-width: ${props => props.theme.responsive.small}) {
    font-size: 1.1rem;
    padding: 0;
  }
`

const Excerpt = styled.p`
  padding: 0.5rem 0 0 0;
  line-height: 1.5;
  color: ${props => props.theme.colors.secondary};
`

const ImageContainer = styled.div`
  @media screen and (min-width: ${props => props.theme.responsive.small}) {
    flex: 0 34%;
  }
`

const TextContainer = styled.div`
  @media screen and (min-width: ${props => props.theme.responsive.small}) {
    padding: 0 0 0 2rem;
    flex: 0 66%;
  }
`

const AdditionalContainer = styled.div`
  padding: 1rem 0 0;
  line-height: 1.5;
  font-size: 0.9em;
`

const Divider = styled.span`
  margin: 0 0.25rem;
  color: ${props => props.theme.colors.border};
`

const Date = styled.span`
  display: inline-block;
  color: ${props => props.theme.colors.tertiary};
`

const Tag = styled.span`
  display: inline-block;
  margin: 0 0.5rem 0 0;
  text-transform: capitalize;
  a {
    text-decoration: underline;
    color: ${props => props.theme.colors.tertiary};
    @media (hover: none) {
      color: ${props => props.theme.colors.tertiary} !important;
    }
  }
`

const ListGrid = props => {
  return (
    <List>
      {props.posts.map(({ node: post }) => (
        <Item key={post.frontmatter.title}>
          <ImageContainer>
            <Link to={post.fields.slug}>
              {post.frontmatter.cover && (
                <Cover
                  sizes={{
                    ...post.frontmatter.cover.childImageSharp.fluid,
                    aspectRatio: 2 / 1,
                  }}
                  alt={post.frontmatter.cover.childImageSharp.title}
                />
              )}
              {post.frontmatter.cover === null ? (
                <Placeholder aspectRatio={2 / 1} />
              ) : (
                ''
              )}
            </Link>
          </ImageContainer>
          <TextContainer>
            <Link to={post.fields.slug}>
              <Title>{post.frontmatter.title}</Title>
              <Excerpt>{post.excerpt}</Excerpt>
            </Link>
            <AdditionalContainer>
              {post.frontmatter.date && <Date>{post.frontmatter.date}</Date>}
              {post.frontmatter.tags && (
                <>
                  <Divider>/</Divider>
                  {post.frontmatter.tags.map(tag => (
                    <Tag key={tag}>
                      <Link to={`/tag/${_.kebabCase(tag)}/`}>{tag}</Link>
                    </Tag>
                  ))}
                </>
              )}
            </AdditionalContainer>
          </TextContainer>
        </Item>
      ))}
    </List>
  )
}

export default ListGrid
