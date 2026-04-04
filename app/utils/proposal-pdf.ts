import fontkit from '@pdf-lib/fontkit'
import { PDFDocument, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import type { CalculationResult } from '~/types'
import { formatPrice } from '~/utils/pricing'

const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const PAGE_MARGIN = 32
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2
const PROJECT_TYPE_LABELS: Record<string, string> = {
  landing: 'Лендинг',
  corporate: 'Корпоративный сайт',
  ecommerce: 'Интернет-магазин',
  mobile: 'Мобильное приложение',
  presentation: 'Презентация',
  branding: 'Брендинг',
}

type RgbColor = ReturnType<typeof rgb>

type PdfContext = {
  boldFont: PDFFont
  normalFont: PDFFont
}

function hex(hexColor: string): RgbColor {
  const value = hexColor.replace('#', '')
  const r = Number.parseInt(value.slice(0, 2), 16) / 255
  const g = Number.parseInt(value.slice(2, 4), 16) / 255
  const b = Number.parseInt(value.slice(4, 6), 16) / 255
  return rgb(r, g, b)
}

function formatDate() {
  return new Intl.DateTimeFormat('ru-RU').format(new Date())
}

function drawRoundedRectShape(page: PDFPage, x: number, y: number, width: number, height: number, radius: number, color: RgbColor) {
  const safeRadius = Math.max(0, Math.min(radius, width / 2, height / 2))

  page.drawRectangle({
    x: x + safeRadius,
    y,
    width: width - safeRadius * 2,
    height,
    color,
  })

  page.drawRectangle({
    x,
    y: y + safeRadius,
    width,
    height: height - safeRadius * 2,
    color,
  })

  const corners = [
    { x: x + safeRadius, y: y + safeRadius },
    { x: x + width - safeRadius, y: y + safeRadius },
    { x: x + safeRadius, y: y + height - safeRadius },
    { x: x + width - safeRadius, y: y + height - safeRadius },
  ]

  for (const corner of corners) {
    page.drawCircle({
      x: corner.x,
      y: corner.y,
      size: safeRadius,
      color,
    })
  }
}

function drawRoundedRect(page: PDFPage, x: number, y: number, width: number, height: number, radius: number, fillColor: RgbColor, borderColor?: RgbColor, borderWidth = 1) {
  if (borderColor && borderWidth > 0) {
    drawRoundedRectShape(page, x, y, width, height, radius, borderColor)
    drawRoundedRectShape(
      page,
      x + borderWidth,
      y + borderWidth,
      width - borderWidth * 2,
      height - borderWidth * 2,
      Math.max(0, radius - borderWidth),
      fillColor,
    )
    return
  }

  drawRoundedRectShape(page, x, y, width, height, radius, fillColor)
}

function splitTextToLines(text: string, font: PDFFont, size: number, maxWidth: number) {
  const hardLines = text.split('\n')
  const result: string[] = []

  for (const hardLine of hardLines) {
    const words = hardLine.split(/\s+/).filter(Boolean)

    if (words.length === 0) {
      result.push('')
      continue
    }

    let current = words[0]!

    for (const word of words.slice(1)) {
      const candidate = `${current} ${word}`
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        current = candidate
      }
      else {
        result.push(current)
        current = word
      }
    }

    result.push(current)
  }

  return result
}

function drawTextLines(page: PDFPage, lines: string[], x: number, topY: number, options: { font: PDFFont, size: number, color: RgbColor, lineHeight: number }) {
  lines.forEach((line, index) => {
    page.drawText(line, {
      x,
      y: topY - options.size - index * options.lineHeight,
      size: options.size,
      font: options.font,
      color: options.color,
    })
  })
}

function drawWrappedText(page: PDFPage, text: string, x: number, topY: number, maxWidth: number, options: { font: PDFFont, size: number, color: RgbColor, lineHeight: number }) {
  const lines = splitTextToLines(text, options.font, options.size, maxWidth)
  drawTextLines(page, lines, x, topY, options)
  return lines.length * options.lineHeight
}

function drawCenteredText(page: PDFPage, text: string, left: number, y: number, width: number, font: PDFFont, size: number, color: RgbColor) {
  const textWidth = font.widthOfTextAtSize(text, size)
  page.drawText(text, {
    x: left + (width - textWidth) / 2,
    y,
    size,
    font,
    color,
  })
}

