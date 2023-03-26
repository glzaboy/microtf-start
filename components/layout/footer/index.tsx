import { Box } from '@mui/material';

const Footer = () => {
  return (
    <>
      <Box sx={{ textAlign: 'center', borderTop: '1 solid', p: 2 }}>
        版权所有&copy;{new Date().getFullYear()}
      </Box>
    </>
  );
};
export default Footer;
