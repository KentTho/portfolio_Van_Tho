import { describe, expect, it } from "vitest";
import { copyLabel, copyAnnounce } from "@/components/public/sections/contact-copy";

const t = {
  copyEmail: "Sao chép email",
  copied: "Đã sao chép",
  copyError: "Không thể sao chép",
  copiedAnnounce: "Đã sao chép email vào clipboard",
  copyErrorAnnounce: "Không thể sao chép — vui lòng dùng nút Gửi email",
};

describe("copy-email labels", () => {
  it("idle → copy label, no announcement", () => {
    expect(copyLabel("idle", t)).toBe("Sao chép email");
    expect(copyAnnounce("idle", t)).toBe("");
  });
  it("copied → copied label + polite announcement", () => {
    expect(copyLabel("copied", t)).toBe("Đã sao chép");
    expect(copyAnnounce("copied", t)).toBe("Đã sao chép email vào clipboard");
  });
  it("error → error label + fallback announcement (mailto still works)", () => {
    expect(copyLabel("error", t)).toBe("Không thể sao chép");
    expect(copyAnnounce("error", t)).toBe("Không thể sao chép — vui lòng dùng nút Gửi email");
  });
});
