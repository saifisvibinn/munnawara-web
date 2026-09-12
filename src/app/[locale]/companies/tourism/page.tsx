import CompanyDetailPage from "@/components/sections/CompanyDetail"

type PageProps = {
  params: Promise<{ locale: string }>
}

const Page = (props: PageProps) => (
  <CompanyDetailPage {...props} slug="tourism" />
)

export default Page