function projectTypeLabel(result: CalculationResult) {
  return PROJECT_TYPE_LABELS[result.formData.projectType] ?? result.formData.projectType
}

function getKpSummaryText(result: CalculationResult) {
  const price = formatPrice(result.finalPrice)
  const { min, max } = result.weeks

  const byType: Record<string, string> = {
    landing: `Посмотрел задачу — готов взяться. Лендинг стоит ${price}, срок ${min}–${max} недели. Делаю так, чтобы он не просто выглядел, а работал: доносил суть продукта и приводил к целевому действию. Всё включено в стоимость, без скрытых доплат.`,
    corporate: `Посмотрел задачу — готов взяться. Корпоративный сайт стоит ${price}, срок ${min}–${max} недели. Проектирую под конкретные бизнес-задачи: каждый экран должен работать на доверие и понятно объяснять, чем вы занимаетесь. Всё включено в стоимость.`,
    ecommerce: `Посмотрел задачу — готов взяться. Магазин стоит ${price}, срок ${min}–${max} недели. Строю путь пользователя так, чтобы от входа до оплаты было как можно меньше трений. Конверсия закладывается в структуру, не в баннеры. Всё включено в стоимость.`,
    mobile: `Посмотрел задачу — готов взяться за мобильное приложение. Стоимость ${price}, срок ${min}–${max} недели. Делаю интерфейсы понятными с первого запуска — без обучения и лишних вопросов. Всё включено в стоимость.`,
    presentation: `Посмотрел задачу — готов взяться. Презентация стоит ${price}, срок ${min}–${max} недели. Строю визуальную логику под вашу аудиторию — слайды должны убеждать сами, без того чтобы докладчик заполнял пустоты. Всё включено в стоимость.`,
    branding: `Посмотрел задачу — готов взяться. Фирменный стиль стоит ${price}, срок ${min}–${max} недели. Делаю систему, а не набор картинок: логотип, типографика, цвет — всё должно читаться одинаково на визитке и в соцсетях. Всё включено в стоимость.`,
  }

  return byType[result.formData.projectType] ?? `Посмотрел задачу — готов взяться. Стоимость ${price}, срок ${min}–${max} недели. Всё включено, без скрытых доплат.`
}

async function loadFontBytes(path: string) {
  const response = await fetch(path)
  if (!response.ok) {
    throw new Error(`Не удалось загрузить шрифт: ${path}`)
  }

  return new Uint8Array(await response.arrayBuffer())
}

async function createPdfContext() {
  const pdfDoc = await PDFDocument.create()
  pdfDoc.registerFontkit(fontkit)

  const [regularBytes, semiBoldBytes] = await Promise.all([
    loadFontBytes('/fonts/Onest-Regular.ttf'),
    loadFontBytes('/fonts/Onest-SemiBold.ttf'),
  ])

  const normalFont = await pdfDoc.embedFont(regularBytes, { subset: true })
  const boldFont = await pdfDoc.embedFont(semiBoldBytes, { subset: true })

  return { pdfDoc, normalFont, boldFont }
}

function drawPill(page: PDFPage, text: string, x: number, topY: number, options: { width: number, height: number, font: PDFFont, size: number, background: RgbColor, border: RgbColor, color: RgbColor, radius?: number, letterSpacing?: number }) {
  const height = options.height
  drawRoundedRect(page, x, topY - height, options.width, height, options.radius ?? height / 2, options.background, options.border)
  drawCenteredText(page, text, x, topY - height / 2 - options.size / 2 + 2, options.width, options.font, options.size, options.color)
}

function drawMetaCard(page: PDFPage, x: number, y: number, width: number, height: number, label: string, value: string, ctx: PdfContext) {
  drawRoundedRect(page, x, y, width, height, 12, hex('#1f2937'), hex('#374151'))
  page.drawText(label.toUpperCase(), {
    x: x + 18,
    y: y + height - 26,
    size: 10,
    font: ctx.normalFont,
    color: hex('#6b7280'),
  })
  page.drawText(value, {
    x: x + 18,
    y: y + 16,
    size: 18,
    font: ctx.boldFont,
    color: hex('#ffffff'),
  })
}

