import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DescriptionIcon from '@mui/icons-material/Description';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { alpha, Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import lyraIcon from '@/assets/lyraIconNoBg.webp';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import FrameChip from '@/pages/Home/HeroSection/DashboardPreview/FrameChip';

interface PrivacyFrameProps {
  isPaused?: boolean;
}

const LOOP_DURATION = 4.5;
const VIEWBOX_W = 300;
const VIEWBOX_H = 130;
const NODE_CENTER_Y = 50;
const NODE_RADIUS = 26;

const times = [0, 0.22, 0.44, 0.66, 0.88, 1] as const;

const getLinePath = (startX: number, endX: number) => {
  const direction = endX > startX ? 1 : -1;
  const x1 = startX + direction * NODE_RADIUS;
  const x2 = endX - direction * NODE_RADIUS;

  return { x1, y1: NODE_CENTER_Y, x2, y2: NODE_CENTER_Y };
};

interface NodePositions {
  bank: number;
  file: number;
  lyra: number;
}

const getPositions = (isRtl: boolean): NodePositions =>
  isRtl
    ? { bank: 260, file: 150, lyra: 40 }
    : { bank: 40, file: 150, lyra: 260 };

interface NodeShellProps {
  x: number;
  children: React.ReactNode;
  opacity: number[];
  background: string;
  border: string;
  boxShadow?: string;
}

const NodeShell = ({
  x,
  children,
  opacity,
  background,
  border,
  boxShadow,
}: NodeShellProps) => (
  <motion.div
    initial={{ opacity: opacity[0] }}
    animate={{ opacity }}
    transition={{ duration: LOOP_DURATION, times: [...times], repeat: Infinity, ease: 'easeInOut' }}
    style={{
      position: 'absolute',
      left: `${(x / VIEWBOX_W) * 100}%`,
      top: `${(NODE_CENTER_Y / VIEWBOX_H) * 100}%`,
      transform: 'translate(-50%, -50%)',
      width: NODE_RADIUS * 2,
      height: NODE_RADIUS * 2,
      borderRadius: '50%',
      background,
      border,
      boxShadow,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
    }}
  >
    {children}
  </motion.div>
);

const PrivacyFrame = (_: PrivacyFrameProps = {}) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation('home');
  const isRtl = i18n.language === 'he';

  const positions = getPositions(isRtl);
  const line1 = getLinePath(positions.bank, positions.file);
  const line2 = getLinePath(positions.file, positions.lyra);

  const lineTransition = {
    duration: LOOP_DURATION,
    times: [...times],
    repeat: Infinity,
    ease: 'linear' as const,
  };

  const packetTransition = {
    duration: LOOP_DURATION,
    times: [...times],
    repeat: Infinity,
    ease: 'easeInOut' as const,
  };

  const bankOpacity = [1, 1, 0.6, 0.6, 0.7, 1];
  const fileOpacity = [0.6, 0.6, 1, 1, 1, 0.6];
  const lyraOpacity = [0.6, 0.6, 0.6, 1, 1, 0.6];

  const line1Offset = [1, 1, 0, 0, 0.2, 1];
  const line2Offset = [1, 1, 1, 0, 0, 1];

  const packet1Opacity = [0, 1, 1, 0, 0, 0];
  const packet1Cx = [
    positions.bank,
    positions.bank,
    positions.file,
    positions.file,
    positions.file,
    positions.bank,
  ];

  const packet2Opacity = [0, 0, 0, 1, 0, 0];
  const packet2Cx = [
    positions.file,
    positions.file,
    positions.file,
    positions.lyra,
    positions.lyra,
    positions.file,
  ];

  const packetColor = theme.palette.primary.main;
  const activeLineColor = alpha(theme.palette.primary.main, 0.65);
  const dimLineColor = alpha(theme.palette.divider, 0.25);

  return (
    <Column spacing={2.5} sx={{ width: '100%' }}>
      <FrameChip label={t('landing.hero.frames.privacy.title')} />

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: `${VIEWBOX_W} / ${VIEWBOX_H}`,
          px: 0.5,
        }}
      >
        <svg
          viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <line
            {...line1}
            stroke={dimLineColor}
            strokeWidth={1.5}
            strokeDasharray="2 4"
          />
          <line
            {...line2}
            stroke={dimLineColor}
            strokeWidth={1.5}
            strokeDasharray="2 4"
          />

          <motion.line
            {...line1}
            stroke={activeLineColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            initial={{ strokeDashoffset: line1Offset[0] }}
            animate={{ strokeDashoffset: line1Offset }}
            transition={lineTransition}
          />
          <motion.line
            {...line2}
            stroke={activeLineColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            initial={{ strokeDashoffset: line2Offset[0] }}
            animate={{ strokeDashoffset: line2Offset }}
            transition={lineTransition}
          />

          <motion.circle
            r={5}
            cy={NODE_CENTER_Y}
            fill={packetColor}
            initial={{ opacity: packet1Opacity[0], cx: positions.bank }}
            animate={{ cx: packet1Cx, opacity: packet1Opacity }}
            transition={packetTransition}
            style={{
              filter: `drop-shadow(0 0 4px ${alpha(theme.palette.primary.main, 0.9)})`,
            }}
          />

          <motion.circle
            r={5}
            cy={NODE_CENTER_Y}
            fill={packetColor}
            initial={{ opacity: packet2Opacity[0], cx: positions.file }}
            animate={{ cx: packet2Cx, opacity: packet2Opacity }}
            transition={packetTransition}
            style={{
              filter: `drop-shadow(0 0 4px ${alpha(theme.palette.primary.main, 0.9)})`,
            }}
          />
        </svg>

        <NodeShell
          x={positions.bank}
          opacity={bankOpacity}
          background={alpha(theme.palette.background.default, 0.7)}
          border={`1px solid ${alpha(theme.palette.divider, 0.3)}`}
        >
          <AccountBalanceIcon sx={{ fontSize: 22, color: 'text.secondary' }} />
        </NodeShell>

        <NodeShell
          x={positions.file}
          opacity={fileOpacity}
          background={alpha(theme.palette.background.default, 0.85)}
          border={`1px solid ${alpha(theme.palette.primary.main, 0.3)}`}
        >
          <DescriptionIcon sx={{ fontSize: 24, color: theme.palette.primary.main }} />
          <Box
            sx={{
              position: 'absolute',
              bottom: -6,
              right: -6,
              width: 26,
              height: 26,
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
              border: `2px solid ${theme.palette.background.paper}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.6)}`,
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 16, color: '#fff' }} />
          </Box>
        </NodeShell>

        <NodeShell
          x={positions.lyra}
          opacity={lyraOpacity}
          background={alpha(theme.palette.background.default, 0.85)}
          border={`1px solid ${alpha(theme.palette.primary.main, 0.35)}`}
          boxShadow={`0 10px 24px ${alpha(theme.palette.primary.main, 0.35)}`}
        >
          <Box
            component="img"
            src={lyraIcon}
            alt="Lyra"
            sx={{
              width: '70%',
              height: '70%',
              objectFit: 'contain',
            }}
          />
        </NodeShell>

        {[
          { x: positions.bank, label: t('landing.hero.frames.privacy.bank') },
          { x: positions.file, label: t('landing.hero.frames.privacy.file') },
          { x: positions.lyra, label: 'Lyra' },
        ].map(node => (
          <Typography
            key={node.label}
            variant="caption"
            style={{
              position: 'absolute',
              top: `${((NODE_CENTER_Y + NODE_RADIUS + 10) / VIEWBOX_H) * 100}%`,
              left: `${(node.x / VIEWBOX_W) * 100}%`,
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
            }}
            sx={{
              fontSize: '0.72rem',
              color: 'text.secondary',
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            {node.label}
          </Typography>
        ))}
      </Box>

      <Row
        spacing={0.75}
        alignItems="center"
        justifyContent="center"
        sx={{
          alignSelf: 'center',
          px: 1.75,
          py: 0.85,
          borderRadius: '999px',
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
        }}
      >
        <LockOutlinedIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
        <Typography
          sx={{
            fontSize: '0.8rem',
            color: 'text.primary',
            fontWeight: 500,
          }}
        >
          {t('landing.hero.frames.privacy.caption')}
        </Typography>
      </Row>
    </Column>
  );
};

export default PrivacyFrame;
