import Typography from '@material-ui/core/Typography';

import styled from 'styled-components';

const TypographyHeader = styled(Typography).attrs({
  variant: 'h3',
  align: 'center',
  color: 'secondary',
})`
  text-align: left;
  padding: 10px;
  font-weight: 800;
  font-size: 48px;
`;

export default TypographyHeader;
