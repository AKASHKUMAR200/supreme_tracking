// MongoDB Type Definitions and API Functions

export type User = {
  id: string;
  name: string;
  mobile_number: string;
  role: 'user' | 'admin';
  password: string;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  product_name: string;
  current_stage: number;
  courier_id: string | null;
  courier_link: string | null;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
};

export type ProcessUpdate = {
  id: string;
  order_id: string;
  stage_number: number;
  status: 'pending' | 'in_progress' | 'completed';
  photo_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Bill = {
  id: string;
  order_id: string;
  bill_url: string;
  created_at: string;
};

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  attachment_url: string | null;
  timestamp: string;
  read: boolean;
};

// API Helper Functions
export const api = {
  async get(endpoint: string) {
    const res = await fetch(`/api${endpoint}`);
    if (!res.ok) throw new Error('API request failed');
    return res.json();
  },

  async post(endpoint: string, data: any) {
    const res = await fetch(`/api${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('API request failed');
    return res.json();
  },

  async put(endpoint: string, data: any) {
    const res = await fetch(`/api${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('API request failed');
    return res.json();
  },

  async delete(endpoint: string) {
    const res = await fetch(`/api${endpoint}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('API request failed');
    return res.json();
  },
};
