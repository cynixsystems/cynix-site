export interface StoredLead {
  name: string;
  whatsapp: string;
  city: string;
  businessType?: string;
  objective?: string;
  timestamp: string;
}

const leadsStore: StoredLead[] = [];

export function saveLead(lead: Omit<StoredLead, "timestamp">): StoredLead {
  const withTimestamp = { ...lead, timestamp: new Date().toISOString() };
  leadsStore.push(withTimestamp);
  return withTimestamp;
}

export function getLeads(): StoredLead[] {
  return [...leadsStore];
}
