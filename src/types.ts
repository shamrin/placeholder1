export interface WSChannel {
  write(data: any): void;
  close(): void;
}

export interface WSChannelCallbacks {
  onmessage(msg: any): void;
  onopen(): void;
}

