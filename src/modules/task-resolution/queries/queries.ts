export const onDemandTaskResolutionsQuery = () => `
query {
  onDemandTaskResolutions {
    description
    id
    achieved
    task{
      title
      description
      id
    }
  }
}
`;

export const createOnDemandTaskResolution = (tid: string, d: string) => `
  mutation{
    createOnDemandTaskResolution(taskId:"${tid}", description:"${d}") {
      path
      message
    }
  }
`
