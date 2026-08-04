import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { WholesaleInquiry } from "@/lib/types";
import { requireAdminApi } from "@/lib/auth";

// In-memory fallback storage for inquiries if Supabase keys aren't set
const mockWholesaleInquiries: WholesaleInquiry[] = [
  {
    id: "ws-1",
    businessName: "Merivale Hospitality Group",
    contactName: "James Thornton",
    email: "james.t@merivale.com",
    phone: "+61 412 345 678",
    businessType: "Hotel & Resort",
    estimatedVolume: "500-1000 units/week",
    message: "Interested in stocking your Mini Butter Chicken & Beef Rendang pies for our Sydney event venues.",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ws-2",
    businessName: "Sheraton Grand Hyde Park",
    contactName: "Claire Dupont",
    email: "c.dupont@sheraton.com",
    phone: "+61 498 765 432",
    businessType: "Hotel & Resort",
    estimatedVolume: "1000+ units/week",
    message: "Requesting wholesale pricing guide and sample catering box for Executive Lounge.",
    status: "reviewed",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export async function GET() {
  const { error: authError } = await requireAdminApi();
  if (authError) return authError;

  try {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("wholesale_inquiries")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          const formatted: WholesaleInquiry[] = data.map((item) => ({
            id: item.id,
            businessName: item.business_name,
            contactName: item.contact_name,
            email: item.email,
            phone: item.phone,
            businessType: item.business_type,
            estimatedVolume: item.estimated_volume || "",
            message: item.message,
            status: item.status || "pending",
            createdAt: item.created_at,
          }));
          return NextResponse.json({ success: true, data: formatted });
        }
      }
    }

    return NextResponse.json({ success: true, data: mockWholesaleInquiries });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessName, contactName, email, phone, businessType, estimatedVolume, message } = body;

    // Security & vulnerability check: Input sanitization & field validation
    if (!contactName || typeof contactName !== "string" || contactName.trim() === "") {
      return NextResponse.json({ success: false, error: "Contact name is required" }, { status: 400 });
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ success: false, error: "Valid email address is required" }, { status: 400 });
    }
    if (!businessName || typeof businessName !== "string" || businessName.trim() === "") {
      return NextResponse.json({ success: false, error: "Business name is required" }, { status: 400 });
    }

    const newInquiry: WholesaleInquiry = {
      id: `ws-${Date.now()}`,
      businessName: businessName.trim(),
      contactName: contactName.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || "").trim(),
      businessType: (businessType || "Retail / Catering").trim(),
      estimatedVolume: (estimatedVolume || "").trim(),
      message: (message || "").trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { error } = await supabase.from("wholesale_inquiries").insert([
          {
            business_name: newInquiry.businessName,
            contact_name: newInquiry.contactName,
            email: newInquiry.email,
            phone: newInquiry.phone,
            business_type: newInquiry.businessType,
            estimated_volume: newInquiry.estimatedVolume,
            message: newInquiry.message,
            status: "pending",
          },
        ]);

        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }
      }
    } else {
      mockWholesaleInquiries.unshift(newInquiry);
    }

    return NextResponse.json({ success: true, message: "Wholesale inquiry submitted successfully", data: newInquiry }, { status: 201 });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { error: authError } = await requireAdminApi();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "ID and status are required" }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { error } = await supabase
          .from("wholesale_inquiries")
          .update({ status })
          .eq("id", id);
        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }
      }
    } else {
      const idx = mockWholesaleInquiries.findIndex((i) => i.id === id);
      if (idx !== -1) {
        mockWholesaleInquiries[idx].status = status;
      }
    }

    return NextResponse.json({ success: true, message: "Status updated" });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { error: authError } = await requireAdminApi();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { error } = await supabase.from("wholesale_inquiries").delete().eq("id", id);
        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }
      }
    } else {
      const idx = mockWholesaleInquiries.findIndex((i) => i.id === id);
      if (idx !== -1) mockWholesaleInquiries.splice(idx, 1);
    }

    return NextResponse.json({ success: true, message: "Inquiry deleted" });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