function drawTag(page: PDFPage, text: string, x: number, y: number, ctx: PdfContext) {
  const width = ctx.normalFont.widthOfTextAtSize(text, 12) + 24
  drawRoundedRect(page, x, y, width, 28, 8, hex('#ffffff'), hex('#e5e7eb'))
  page.drawText(text, {
    x: x + 12,
    y: y + 8,
    size: 12,
    font: ctx.normalFont,
    color: hex('#374151'),
  })
}

function formatBreakdownExplanation(explanation: string) {
  return explanation
    .replace(/\s*[×x*]\s*коэф\.?\s*\d+(?:[.,]\d+)?/giu, '')
    .replace(/\s*[×x*]\s*(?:\u043A\u043E\u044D\u0444)\.?\s*\d+(?:[.,]\d+)?/giu, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function drawCoverPage(page: PDFPage, result: CalculationResult, ctx: PdfContext) {
  const darkBlockHeight = 408
  const darkBlockY = PAGE_HEIGHT - PAGE_MARGIN - darkBlockHeight
  const coverBlockGap = PAGE_MARGIN
  drawRoundedRect(page, PAGE_MARGIN, darkBlockY, CONTENT_WIDTH, darkBlockHeight, 18, hex('#111827'))

  const darkBlockTop = darkBlockY + darkBlockHeight
  const contentLeft = PAGE_MARGIN + 26
  const contentRight = PAGE_MARGIN + CONTENT_WIDTH - 26
  const headerY = darkBlockTop - 46
  page.drawText('Scope', {
    x: contentLeft,
    y: headerY - 18,
    size: 22,
    font: ctx.boldFont,
    color: hex('#ffffff'),
  })
  page.drawText('X', {
    x: contentLeft + 67,
    y: headerY - 18,
    size: 22,
    font: ctx.boldFont,
    color: hex('#6b7280'),
  })

  drawPill(page, 'Коммерческое предложение', contentRight - 258, headerY + 2, {
    width: 258,
    height: 30,
    font: ctx.normalFont,
    size: 11,
    background: hex('#111827'),
    border: hex('#374151'),
    color: hex('#6b7280'),
  })

  const projectTagTop = darkBlockTop - 88
  drawPill(page, projectTypeLabel(result), contentLeft, projectTagTop, {
    width: Math.max(132, ctx.normalFont.widthOfTextAtSize(projectTypeLabel(result), 12) + 30),
    height: 32,
    font: ctx.normalFont,
    size: 12,
    background: hex('#1f2937'),
    border: hex('#374151'),
    color: hex('#9ca3af'),
    radius: 8,
  })

  const separatorY = projectTagTop - 54
  page.drawLine({
    start: { x: contentLeft, y: separatorY },
    end: { x: contentRight, y: separatorY },
    thickness: 1,
    color: hex('#374151'),
  })

  const priceSize = 50
  const priceTopY = separatorY - 26
  const priceY = priceTopY - priceSize
  page.drawText(formatPrice(result.finalPrice), {
    x: contentLeft,
    y: priceY,
    size: priceSize,
    font: ctx.boldFont,
    color: hex('#ffffff'),
  })

  const rangeText = `${formatPrice(result.minPrice)} — ${formatPrice(result.maxPrice)}`
  const rangeY = priceY - 26
  page.drawText(rangeText, {
    x: contentLeft,
    y: rangeY,
    size: 12,
    font: ctx.normalFont,
    color: hex('#6b7280'),
  })

  const cardHeight = 84
  const cardTopGap = 34
  const cardY = rangeY - cardTopGap - cardHeight
  const gap = 12
  const cardWidth = (CONTENT_WIDTH - 52 - gap * 2) / 3
  drawMetaCard(page, contentLeft, cardY, cardWidth, 84, 'Срок', `${result.weeks.min}–${result.weeks.max} нед.`, ctx)
  drawMetaCard(page, contentLeft + cardWidth + gap, cardY, cardWidth, 84, 'Дата', formatDate(), ctx)
  drawMetaCard(page, contentLeft + (cardWidth + gap) * 2, cardY, cardWidth, 84, 'Позиций', String(result.breakdown.length), ctx)

  const lowerY = PAGE_MARGIN
  const lowerHeight = darkBlockY - lowerY - coverBlockGap
  const lowerTopY = lowerY + lowerHeight
  drawRoundedRect(page, PAGE_MARGIN, lowerY, CONTENT_WIDTH, lowerHeight, 18, hex('#f9fafb'))

  page.drawText('СОСТАВ РАБОТ', {
    x: PAGE_MARGIN + 20,
    y: lowerTopY - 30,
    size: 11,
    font: ctx.normalFont,
    color: hex('#9ca3af'),
  })

  let tagX = PAGE_MARGIN + 20
  let tagY = lowerTopY - 76
  const maxTagWidth = PAGE_MARGIN + CONTENT_WIDTH - 20
  for (const item of result.breakdown) {
    const tagWidth = ctx.normalFont.widthOfTextAtSize(item.label, 12) + 24
    if (tagX + tagWidth > maxTagWidth) {
      tagX = PAGE_MARGIN + 20
      tagY -= 36
    }
    drawTag(page, item.label, tagX, tagY, ctx)
    tagX += tagWidth + 8
  }

  const summarySeparatorY = tagY - 28
  page.drawLine({
    start: { x: PAGE_MARGIN + 20, y: summarySeparatorY },
    end: { x: PAGE_MARGIN + CONTENT_WIDTH - 20, y: summarySeparatorY },
    thickness: 1,
    color: hex('#e5e7eb'),
  })

  drawWrappedText(page, getKpSummaryText(result), PAGE_MARGIN + 20, summarySeparatorY - 26, CONTENT_WIDTH - 60, {
    font: ctx.normalFont,
    size: 14,
    color: hex('#4b5563'),
    lineHeight: 22,
  })
}

function addDetailsPage(pdfDoc: PDFDocument, result: CalculationResult, ctx: PdfContext) {
  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  let cursorY = PAGE_HEIGHT - PAGE_MARGIN
  const bottomContentLimit = 64
  const totalBlockHeight = 60
  const detailCardMinHeight = 70
  const detailCardPaddingTop = 14
  const detailCardPaddingBottom = 14
  const detailCardTitleSize = 14
  const detailCardBodySize = 11
  const detailCardBodyLineHeight = 15
  const detailCardTitleToBodyGap = 8
  const breakdownTotal = result.breakdown.reduce((sum, item) => sum + item.amount, 0)
  const minimumApplied = result.finalPrice > breakdownTotal
  const pageHeading = '\u041F\u0435\u0440\u0435\u0447\u0435\u043D\u044C \u0443\u0441\u043B\u0443\u0433'

  const drawHeader = () => {
    page.drawText('Scope', {
      x: PAGE_MARGIN,
      y: cursorY - 14,
      size: 18,
      font: ctx.boldFont,
      color: hex('#111827'),
    })
    page.drawText('X', {
      x: PAGE_MARGIN + 55,
      y: cursorY - 14,
      size: 18,
      font: ctx.boldFont,
      color: hex('#9ca3af'),
    })
    page.drawText(pageHeading, {
      x: PAGE_WIDTH - PAGE_MARGIN - ctx.normalFont.widthOfTextAtSize(pageHeading, 11),
      y: cursorY - 10,
      size: 11,
      font: ctx.normalFont,
      color: hex('#9ca3af'),
    })
    page.drawLine({
      start: { x: PAGE_MARGIN, y: cursorY - 28 },
      end: { x: PAGE_WIDTH - PAGE_MARGIN, y: cursorY - 28 },
      thickness: 1,
      color: hex('#e5e7eb'),
    })
    cursorY -= 52
  }

  const ensureSpace = (requiredHeight: number, bottomLimit = bottomContentLimit) => {
    if (cursorY - requiredHeight < bottomLimit) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
      cursorY = PAGE_HEIGHT - PAGE_MARGIN
      drawHeader()
    }
  }

  drawHeader()

  for (const item of result.breakdown) {
    const explanationText = formatBreakdownExplanation(item.explanation)
    const explanationLines = splitTextToLines(
      explanationText,
      ctx.normalFont,
      detailCardBodySize,
      minimumApplied ? CONTENT_WIDTH - 36 : CONTENT_WIDTH - 64 - 110,
    )
    const titleBlockHeight = detailCardTitleSize
    const bodyBlockHeight = explanationLines.length * detailCardBodyLineHeight
    const cardHeight = Math.max(detailCardMinHeight, detailCardPaddingTop + titleBlockHeight + detailCardTitleToBodyGap + bodyBlockHeight + detailCardPaddingBottom)
    ensureSpace(cardHeight + 12)

    drawRoundedRect(page, PAGE_MARGIN, cursorY - cardHeight, CONTENT_WIDTH, cardHeight, 12, hex('#f9fafb'), hex('#e5e7eb'))
    page.drawText(item.label, {
      x: PAGE_MARGIN + 18,
      y: cursorY - detailCardPaddingTop - detailCardTitleSize,
      size: detailCardTitleSize,
      font: ctx.boldFont,
      color: hex('#111827'),
    })
    drawTextLines(page, explanationLines, PAGE_MARGIN + 18, cursorY - detailCardPaddingTop - detailCardTitleSize - detailCardTitleToBodyGap, {
      font: ctx.normalFont,
      size: detailCardBodySize,
      color: hex('#6b7280'),
      lineHeight: detailCardBodyLineHeight,
    })

    if (!minimumApplied) {
      const amountText = formatPrice(item.amount)
      page.drawText(amountText, {
        x: PAGE_MARGIN + CONTENT_WIDTH - 18 - ctx.boldFont.widthOfTextAtSize(amountText, detailCardTitleSize),
        y: cursorY - detailCardPaddingTop - detailCardTitleSize,
        size: detailCardTitleSize,
        font: ctx.boldFont,
        color: hex('#111827'),
      })
    }

    cursorY -= cardHeight + 12
  }

  if (minimumApplied && result.breakdown.length < 0) {
    ensureSpace(76)
    drawRoundedRect(page, PAGE_MARGIN, cursorY - 64, CONTENT_WIDTH, 64, 12, hex('#f3f4f6'), hex('#e5e7eb'))
    page.drawText('Применён минимум проекта', {
      x: PAGE_MARGIN + 18,
      y: cursorY - 24,
      size: 12,
      font: ctx.normalFont,
      color: hex('#6b7280'),
    })
    page.drawText(`Финальная стоимость поднята до ${formatPrice(result.finalPrice)} по минимальному порогу проекта.`, {
      x: PAGE_MARGIN + 18,
      y: cursorY - 42,
      size: 12,
      font: ctx.normalFont,
      color: hex('#374151'),
    })
    cursorY -= 76
  }

  ensureSpace(totalBlockHeight + 12, 48)
  drawRoundedRect(page, PAGE_MARGIN, cursorY - totalBlockHeight, CONTENT_WIDTH, totalBlockHeight, 12, hex('#111827'))
  page.drawText('ИТОГО', {
    x: PAGE_MARGIN + 20,
    y: cursorY - 36,
    size: 13,
    font: ctx.boldFont,
    color: hex('#9ca3af'),
  })
  const totalText = formatPrice(result.finalPrice)
  page.drawText(totalText, {
    x: PAGE_WIDTH - PAGE_MARGIN - 20 - ctx.boldFont.widthOfTextAtSize(totalText, 28),
    y: cursorY - 38,
    size: 28,
    font: ctx.boldFont,
    color: hex('#ffffff'),
  })

  const footerText = `Сформировано с помощью ScopeX · ${formatDate()}`
  page.drawText(footerText, {
    x: PAGE_MARGIN,
    y: PAGE_MARGIN - 2,
    size: 11,
    font: ctx.normalFont,
    color: hex('#9ca3af'),
  })
}

function saveBytes(bytes: Uint8Array, filename: string) {
  const blobBytes = Uint8Array.from(bytes)
  const blob = new Blob([blobBytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export async function downloadProposalPdf(result: CalculationResult) {
  const { pdfDoc, normalFont, boldFont } = await createPdfContext()
  const ctx = { normalFont, boldFont }

  const cover = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  drawCoverPage(cover, result, ctx)
  addDetailsPage(pdfDoc, result, ctx)

  const bytes = await pdfDoc.save()
  saveBytes(bytes, `КП_${projectTypeLabel(result)}_ScopeX.pdf`)
}
