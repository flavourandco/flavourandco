import React from "react";

interface BaseLayoutProps {
  previewText?: string;
  badgeText?: string;
  badgeColor?: string;
  badgeBg?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footerNote?: string;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  previewText,
  badgeText,
  badgeColor = "#6b1e30",
  badgeBg = "#fdf2f4",
  title,
  subtitle,
  children,
  footerNote,
}) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title>{title}</title>
        <style>{`
          body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
          table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
          img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; max-width: 100%; }
          table { border-collapse: collapse !important; }
          body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #fdf8f3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
          @media screen and (max-width: 600px) {
            .mobile-container { width: 100% !important; max-width: 100% !important; }
            .mobile-padding { padding-left: 14px !important; padding-right: 14px !important; }
            .mobile-stack { display: block !important; width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; text-align: left !important; }
            .mobile-center { text-align: center !important; }
            .mobile-btn { display: block !important; width: 100% !important; box-sizing: border-box !important; text-align: center !important; }
            .mobile-hide { display: none !important; }
            .mobile-title { font-size: 20px !important; }
          }
        `}</style>
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: "#fdf8f3", color: "#1c1410" }}>
        {/* Hidden preview text for email client inboxes */}
        {previewText && (
          <div
            style={{
              display: "none",
              fontSize: "1px",
              lineHeight: "1px",
              maxHeight: 0,
              maxWidth: 0,
              opacity: 0,
              overflow: "hidden",
            }}
          >
            {previewText}
            {"\u00A0\u200C".repeat(40)}
          </div>
        )}

        <table
          role="presentation"
          cellPadding="0"
          cellSpacing="0"
          border={0}
          width="100%"
          style={{ backgroundColor: "#fdf8f3", width: "100%" }}
        >
          <tbody>
            <tr>
              <td align="center" style={{ padding: "32px 12px" }} className="mobile-padding">
                {/* Main Email Card */}
                <table
                  role="presentation"
                  cellPadding="0"
                  cellSpacing="0"
                  border={0}
                  width="100%"
                  className="mobile-container"
                  style={{
                    maxWidth: "600px",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid #ede3d7",
                    boxShadow: "0 4px 16px rgba(107, 30, 48, 0.04)",
                  }}
                >
                  <tbody>
                    {/* Header: Brand Banner */}
                    <tr>
                      <td
                        align="center"
                        style={{
                          backgroundColor: "#07402b",
                          padding: "28px 24px",
                          borderBottom: "3px solid #E3A72B",
                        }}
                      >
                        <table role="presentation" cellPadding="0" cellSpacing="0" border={0} width="100%">
                          <tbody>
                            <tr>
                              <td align="center">
                                <span
                                  style={{
                                    fontFamily: "Georgia, 'Playfair Display', serif",
                                    fontSize: "26px",
                                    fontWeight: "bold",
                                    letterSpacing: "0.05em",
                                    color: "#ffffff",
                                    textTransform: "uppercase",
                                    display: "block",
                                  }}
                                >
                                  Flavour &amp; Co.
                                </span>
                                <span
                                  style={{
                                    fontSize: "10px",
                                    letterSpacing: "0.25em",
                                    color: "#E3A72B",
                                    textTransform: "uppercase",
                                    fontWeight: "600",
                                    display: "block",
                                    marginTop: "4px",
                                  }}
                                >
                                  Artisanal Bakery &bull; Sydney, Australia
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Notification Hero / Title Banner */}
                    <tr>
                      <td style={{ padding: "28px 32px 20px 32px" }} className="mobile-padding">
                        {badgeText && (
                          <div style={{ marginBottom: "12px" }}>
                            <span
                              style={{
                                display: "inline-block",
                                backgroundColor: badgeBg,
                                color: badgeColor,
                                fontSize: "11px",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                padding: "4px 10px",
                                borderRadius: "4px",
                                border: `1px solid ${badgeColor}33`,
                              }}
                            >
                              {badgeText}
                            </span>
                          </div>
                        )}

                        <h1
                          style={{
                            margin: "0 0 8px 0",
                            fontFamily: "Georgia, 'Playfair Display', serif",
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#6b1e30",
                            lineHeight: "1.3",
                          }}
                        >
                          {title}
                        </h1>

                        {subtitle && (
                          <p
                            style={{
                              margin: "0",
                              fontSize: "14px",
                              color: "#57534e",
                              lineHeight: "1.5",
                            }}
                          >
                            {subtitle}
                          </p>
                        )}
                      </td>
                    </tr>

                    {/* Main Email Body Content */}
                    <tr>
                      <td style={{ padding: "0 32px 28px 32px" }} className="mobile-padding">
                        {children}
                      </td>
                    </tr>

                    {/* Optional Custom Note */}
                    {footerNote && (
                      <tr>
                        <td
                          style={{
                            padding: "16px 32px",
                            backgroundColor: "#faf6f0",
                            borderTop: "1px solid #ede3d7",
                            fontSize: "12px",
                            color: "#78716c",
                            lineHeight: "1.5",
                            fontStyle: "italic",
                          }}
                          className="mobile-padding"
                        >
                          {footerNote}
                        </td>
                      </tr>
                    )}

                    {/* Footer Section */}
                    <tr>
                      <td
                        style={{
                          backgroundColor: "#1c1410",
                          padding: "28px 32px",
                          color: "#a8a29e",
                          textAlign: "center",
                          fontSize: "11px",
                          lineHeight: "1.6",
                        }}
                        className="mobile-padding"
                      >
                        <p style={{ margin: "0 0 8px 0", color: "#ffffff", fontWeight: "bold", fontSize: "12px" }}>
                          Flavour &amp; Co. Gourmet Pies &amp; Bakery
                        </p>
                        <p style={{ margin: "0 0 12px 0" }}>
                          Sydney, New South Wales, Australia &bull; Freshly Baked &amp; Express Delivered
                        </p>
                        <p style={{ margin: "0 0 12px 0", color: "#78716c" }}>
                          Need help with your order? Contact our support team at{" "}
                          <a
                            href="mailto:help@flavourandco.com.au"
                            style={{ color: "#E3A72B", textDecoration: "underline" }}
                          >
                            help@flavourandco.com.au
                          </a>
                        </p>
                        <div
                          style={{
                            borderTop: "1px solid #33261f",
                            paddingTop: "12px",
                            marginTop: "12px",
                            color: "#57534e",
                            fontSize: "10px",
                          }}
                        >
                          &copy; {new Date().getFullYear()} Flavour &amp; Co. All rights reserved. &bull; This is an automated transactional order notification.
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
};
