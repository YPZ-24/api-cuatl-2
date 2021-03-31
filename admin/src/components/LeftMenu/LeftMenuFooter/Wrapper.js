import styled from 'styled-components';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  background: #f5f5f5;
  bottom: 0;
  .poweredBy {
    width: 100%;
    bottom: 0;
    height: 3rem;
    padding-left: 15px;
    padding-right: 15px;
    line-height: 3rem;
    background-color: #f5f5f5;
    font-size: 1rem;
    font-weight: 400;
    letter-spacing: 0.05rem;
    vertical-align: middle;
    color: #c0c0c0
    ;
  }
`;

Wrapper.defaultProps = {
  theme: {
    main: {
      colors: {
        strapi: {},
      },
      sizes: {
        header: {},
        leftMenu: {},
      },
    },
  },
};

Wrapper.propTypes = {
  theme: PropTypes.object,
};

export default Wrapper;
