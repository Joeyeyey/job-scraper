export type Filters = {
    titleIncludes?: string[],
    titleExcludes?: string[],
    locationIncludes?: string[],
    locationExcludes?: string[]
}

export type JobListing = {
    id: string,
    jobTitle: string,
    jobLocation: string,
    jobUrl: string,
    foundDate: string
}
