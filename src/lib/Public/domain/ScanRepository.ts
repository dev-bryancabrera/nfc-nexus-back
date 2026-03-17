export interface IScanRepository {
  record(data: {
    card_id: string;
    user_id: string;
    device_type: string;
    user_agent: string | null;
    action: string;
    referrer: string | null;
  }): Promise<void>;
}
