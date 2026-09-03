export interface CartItemModifier {
  modifierId: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  notes?: string;
  modifiers: CartItemModifier[];
  participantId?: string;
  participantName?: string;
}

export interface SubmitOrderPayload {
  qrSecretKey: string;
  participantId?: string;
  participantName?: string;
  items: {
    productId: string;
    quantity: number;
    notes?: string;
    modifierIds?: string[];
  }[];
}

export interface WaiterClaimPayload {
  requestId: string;
  waiterId: string;
}

export interface MediaUploadResult {
  fileId: string;
  driveUrl: string;
  fileName: string;
  mimeType: string;
  size: number;
}

export interface RealtimeEventPayload<T = any> {
  event: 'NEW_ORDER' | 'ORDER_STATUS_CHANGED' | 'NEW_SERVICE_REQUEST' | 'SERVICE_REQUEST_CLAIMED' | 'ORDER_READY_CALLING';
  tenantId: string;
  outletId: string;
  data: T;
}
