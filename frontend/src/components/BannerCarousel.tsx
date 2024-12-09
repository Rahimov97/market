import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

const banners = [
  {
    img: 'https://via.placeholder.com/720x300/FFDD2D/000000?text=Banner+1',
  },
  {
    img: 'https://via.placeholder.com/720x300/FF5733/FFFFFF?text=Banner+2',
  },
  {
    img: 'https://via.placeholder.com/720x300/337AFF/FFFFFF?text=Banner+3',
  },
  {
    img: 'https://via.placeholder.com/720x300/FF33FF/FFFFFF?text=Banner+4',
  },
  {
    img: 'https://via.placeholder.com/720x300/33FF33/000000?text=Banner+5',
  },
];

const BannerCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getLeftIndex = () => (currentIndex - 1 + banners.length) % banners.length;
  const getRightIndex = () => (currentIndex + 1) % banners.length;

  return (
    <Box
      position="relative"
      width="100%"
      height="350px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      {/* Центральный баннер */}
      <Box
        component="div"
        sx={{
          position: 'absolute',
          width: '720px',
          height: '300px',
          backgroundImage: `url(${banners[currentIndex].img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '8px',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
          zIndex: 3,
          transition: 'all 0.5s ease',
        }}
      />

      {/* Левый баннер */}
      <Box
        component="div"
        sx={{
          position: 'absolute',
          width: '360px',
          height: '300px',
          backgroundImage: `url(${banners[getLeftIndex()].img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'left',
          borderRadius: '8px',
          opacity: 0.6,
          filter: 'blur(0.5px)',
          left: '11.7%',
          zIndex: 2,
          clipPath: 'polygon(0% 0, 100% 0, 100% 100%, 0% 100%)',
          cursor: 'pointer',
          transition: 'all 0.5s ease',
        }}
        onClick={() => setCurrentIndex(getLeftIndex())}
      />

      {/* Правый баннер */}
      <Box
        component="div"
        sx={{
          position: 'absolute',
          width: '360px',
          height: '300px',
          backgroundImage: `url(${banners[getRightIndex()].img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right',
          borderRadius: '8px',
          opacity: 0.6,
          filter: 'blur(0.5px)',
          right: '11.7%',
          zIndex: 2,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          cursor: 'pointer',
          transition: 'all 0.5s ease',
        }}
        onClick={() => setCurrentIndex(getRightIndex())}
      />
    </Box>
  );
};

export default BannerCarousel;
