export function formatExcelDate(numb, format = '/') {
   numb = Math.floor(numb)
    const time = new Date(
      (numb - 25567) * 24 * 3600000 -
        5 * 60 * 1000 -
        43 * 1000 -
        24 * 3600000 -
        8 * 3600000
    )
    time.setYear(time.getFullYear())
    const year = time.getFullYear() + ''
    const month = time.getMonth() + 1 + ''
    const date = time.getDate() + ''
    if (format && format.length === 1) {
      return year + format + month + format + date
    }
    return (
      year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    )
  }
  