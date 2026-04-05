import type { MarketPosition } from '~/types'

export const MARKET_POSITION_LABELS: Record<MarketPosition, string> = {
  below: 'ниже рынка',
  in: 'в рынке',
  above: 'выше рынка',
}

export function getMarketPositionLabel(position: MarketPosition) {
  return MARKET_POSITION_LABELS[position]
}

export function getOwnRateFeedback(position: MarketPosition) {
  if (position === 'in') {
    return {
      text: 'В рынке — цена соответствует Middle-специалисту',
      cardClass: 'bg-[var(--accent-subtle-bg)] text-[var(--accent-subtle-on)] border border-[var(--accent-subtle-border)]',
      dotClass: 'bg-green-400',
    }
  }

  if (position === 'below') {
    return {
      text: 'Ниже рынка — вы берёте меньше среднего Middle',
      cardClass: 'bg-[var(--warning-bg)] text-[var(--warning-on)] border border-[var(--warning-border)]',
      dotClass: 'bg-orange-400',
    }
  }

  return {
    text: 'Выше рынка',
    cardClass: 'bg-[var(--bg-surface-raised)] text-[var(--text-primary)] border border-[var(--border-default)]',
    dotClass: 'bg-[var(--accent-bg)]',
  }
}

export function getSelfCheckFeedback(position: MarketPosition) {
  if (position === 'below') {
    return {
      title: 'Ниже рынка',
      text: 'Ваша цена ниже среднерыночной для Middle-специалиста. Возможно, стоит пересмотреть ставку и заложить больше ценности в итоговую сумму.',
      cardClass: 'feedback-card-below',
      titleClass: 'feedback-title-below',
      textClass: 'feedback-text-below',
    }
  }

  if (position === 'in') {
    return {
      title: 'В рынке',
      text: 'Цена соответствует рыночному уровню Middle-специалиста. Это хороший ориентир, если нужна понятная и уверенная сумма для клиента.',
      cardClass: 'feedback-card-market',
      titleClass: 'feedback-title-market',
      textClass: 'feedback-text-market',
    }
  }

  return {
    title: 'Выше рынка',
    text: 'Ваша цена выше среднерыночного Middle-уровня. Это нормально, если вы продаёте опыт, специализацию, скорость и более зрелый процесс.',
    cardClass: 'feedback-card-premium',
    titleClass: 'feedback-title-premium',
    textClass: 'feedback-text-premium',
  }
}
