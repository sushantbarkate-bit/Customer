export interface Contact {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  micr?: string;
  ifsc?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface HeaderConfig {
  headerTitle?: string;
  showAddButton?: boolean;
  showEditButton?: boolean;
  showCancelButton?: boolean;
  showSaveButton?: boolean;
  showNavigationArrow?: boolean;
}
