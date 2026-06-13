export const PRODUCT = Symbol('PRODUCT');

export interface ProductPort {
  exists(productId: string): Promise<boolean>;
}
