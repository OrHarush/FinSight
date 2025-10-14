import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, useTheme, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from 'react-country-flag';
import Row from '@/components/layout/Containers/Row';

const LanguageSelect = () => {
  const theme = useTheme();
  const { i18n } = useTranslation('common');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    handleClose();
  };

  const LANGUAGES = [
    { code: 'en', label: 'English', flag: 'GB' },
    { code: 'he', label: 'עברית', flag: 'IL' },
  ];

  const currentLanguage = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];
  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          width: 40,
          height: 40,
          backgroundColor: theme.palette.background.paper,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <ReactCountryFlag
          countryCode={currentLanguage.flag}
          svg
          style={{
            fontSize: '1em',
            borderRadius: '4px',
          }}
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            minWidth: 160,
            mt: 1,
          },
        }}
      >
        {LANGUAGES.map(lang => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={lang.code === i18n.language}
            sx={{
              py: 1.5,
              px: 2,
            }}
          >
            <Row spacing={1.5} alignItems="center">
              <ReactCountryFlag
                countryCode={lang.flag}
                svg
                style={{
                  fontSize: '1.5em',
                  borderRadius: '4px',
                }}
              />
              <Typography variant="body2" fontWeight={500}>
                {lang.label}
              </Typography>
            </Row>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSelect;
