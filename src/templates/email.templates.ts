export interface OtpEmailParams {
  fullName?: string;
  email: string;
  otp: string;
  expiredMinutes?: number;
}

export const otpEmailTemplate = ({
  fullName,
  email,
  otp,
  expiredMinutes = 10,
}: OtpEmailParams): string => {
  return `
          <div style="max-width:520px;margin:0 auto;font-family:Arial;background:#fff;border-radius:8px;border:1px solid #e5e7eb;">
            <div style="background:#0747A6;padding:10px 20px;display:flex;align-items:center;">
              <img
                src="https://scontent.fhan4-1.fna.fbcdn.net/v/t39.30808-1/375283710_122121616994012874_2270389940254831183_n.jpg"
                style="height:40px;border-radius:100%;"
              />
              <h2 style="color:#fff;margin-left:10px;">Shinhan DS</h2>
            </div>
        
            <div style="padding:24px;color:#111827;">
              <p>Hello <b>${fullName || email}</b>,</p>
        
              <p>Please use the OTP code below to verify your account:</p>
        
              <div style="background:#f0f6ff;border:1px dashed #0747A6;padding:16px;text-align:center;">
                <span style="font-size:28px;font-weight:bold;color:#0747A6;">
                  ${otp}
                </span>
              </div>
        
              <p>This OTP will expire in <strong>${expiredMinutes} minutes</strong>.</p>
        
              <p style="font-size:13px;color:#6b7280;">
                © ${new Date().getFullYear()} Shinhan DS
              </p>
            </div>
          </div>
          `;
};
