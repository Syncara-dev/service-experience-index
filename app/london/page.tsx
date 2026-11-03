// /london shows the same evidence-based area list as /locations (canonical: /locations).
import LocationsListPage, { metadata as locationsMetadata } from "../locations/page"

export const revalidate = 3600
export const metadata = locationsMetadata

export default LocationsListPage
