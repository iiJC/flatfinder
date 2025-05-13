import { sendEmail } from "@/lib/email";

export async function GET() {
  await sendEmail({
    to: "jonathanchan1249@gmail.com",
    subject: "Test Email",
    text: "Hello from FlatFinder!",
    html: "<p>This is a test email 🚀</p>"
  });

  return Response.json({ success: true });
}
