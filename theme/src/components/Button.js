import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'

const Wrapper = styled(Link)`
  background: ${props => props.theme.colors.button};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.secondary};
  padding: 0.5rem;
  border-radius: 2px;
  margin: 0 0 0 0.5rem;
  cursor: pointer;
  text-decoration: none;
  transition: 0.3s all;
  &:hover {
    background: ${props => props.theme.colors.highlight};
    border-color: ${props => props.theme.colors.highlight};
    color: white;
  }
  @media (hover: none) {
    background: ${props => props.theme.colors.button} !important;
    color: ${props => props.theme.colors.secondary} !important;
    border-color: ${props => props.theme.colors.border} !important;
  }
`

const Button = props => {
  return <Wrapper {...props}>{props.children}</Wrapper>
}

export default Button
