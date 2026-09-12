import CompanyDetailPage from "@/components/sections/CompanyDetail"

type PageProps = {
  params: Promise<{ locale: string }>
}

const Page = (props: PageProps) => (
  <CompanyDetailPage {...props} slug="umrah-services" />
)

export default Page
