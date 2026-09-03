/**
 * Excel-Compatible UTF-8 CSV Export Utility for Flavour & Co.
 * 
 * Features:
 * - Prepends UTF-8 Byte Order Mark (BOM \uFEFF / 0xEF 0xBB 0xBF) for seamless opening in Microsoft Excel (Windows/Mac), Apple Numbers, and Google Sheets.
 * - Adheres to RFC 4180 CSV specifications with safe escaping of quotes, commas, and line breaks.
 * - Prevents formula injection and scientific notation issues for alphanumeric identifiers, coupon codes, and phone numbers.
 * - Uses Blob and Object URLs to avoid URI length limitations and character corruption.
 */

export interface CSVExportColumn<T> {
  header: string;
  accessor: (item: T, index: number) => string | number | boolean | null | undefined;
}

/**
 * Format any cell value into a clean, safe CSV string.
 */
export function formatCSVCell(value: any): string {
  if (value === null || value === undefined) {
    return '""';
  }

  if (typeof value === "boolean") {
    return value ? '"Yes"' : '"No"';
  }

  // Convert to string and sanitize
  let stringValue = String(value);

  // Guard against spreadsheet formula injection (=, +, -, @)
  if (/^[=+\-@\t\r]/.test(stringValue)) {
    // Prefix with single quote so Excel treats it as pure text
    stringValue = `'${stringValue}`;
  }

  // Escape double quotes by doubling them
  const escaped = stringValue.replace(/"/g, '""');

  return `"${escaped}"`;
}

/**
 * Convert structured data into a formatted CSV string with UTF-8 BOM.
 */
export function generateCSVContent<T>(
  data: T[],
  columns: CSVExportColumn<T>[]
): string {
  const headerRow = columns.map((col) => formatCSVCell(col.header)).join(",");
  
  const dataRows = data.map((item, index) => {
    return columns
      .map((col) => {
        const val = col.accessor(item, index);
        return formatCSVCell(val);
      })
      .join(",");
  });

  return [headerRow, ...dataRows].join("\r\n");
}

/**
 * Triggers a browser download of the CSV content with UTF-8 BOM.
 */
export function triggerCSVDownload(filename: string, csvContent: string): void {
  // UTF-8 BOM: 0xEF, 0xBB, 0xBF ensures Excel parses characters and symbols perfectly
  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1500);
}

/**
 * Format a Date object or ISO string into a human-friendly date (e.g., "03 Sep 2026")
 */
export function formatExportDate(dateInput?: string | Date | null): string {
  if (!dateInput) return "N/A";
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    return d.toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return String(dateInput);
  }
}

/**
 * Format a Date object or ISO string into a human-friendly time (e.g., "04:30 PM AEST")
 */
export function formatExportTime(dateInput?: string | Date | null): string {
  if (!dateInput) return "N/A";
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch {
    return "N/A";
  }
}

/**
 * Format a Date into full timestamp "DD MMM YYYY, hh:mm:ss AM/PM"
 */
export function formatExportTimestamp(dateInput?: string | Date | null): string {
  if (!dateInput) return "N/A";
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    return `${formatExportDate(d)}, ${formatExportTime(d)}`;
  } catch {
    return String(dateInput);
  }
}

/**
 * Helper to export Customers data to Excel-ready CSV
 */
export interface ExportCustomerItem {
  id?: string;
  clerk_user_id: string;
  email: string;
  name: string;
  role: string;
  image_url?: string;
  created_at: string;
  updated_at?: string;
  orders_count?: number;
  total_spent?: number;
  phone?: string;
  last_order_date?: string;
}

export function exportCustomersToCSV(customers: ExportCustomerItem[]): void {
  const columns: CSVExportColumn<ExportCustomerItem>[] = [
    {
      header: "Customer Name",
      accessor: (c) => c.name || "Unnamed Customer",
    },
    {
      header: "Email Address",
      accessor: (c) => c.email || "",
    },
    {
      header: "Account Role",
      accessor: (c) => (c.role ? c.role.toUpperCase() : "USER"),
    },
    {
      header: "Total Orders",
      accessor: (c) => (typeof c.orders_count === "number" ? c.orders_count : 0),
    },
    {
      header: "Total Spent (AUD)",
      accessor: (c) =>
        typeof c.total_spent === "number"
          ? `$${c.total_spent.toFixed(2)}`
          : "$0.00",
    },
    {
      header: "Contact Phone",
      accessor: (c) => c.phone || "Not Provided",
    },
    {
      header: "Joined Date",
      accessor: (c) => formatExportDate(c.created_at),
    },
    {
      header: "Joined Time",
      accessor: (c) => formatExportTime(c.created_at),
    },
    {
      header: "Full Joined Timestamp",
      accessor: (c) => formatExportTimestamp(c.created_at),
    },
    {
      header: "Last Order Date",
      accessor: (c) => (c.last_order_date ? formatExportDate(c.last_order_date) : "No Orders Yet"),
    },
    {
      header: "Clerk User ID",
      accessor: (c) => c.clerk_user_id || "",
    },
    {
      header: "Database ID",
      accessor: (c) => c.id || "",
    },
    {
      header: "Profile Avatar URL",
      accessor: (c) => c.image_url || "None",
    },
  ];

  const csvContent = generateCSVContent(customers, columns);
  const dateStamp = new Date().toISOString().split("T")[0];
  const filename = `flavour-co-customers-${dateStamp}.csv`;

  triggerCSVDownload(filename, csvContent);
}

