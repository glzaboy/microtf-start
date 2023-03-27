import { IconButton, Toolbar, Button, Container, Box } from '@mui/material';
import logo from '@/public/logo.svg';
import Image from 'next/image';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SettingsIcon from '@mui/icons-material/Settings';

const Header = () => {
  return (
    <div>
      <Toolbar
        sx={{
          width: 1,
          border: '0,0,1',
          boxShadow: 1,
        }}
      >
        <Container
          maxWidth="xl"
          style={{ alignItems: 'center', verticalAlign: 'bottom' }}
        >
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            sx={{ display: 'none' }}
          >
            <HomeOutlinedIcon />
          </IconButton>
          <Box component={'span'}>
            <Image src={logo} alt={''} />
          </Box>
          {/* <Typography component={'span'} sx={{ alignContent: 'center' }}>
            <span>{'Microtf'}</span>
          </Typography> */}
          <Box component={'span'}>
            <Button size="small">首页</Button>
            <Button size="medium">博客</Button>
            <Button size="large">关于</Button>
          </Box>
          <Box component={'span'} sx={{ float: 'right' }}>
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        </Container>
      </Toolbar>
      <br style={{ clear: 'both' }} />
    </div>
  );
};
export default Header;
