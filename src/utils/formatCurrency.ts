const USD_TO_IDR = 16000

export const convertUsdToIdr = (price: number): number => {
  return price * USD_TO_IDR
}

export const formatRupiah = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)
}