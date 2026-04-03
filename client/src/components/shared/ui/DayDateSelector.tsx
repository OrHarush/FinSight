import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Typography } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Dayjs } from 'dayjs';
import { useEffect, useRef, useState } from 'react';

import Row from '@/components/shared/layout/containers/Row';

interface DaySelectorMobileProps {
  value: Dayjs;
  onChange: (newDate: Dayjs) => void;
}

const DaySelectorMobile = ({ value, onChange }: DaySelectorMobileProps) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handlePrevDay = () => onChange(value.subtract(1, 'day').startOf('day'));
  const handleNextDay = () => onChange(value.add(1, 'day').startOf('day'));

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <Row width="200px" alignItems="center" justifyContent="space-between" dir="ltr" spacing={1}>
      <IconButton onClick={handlePrevDay} size="small" color="primary">
        <ArrowBackIosNewIcon fontSize="small" />
      </IconButton>

      <Row
        alignItems="center"
        spacing={1}
        sx={{
          borderRadius: '12px',
          cursor: 'pointer',
          '&:hover': { backgroundColor: 'action.selected' },
        }}
        onClick={() => setOpen(true)}
        ref={anchorRef}
      >
        <IconButton size="small">
          <EditIcon sx={{ fontSize: '13px' }} />
        </IconButton>

        <Typography variant="body1" fontWeight={600}>
          {value.format('DD/MM/YYYY')}
        </Typography>

        <DesktopDatePicker
          value={value}
          onChange={date => {
            if (date) onChange(date.startOf('day'));
            setOpen(false);
          }}
          open={open}
          onClose={() => setOpen(false)}
          slotProps={{
            textField: { sx: { display: 'none' } },
            popper: {
              anchorEl: () => anchorRef.current as HTMLElement,
              disablePortal: false,
            },
          }}
        />
      </Row>

      <IconButton onClick={handleNextDay} size="small" color="primary">
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>
    </Row>
  );
};

export default DaySelectorMobile;
