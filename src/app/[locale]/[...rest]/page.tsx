import { notFound } from "next/navigation"

// Routes unknown paths under a locale to the branded [locale]/not-found page.
const CatchAll = () => notFound()

export default CatchAll
