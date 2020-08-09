
export type CalledAmountIOU = {
  currency: string,
  value: string,
  issuer?: string
}

export type CalledAmount = string | CalledAmountIOU


export type Amount = {
  value: string,
  currency: string,
  issuer?: string,
  counterparty?: string
}


// Amount where counterparty and value are optional
export type LaxLaxAmount = {
  currency: string,
  value?: string,
  issuer?: string,
  counterparty?: string
}

// A currency-counterparty pair, or just currency if it's CALL
export type Issue = {
  currency: string,
  issuer?: string,
  counterparty?: string
}

// TODO check issuer field
export type Adjustment = {
  address: string,
  amount: Amount,
  tag?: number,
  issuer?: string
}

// TODO check issuer field
export type MaxAdjustment = {
  address: string,
  maxAmount: Amount,
  tag?: number,
  issuer?: string
}
// TODO check issuer field
export type MinAdjustment = {
  address: string,
  minAmount: Amount,
  tag?: number,
  issuer?: string
}

export type Memo = {
  type?: string,
  format?: string,
  data?: string
}

export type ApiMemo = {
  MemoData?: string,
  MemoType?: string,
  MemoFormat?: string
}

