import React, { useMemo, useRef } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import CalendarGrid from './CalendarGrid'
import { getCalendarDays } from './lunarHelper'

// ===== VIP 阴历生日 =====
const VIP_BIRTHDAYS = [
  { name: '爸爸', date: '10.21' },
  { name: '妈妈', date: '01.19' },
  { name: '婆婆', date: '05.23' },
  { name: '小翊', date: '09.10' },
  { name: '小样', date: '02.17' },
  { name: '我', date: '02.02' },
  { name: '哥哥', date: '07.27' },
  { name: '姐姐', date: '06.11' },
]

// 转事件
const PREDEFINED_EVENTS = VIP_BIRTHDAYS.map((vip, index) => {
  const [m, d] = vip.date.split('.')
  return {
    id: `vip-${index}`,
    title: `${vip.name}生日`,
    isLunarRecurrent: true,
    lunarMonth: +m,
    lunarDay: +d,
  }
})

export default function App() {
  const year = new Date().getFullYear()

  const page1Ref = useRef()
  const page2Ref = useRef()

  // 12个月数据
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, m) =>
      getCalendarDays(year, m, PREDEFINED_EVENTS)
    )
  }, [year])

  // ===== 关键：分页截图 =====
  const capturePage = async (el, pdf, isFirstPage) => {
    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
    })

    const img = canvas.toDataURL('image/png')

    if (!isFirstPage) pdf.addPage()

    pdf.addImage(
      img,
      'PNG',
      0,
      0,
      pdf.internal.pageSize.getWidth(),
      pdf.internal.pageSize.getHeight()
    )
  }

  const downloadPDF = async () => {
    const pdf = new jsPDF('landscape', 'px', [1600, 1000])

    await capturePage(page1Ref.current, pdf, true)
    await capturePage(page2Ref.current, pdf, false)

    pdf.save(`${year}日历.pdf`)
  }

  const renderMonths = (start, end) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 24,
      }}
    >
      {months.slice(start, end).map((days, i) => (
        <div
          key={i}
          style={{
            border: '1px solid #ddd',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              padding: 10,
              fontSize: 18,
              fontWeight: 600,
              borderBottom: '1px solid #eee',
            }}
          >
            {start + i + 1} 月
          </div>

          <CalendarGrid days={days} small />
        </div>
      ))}
    </div>
  )

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 头部 */}
      <div
        style={{
          height: 70,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          background: '#ffffff',
          borderBottom: '1px solid #e5e5e5',
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 600 }}>
          {year} 年日历（阳历 / 阴历）
        </div>

        <button
          onClick={downloadPDF}
          style={{
            padding: '10px 24px',
            borderRadius: 8,
            border: '1px solid #1677ff',
            color: '#1677ff',
            background: '#fff',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          下载 PDF
        </button>
      </div>

      {/* 页面 1：1~6 月 */}
      <div ref={page1Ref} style={{ padding: 30, background: '#ffffff' }}>
        {renderMonths(0, 6)}
      </div>

      {/* 页面 2：7~12 月 */}
      <div ref={page2Ref} style={{ padding: 30, background: '#ffffff', marginTop: 40 }}>
        {renderMonths(6, 12)}
      </div>
    </div>
  )
}
