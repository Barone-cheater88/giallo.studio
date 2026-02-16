import Link from 'next/link'
import { sanityClient } from '@/sanity'
import { siteSettingsQuery } from '@/lib/sanity.queries'
import Image from 'next/image'
import NotFoundContent from './NotFoundContent'

export default async function NotFound() {
  const settings = await sanityClient.fetch(siteSettingsQuery)
  const logo = settings?.logo?.asset?.url

  return <NotFoundContent logo={logo} />
}

export const metadata = {
  title: '404 - Page not found',
  description: 'The page you are looking for was not found.',
}
