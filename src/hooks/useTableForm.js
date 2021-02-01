import { useAntdTable } from 'ahooks'
const DATE = 'date'
const TIME = 'time'

// 表格表单联动
const useFormTable = (request, option = {}) => {
  const { defaultParams } = option
  const [{ base: baseDateTime }] = defaultParams
  const service = (arg, formData) => {
    let { current, base, pageSize } = arg
    let query = {}
    Object.entries(formData).forEach(([key, value]) => {
      if (value) query[key] = value
    })
    if (query[DATE]) delete query[DATE]
    if (query[TIME]) delete query[TIME]
    query = formData ? query : { ...arg }
    return request({ currentPage: current ?? 1, ...base, ...baseDateTime, ...query, pageSize: pageSize ?? 20 })
  }
  return useAntdTable(service, {
    formatResult: res => {
      return {
        list: res.result,
        total: res.totalCount
      }
    },
    paginated: true,
    defaultPageSize: 20,
    ...option
  })
}
export default useFormTable
