import styled from 'styled-components';

const A = styled.a`
  display: flex;
  position: relative;
  padding-top: 0.7rem;
  padding-bottom: 0.2rem;
  padding-left: 1.6rem;
  min-height: 3.6rem;
  border-left: 0.3rem solid transparent;
  cursor: pointer;
  color: #a3195b;
  text-decoration: none;
  -webkit-font-smoothing: antialiased;

  &:hover {
    color: #1c2d3d;
    background: #ffffff;
    text-decoration: none;
  }

  &:focus {
    color: #1c2d3d;
    background: #ffffff;
    text-decoration: none;
  }

  &:visited {
    color: #a3195b;
  }

  &.linkActive {
    color: #1c2d3d !important;
    background: #ffffff;
  }
`;

export default A;
