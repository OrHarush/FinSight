interface IconRule {
  keywords: RegExp;
  icon: string;
}

const RULES: IconRule[] = [
  { keywords: /\b(wedding|ring|engagement)\b|טבעת|חתונה|אירוסין/i, icon: 'Diamond' },
  { keywords: /\b(house|home|apartment|flat)\b|דירה|בית/i, icon: 'Home' },
  { keywords: /\b(car|vehicle|auto)\b|רכב|מכונית|אוטו/i, icon: 'DirectionsCar' },
  { keywords: /\b(vacation|trip|travel|flight|holiday)\b|חופשה|טיול|נסיעה/i, icon: 'Flight' },
  { keywords: /\b(school|education|college|university|tuition)\b|השכלה|לימודים|אוניברסיטה|מכללה/i, icon: 'School' },
];

const DEFAULT_ICON = 'TrackChanges';

export const suggestGoalIcon = (name: string | undefined): string => {
  if (!name) {
    return DEFAULT_ICON;
  }

  const trimmed = name.trim();

  if (!trimmed) {
    return DEFAULT_ICON;
  }

  for (const rule of RULES) {
    if (rule.keywords.test(trimmed)) {
      return rule.icon;
    }
  }

  return DEFAULT_ICON;
};
