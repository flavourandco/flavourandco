import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { ContactInquiry } from "@/lib/types";
import { requireAdminApi } from "@/lib/auth";

const mockContactInquiries: ContactInquiry[] = [
  {
    id: "cnt-1",
    name: "Amanda Miller",
    email: "amanda.m@gmail.com",
    phone: "+61 422 111 222",
    subject: "Catering for Private Birthday Event",
    message: "Hi! Looking to order 50 mini butter chicken pies for a weekend gathering in Sydney.",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "cnt-2",
    name: "Robert Chen",
    email: "robert.c@techcorp.au",
    phone: "+61 433 999 888",
    subject: "Corporate Lunch Order",
    message: "Do you deliver frozen packs directly to North Sydney offices on Thursday mornings?",
    status: "replied",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
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
          .from("contact_inquiries")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          const formatted: ContactInquiry[] = data.map((item) => ({
            id: item.id,
            name: item.name,
            email: item.email,
            phone: item.phone,
            subject: item.subject || "",
            message: item.message,
            status: item.status || "pending",
            createdAt: item.created_at,
          }));
          return NextResponse.json({ success: true, data: formatted });
        }
      }
    }

    return NextResponse.json({ success: true, data: mockContactInquiries });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Input validation & security checks
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ success: false, error: "Valid email is required" }, { status: 400 });
    }
    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 });
    }

    const newInquiry: ContactInquiry = {
      id: `cnt-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || "").trim(),
      subject: (subject || "General Inquiry").trim(),
      message: message.trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { error } = await supabase.from("contact_inquiries").insert([
          {
            name: newInquiry.name,
            email: newInquiry.email,
            phone: newInquiry.phone,
            subject: newInquiry.subject,
            message: newInquiry.message,
            status: "pending",
          },
        ]);

        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }
      }
    } else {
      mockContactInquiries.unshift(newInquiry);
    }

    return NextResponse.json({ success: true, message: "Contact message sent successfully", data: newInquiry }, { status: 201 });
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
          .from("contact_inquiries")
          .update({ status })
          .eq("id", id);
        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }
      }
    } else {
      const idx = mockContactInquiries.findIndex((i) => i.id === id);
      if (idx !== -1) {
        mockContactInquiries[idx].status = status;
      }
    }

    return NextResponse.json({ success: true, message: "Contact inquiry updated" });
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
        const { error } = await supabase.from("contact_inquiries").delete().eq("id", id);
        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }
      }
    } else {
      const idx = mockContactInquiries.findIndex((i) => i.id === id);
      if (idx !== -1) mockContactInquiries.splice(idx, 1);
    }

    return NextResponse.json({ success: true, message: "Contact inquiry deleted" });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