/**
 * Helper to export Subscribers data to Excel-ready CSV
 */
export interface ExportSubscriberItem {
  id: string;
  email: string;
  discountCode: string;
  discountUsed: boolean;
  firstOrderId?: string | null;
  source: string;
  createdAt: string;
  updatedAt?: string;
}

export function exportSubscribersToCSV(subscribers: ExportSubscriberItem[]): void {
  const columns: CSVExportColumn<ExportSubscriberItem>[] = [
    {
      header: "Subscriber Email",
      accessor: (s) => s.email || "",
    },
    {
      header: "Coupon Code",
      accessor: (s) => s.discountCode || "PIECLUB10",
    },
    {
      header: "Offer Description",
      accessor: () => "10% Off First Order",
    },
    {
      header: "Discount Status",
      accessor: (s) => (s.discountUsed ? "Redeemed / Used" : "Active / Available"),
    },
    {
      header: "First Order ID",
      accessor: (s) => s.firstOrderId || "Not Yet Redeemed",
    },
    {
      header: "Signup Source",
      accessor: (s) => {
        if (s.source === "offer_modal") return "Website Offer Popup";
        if (s.source === "manual_admin") return "Manual Admin Entry";
        if (s.source === "in_store_event") return "In-Store / Market Event";
        if (s.source === "partner_inquiry") return "Partner Referral";
        return s.source || "Website Form";
      },
    },
    {
      header: "Subscribed Date",
      accessor: (s) => formatExportDate(s.createdAt),
    },
    {
      header: "Subscribed Time",
      accessor: (s) => formatExportTime(s.createdAt),
    },
    {
      header: "Full Subscribed Timestamp",
      accessor: (s) => formatExportTimestamp(s.createdAt),
    },
    {
      header: "Subscriber Record ID",
      accessor: (s) => s.id || "",
    },
  ];

  const csvContent = generateCSVContent(subscribers, columns);
  const dateStamp = new Date().toISOString().split("T")[0];
  const filename = `flavour-co-subscribers-${dateStamp}.csv`;

  triggerCSVDownload(filename, csvContent);
}

/**
 * Helper to export Orders data to Excel-ready CSV
 */
export function exportOrdersToCSV(orders: any[]): void {
  const columns: CSVExportColumn<any>[] = [
    {
      header: "Order Number",
      accessor: (o) => o.orderNumber || o.order_number || "",
    },
    {
      header: "Customer Name",
      accessor: (o) => o.customerName || o.customer_name || "",
    },
    {
      header: "Customer Email",
      accessor: (o) => o.customerEmail || o.customer_email || "",
    },
    {
      header: "Customer Phone",
      accessor: (o) => o.customerPhone || o.customer_phone || "",
    },
    {
      header: "Order Status",
      accessor: (o) => (o.status ? String(o.status).toUpperCase() : "PENDING"),
    },
    {
      header: "Payment Status",
      accessor: (o) => (o.paymentStatus || o.payment_status ? String(o.paymentStatus || o.payment_status).toUpperCase() : "PENDING"),
    },
    {
      header: "Payment Method",
      accessor: (o) => o.paymentMethod || o.payment_method || "Square Credit Card",
    },
    {
      header: "Items Count",
      accessor: (o) => o.itemsCount || o.items_count || 1,
    },
    {
      header: "Subtotal (AUD)",
      accessor: (o) => `$${(Number(o.subtotal) || 0).toFixed(2)}`,
    },
    {
      header: "Shipping Fee (AUD)",
      accessor: (o) => `$${(Number(o.shippingFee || o.shipping_fee) || 0).toFixed(2)}`,
    },
    {
      header: "Total Amount (AUD)",
      accessor: (o) => `$${(Number(o.totalAmount || o.total_amount) || 0).toFixed(2)}`,
    },
    {
      header: "Courier",
      accessor: (o) => o.courierName || o.courier_name || "",
    },
    {
      header: "Tracking Number",
      accessor: (o) => o.trackingNumber || o.tracking_number || "",
    },
    {
      header: "Order Date",
      accessor: (o) => formatExportDate(o.createdAt || o.created_at),
    },
    {
      header: "Order Time",
      accessor: (o) => formatExportTime(o.createdAt || o.created_at),
    },
    {
      header: "Full Order Timestamp",
      accessor: (o) => formatExportTimestamp(o.createdAt || o.created_at),
    },
  ];

  const csvContent = generateCSVContent(orders, columns);
  const dateStamp = new Date().toISOString().split("T")[0];
  const filename = `flavour-co-orders-${dateStamp}.csv`;

  triggerCSVDownload(filename, csvContent);
}

