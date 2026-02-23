/**
 * Contact type definitions
 */

/**
 * Complete contact message stored in database
 */
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

/**
 * Contact form submission data
 */
export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}
