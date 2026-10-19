import type {
  AboutContent,
  AppLocale,
  CareRevealContent,
  CareerRole,
  ClientCategory,
  Company,
  ContactContent,
  CompanySlug,
  FaqItem,
  FleetCategory,
  FleetCategoryId,
  FleetPageContent,
  HomeContent,
  NewsPost,
  SiteConfig,
  Testimonial,
} from "./types"
import { siteConfig } from "./siteConfig"
import { photoManifest, type PhotoEntry } from "./photoManifest"
import { photoAlts as photoAltsAr } from "./ar/photoAlts"
import { photoAlts as photoAltsEn } from "./en/photoAlts"
import { photoAlts as photoAltsFr } from "./fr/photoAlts"
import { photoAlts as photoAltsId } from "./id/photoAlts"

import { about as aboutAr } from "./ar/about"
import { about as aboutEn } from "./en/about"
import { about as aboutFr } from "./fr/about"
import { about as aboutId } from "./id/about"
import { careReveal as careRevealAr } from "./ar/careReveal"
import { careReveal as careRevealEn } from "./en/careReveal"
import { careReveal as careRevealFr } from "./fr/careReveal"
import { careReveal as careRevealId } from "./id/careReveal"
import { careers as careersAr } from "./ar/careers"
import { careers as careersEn } from "./en/careers"
import { careers as careersFr } from "./fr/careers"
import { careers as careersId } from "./id/careers"
import { clients as clientsAr } from "./ar/clients"
import { clients as clientsEn } from "./en/clients"
import { clients as clientsFr } from "./fr/clients"
import { clients as clientsId } from "./id/clients"
import { companies as companiesAr } from "./ar/companies"
import { companies as companiesEn } from "./en/companies"
import { companies as companiesFr } from "./fr/companies"
import { companies as companiesId } from "./id/companies"
import { contact as contactAr } from "./ar/contact"
import { contact as contactEn } from "./en/contact"
import { contact as contactFr } from "./fr/contact"
import { contact as contactId } from "./id/contact"
import { faq as faqAr } from "./ar/faq"
import { faq as faqEn } from "./en/faq"
import { faq as faqFr } from "./fr/faq"
import { faq as faqId } from "./id/faq"
import { fleet as fleetAr } from "./ar/fleet"
import { fleet as fleetEn } from "./en/fleet"
import { fleet as fleetFr } from "./fr/fleet"
import { fleet as fleetId } from "./id/fleet"
import { fleetPage as fleetPageAr } from "./ar/fleetPage"
import { fleetPage as fleetPageEn } from "./en/fleetPage"
import { fleetPage as fleetPageFr } from "./fr/fleetPage"
import { fleetPage as fleetPageId } from "./id/fleetPage"
import { home as homeAr } from "./ar/home"
import { home as homeEn } from "./en/home"
import { home as homeFr } from "./fr/home"
import { home as homeId } from "./id/home"
import { news as newsAr } from "./ar/news"
import { news as newsEn } from "./en/news"
import { news as newsFr } from "./fr/news"
import { news as newsId } from "./id/news"
import { testimonials as testimonialsAr } from "./ar/testimonials"
import { testimonials as testimonialsEn } from "./en/testimonials"
import { testimonials as testimonialsFr } from "./fr/testimonials"
import { testimonials as testimonialsId } from "./id/testimonials"

const aboutByLocale = { ar: aboutAr, en: aboutEn, fr: aboutFr, id: aboutId } as const
const careRevealByLocale = {
  ar: careRevealAr,
  en: careRevealEn,
  fr: careRevealFr,
  id: careRevealId,
} as const
const contactByLocale = {
  ar: contactAr,
  en: contactEn,
  fr: contactFr,
  id: contactId,
} as const
const homeByLocale = { ar: homeAr, en: homeEn, fr: homeFr, id: homeId } as const
const testimonialsByLocale = {
  ar: testimonialsAr,
  en: testimonialsEn,
  fr: testimonialsFr,
  id: testimonialsId,
} as const
const companiesByLocale = {
  ar: companiesAr,
  en: companiesEn,
  fr: companiesFr,
  id: companiesId,
} as const
const fleetByLocale = { ar: fleetAr, en: fleetEn, fr: fleetFr, id: fleetId } as const
const fleetPageByLocale = {
  ar: fleetPageAr,
  en: fleetPageEn,
  fr: fleetPageFr,
  id: fleetPageId,
} as const
const clientsByLocale = {
  ar: clientsAr,
  en: clientsEn,
  fr: clientsFr,
  id: clientsId,
} as const
const faqByLocale = { ar: faqAr, en: faqEn, fr: faqFr, id: faqId } as const
const careersByLocale = {
  ar: careersAr,
  en: careersEn,
  fr: careersFr,
  id: careersId,
} as const
const newsByLocale = { ar: newsAr, en: newsEn, fr: newsFr, id: newsId } as const
const photoAltsByLocale = {
  ar: photoAltsAr,
  en: photoAltsEn,
  fr: photoAltsFr,
  id: photoAltsId,
} as const

export const getSiteConfig = (): SiteConfig => siteConfig

export const getAbout = (locale: AppLocale): AboutContent => aboutByLocale[locale]

export const getCareReveal = (locale: AppLocale): CareRevealContent =>
  careRevealByLocale[locale]

export const getContact = (locale: AppLocale): ContactContent =>
  contactByLocale[locale]

export const getHome = (locale: AppLocale): HomeContent => homeByLocale[locale]

export const getTestimonials = (locale: AppLocale): readonly Testimonial[] =>
  testimonialsByLocale[locale]

export const getCompanies = (locale: AppLocale): readonly Company[] =>
  companiesByLocale[locale]

export const getCompany = (
  locale: AppLocale,
  slug: CompanySlug,
): Company | undefined => getCompanies(locale).find((c) => c.slug === slug)

export const getFleet = (locale: AppLocale): readonly FleetCategory[] =>
  fleetByLocale[locale]

export const getFleetPage = (locale: AppLocale): FleetPageContent =>
  fleetPageByLocale[locale]

export const getFleetCategory = (
  locale: AppLocale,
  id: FleetCategoryId,
): FleetCategory | undefined => getFleet(locale).find((f) => f.id === id)

export const getClients = (locale: AppLocale): readonly ClientCategory[] =>
  clientsByLocale[locale]

export const getFaq = (locale: AppLocale): readonly FaqItem[] => faqByLocale[locale]

export const getCareers = (locale: AppLocale): readonly CareerRole[] =>
  careersByLocale[locale]

export const getNews = (locale: AppLocale): readonly NewsPost[] => newsByLocale[locale]

export const getNewsPost = (
  locale: AppLocale,
  slug: string,
): NewsPost | undefined => getNews(locale).find((p) => p.slug === slug)

export type GalleryPhoto = PhotoEntry & { alt: string }

export const getPhotos = (locale: AppLocale): readonly GalleryPhoto[] => {
  const alts = photoAltsByLocale[locale]
  return photoManifest.map((photo) => ({ ...photo, alt: alts[photo.id] ?? "" }))
}
