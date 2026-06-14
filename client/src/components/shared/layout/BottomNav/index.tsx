import { useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { bottomNavItems } from '@/components/shared/layout/BottomNav/bottomNavConfig';
import BottomNavCreateButton from '@/components/shared/layout/BottomNav/BottomNavCreateButton';
import BottomNavItem from '@/components/shared/layout/BottomNav/BottomNavItem';
import {
  BAR_HEIGHT,
  getActiveIndicatorColor,
  getBottomNavContainerStyle,
  getBottomNavRowStyle,
  getCenterSlotStyle,
  INDICATOR_INSET_BLOCK,
  INDICATOR_INSET_INLINE,
  INDICATOR_RADIUS,
} from '@/components/shared/layout/BottomNav/styles';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { usePageHeaderContext } from '@/components/shared/layout/PageHeaderContext';
import { ROUTES } from '@/constants/Routes';
import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';
import { useReviewCount } from '@/hooks/entities/useTransactionReview';
import { useAuth } from '@/providers/AuthProvider';

const isRouteActive = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

interface IndicatorState {
  x: number;
  width: number;
  visible: boolean;
}

const indicatorSpring = { type: 'spring', stiffness: 460, damping: 34, mass: 0.9 } as const;

const BottomNav = () => {
  const isSmallScreen = useIsSmallScreen();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { i18n } = useTranslation();
  const { primaryAction } = usePageHeaderContext();
  const { user } = useAuth();
  const { data: reviewCountData } = useReviewCount(!!user);

  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState<IndicatorState>({ x: 0, width: 0, visible: false });
  const [animateSlide, setAnimateSlide] = useState(false);

  const activeIndex = bottomNavItems.findIndex(item =>
    isRouteActive(location.pathname, item.route)
  );

  useLayoutEffect(() => {
    const measure = () => {
      const el = activeIndex >= 0 ? itemRefs.current[activeIndex] : null;

      if (!el) {
        setIndicator(prev => (prev.visible ? { ...prev, visible: false } : prev));

        return;
      }

      setIndicator({
        x: el.offsetLeft + INDICATOR_INSET_INLINE,
        width: Math.max(0, el.offsetWidth - INDICATOR_INSET_INLINE * 2),
        visible: true,
      });
    };

    measure();
    window.addEventListener('resize', measure);

    return () => window.removeEventListener('resize', measure);
  }, [activeIndex, isSmallScreen, i18n.language]);

  useEffect(() => {
    setAnimateSlide(true);
  }, []);

  if (!isSmallScreen) {
    return null;
  }

  const reviewCount = reviewCountData?.count ?? 0;

  const renderItem = (item: (typeof bottomNavItems)[number], index: number) => (
    <BottomNavItem
      key={item.titleKey}
      ref={el => {
        itemRefs.current[index] = el;
      }}
      item={item}
      isActive={index === activeIndex}
      onClick={() => navigate(item.route)}
      badgeContent={item.route === ROUTES.TRANSACTIONS_URL ? reviewCount : 0}
    />
  );

  return (
    <Column component="nav" sx={getBottomNavContainerStyle()}>
      <Row sx={getBottomNavRowStyle()}>
        <motion.div
          aria-hidden
          initial={false}
          animate={{ x: indicator.x, width: indicator.width, opacity: indicator.visible ? 1 : 0 }}
          transition={animateSlide ? indicatorSpring : { duration: 0 }}
          style={{
            position: 'absolute',
            left: 0,
            top: INDICATOR_INSET_BLOCK,
            height: BAR_HEIGHT - INDICATOR_INSET_BLOCK * 2,
            borderRadius: INDICATOR_RADIUS,
            backgroundColor: getActiveIndicatorColor(theme),
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
        {bottomNavItems.slice(0, 2).map((item, i) => renderItem(item, i))}
        <Row sx={getCenterSlotStyle()}>
          <BottomNavCreateButton onClick={primaryAction} />
        </Row>
        {bottomNavItems.slice(2).map((item, i) => renderItem(item, i + 2))}
      </Row>
    </Column>
  );
};

export default BottomNav;
