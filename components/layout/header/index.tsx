import { IconButton, Toolbar, Button, Container, Box } from '@mui/material';
import logo from '@/public/logo.svg';
import Image from 'next/image';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import WebLink from '@/components/base/WebLink';

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
            <Image
              src={logo}
              alt={''}
              width={24}
              height={24}
              style={{ verticalAlign: 'middle', cursor: 'pointer' }}
            />
          </Box>
          <Box component={'span'} sx={{ pl: 2 }}>
            <WebLink pathname="/" link={{ underline: 'none' }}>
              <Button size="medium">首页</Button>
            </WebLink>
            <WebLink pathname="/" link={{ underline: 'none' }}>
              <Button size="large">关于</Button>
            </WebLink>
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
