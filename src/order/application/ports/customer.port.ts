export const CUSTOMER = Symbol('CUSTOMER');

export interface CustomerPort {
  exists(customerId: string): Promise<boolean>;
}
