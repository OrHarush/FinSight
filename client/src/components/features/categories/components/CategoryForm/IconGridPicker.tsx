import { useEffect, useState } from 'react';
import { Box, Grid, IconButton } from '@mui/material';
import * as Icons from '@mui/icons-material';

const ICONS_PER_PAGE = 18;

interface IconGridPickerProps {
  icons: string[];
  value?: string;
  onChange: (icon: string) => void;
}

const IconGridPicker = ({ icons, value, onChange }: IconGridPickerProps) => {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(icons.length / ICONS_PER_PAGE);
  const pagedIcons = icons.slice(page * ICONS_PER_PAGE, (page + 1) * ICONS_PER_PAGE);

  useEffect(() => {
    setPage(0);
  }, [icons]);

  return (
    <>
      <Grid container columns={6} spacing={1}>
        {pagedIcons.map(name => {
          const IconComponent = (Icons as any)[name];

          if (!IconComponent) {
            return null;
          }

          const selected = value === name;

          return (
            <Grid key={name} size={1}>
              <IconButton
                onClick={() => onChange(name)}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  position: 'relative',
                  color: selected ? 'primary.main' : 'text.secondary',
                  backgroundColor: selected ? 'rgba(255,255,255,0.08)' : 'transparent',
                  boxShadow: selected ? 'inset 0 0 0 1px rgba(255,255,255,0.25)' : 'none',
                  '&:hover': {
                    backgroundColor: selected ? 'rgba(255,255,255,0.1)' : 'action.hover',
                  },
                }}
              >
                <IconComponent fontSize="small" />
              </IconButton>
            </Grid>
          );
        })}
      </Grid>
      {totalPages > 1 && (
        <Box
          sx={{
            mt: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <IconButton
            size="small"
            disabled={page === 0}
            onClick={() => setPage(p => Math.max(0, p - 1))}
          >
            ‹
          </IconButton>
          <Box
            sx={{
              fontSize: 11,
              color: 'text.secondary',
              minWidth: 40,
              textAlign: 'center',
            }}
          >
            {page + 1} / {totalPages}
          </Box>
          <IconButton
            size="small"
            disabled={page === totalPages - 1}
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          >
            ›
          </IconButton>
        </Box>
      )}
    </>
  );
};

export default IconGridPicker;
