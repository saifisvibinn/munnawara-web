import type {
  AboutContent,
  AppLocale,
  CareerRole,
  ClientCategory,
  Company,
  CompanySlug,
  FaqItem,
  FleetCategory,
  FleetCategoryId,
  HomeContent,
  NewsPost,
  SiteConfig,
  Testimonial,
} from "./types"
import { siteConfig } from "./siteConfig"

import { about as aboutAr } from "./ar/about"
import { about as aboutEn } from "./en/about"
import { careers as careersAr } from "./ar/careers"
import { careers as careersEn } from "./en/careers"
import { clients as clientsAr } from "./ar/clients"
import { clients as clientsEn } from "./en/clients"
import { companies as companiesAr } from "./ar/companies"
import { companies as companiesEn } from "./en/companies"
import { faq as faqAr } from "./ar/faq"
import { faq as faqEn } from "./en/faq"
import { fleet as fleetAr } from "./ar/fleet"
import { fleet as fleetEn } from "./en/fleet"
import { home as homeAr } from "./ar/home"
import { home as homeEn } from "./en/home"
import { news as newsAr } from "./ar/news"
import { news as newsEn } from "./en/news"
import { testimonials as testimonialsAr } from "./ar/testimonials"
import { testimonials as testimonialsEn } from "./en/testimonials"

const isAr = (locale: AppLocale) => locale === "ar"

export const getSiteConfig = (): SiteConfig => siteConfig

export const getAbout = (locale: AppLocale): AboutContent =>
  isAr(locale) ? aboutAr : aboutEn

export const getHome = (locale: AppLocale): HomeContent =>
  isAr(locale) ? homeAr : homeEn

export const getTestimonials = (locale: AppLocale): readonly Testimonial[] =>
  isAr(locale) ? testimonialsAr : testimonialsEn

export const getCompanies = (locale: AppLocale): readonly Company[] =>
  isAr(locale) ? companiesAr : companiesEn

export const getCompany = (
  locale: AppLocale,
  slug: CompanySlug,
): Company | undefined => getCompanies(locale).find((c) => c.slug === slug)

export const getFleet = (locale: AppLocale): readonly FleetCategory[] =>
  isAr(locale) ? fleetAr : fleetEn

export const getFleetCategory = (
  locale: AppLocale,
  id: FleetCategoryId,
): FleetCategory | undefined => getFleet(locale).find((f) => f.id === id)

export const getClients = (locale: AppLocale): readonly ClientCategory[] =>
  isAr(locale) ? clientsAr : clientsEn

export const getFaq = (locale: AppLocale): readonly FaqItem[] =>
  isAr(locale) ? faqAr : faqEn

export const getCareers = (locale: AppLocale): readonly CareerRole[] =>
  isAr(locale) ? careersAr : careersEn

export const getNews = (locale: AppLocale): readonly NewsPost[] =>
  isAr(locale) ? newsAr : newsEn

export const getNewsPost = (
  locale: AppLocale,
  slug: string,
): NewsPost | undefined => getNews(locale).find((p) => p.slug === slug)
