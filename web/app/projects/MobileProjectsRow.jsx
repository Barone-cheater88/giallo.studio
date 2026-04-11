import Link from 'next/link'
import styles from './projects.module.css'

export default function MobileProjectsRow({ project }) {
  const orderRaw = project?.order ?? ''
  const orderNum = typeof orderRaw === 'number' ? orderRaw : parseInt(orderRaw, 10)
  const orderFormatted =
    !isNaN(orderNum) && orderNum > 0 ? String(orderNum).padStart(3, '0') : ''

  const title = project?.title ?? ''
  const slug = project?.slug?.current

  const activityVisible = project?.info?.activity?.visible !== false
  const activityText = (project?.info?.activity?.value ?? '').trim()

  const client = project?.info?.client?.value ?? ''
  const year = project?.info?.year?.value ?? ''

  const clientYearText =
    client && year ? `${client} – ${year}` : client || year

  const RowWrapper = slug ? Link : 'div'
  const rowProps = slug
    ? { href: `/projects/${slug}`, className: styles.mobileTableRow }
    : { className: styles.mobileTableRow }

  return (
    <RowWrapper {...rowProps}>
      <div className={styles.mobileRowContent}>
        {/* Riga 1: [N°] e titolo sulla stessa linea */}
        <div className={styles.mobileRowHeadingLine}>
          {orderFormatted !== '' && (
            <span className={styles.mobileRowOrder}>[{orderFormatted}]</span>
          )}
          <span className={styles.mobileRowName}>{title}</span>
          {slug && (
            <span className={styles.mobileRowArrow} aria-hidden="true">
              →
            </span>
          )}
        </div>

        {/* Riga 2: Activity (campo Sanity info.activity) */}
        {activityVisible && activityText !== '' && (
          <div className={styles.mobileRowActivityLine}>
            <span className={styles.mobileRowActivity}>{activityText}</span>
          </div>
        )}

        {/* Riga 3: Client – Year */}
        {(client || year) && (
          <div className={styles.mobileRowMetaLine}>
            <span className={styles.mobileRowClientYear}>{clientYearText}</span>
          </div>
        )}
      </div>
    </RowWrapper>
  )
}
