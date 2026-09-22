"use client";

import { Award, GraduationCap, Server, Database, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/public/reveal";

export interface ProofItem {
  readonly id: string;
  readonly category: string;
  readonly badgeColor: string;
  readonly title: string;
  readonly context: string;
  readonly result: string;
  readonly issuer: string;
  readonly year: string;
  readonly tags: readonly string[];
  readonly icon: typeof Award;
}

const VERIFIED_PROOF_ITEMS: readonly ProofItem[] = [
  {
    id: "ds-challenge-2025",
    category: "DATA SCIENCE & ML",
    badgeColor: "from-amber-500/20 to-amber-500/5 text-amber-300 border-amber-500/30",
    title: "GIẢI KHUYẾN KHÍCH — DATA SCIENCE CHALLENGE 2025",
    context: "Cuộc thi Thử thách Khoa học Dữ liệu cấp trường tại Đại học Nguyễn Tất Thành.",
    result:
      "Xây dựng pipeline làm sạch dữ liệu, trích xuất đặc trưng và huấn luyện mô hình máy học giải quyết bài toán phân loại dữ liệu đa biến phức tạp với độ chính xác cao.",
    issuer: "Đại học Nguyễn Tất Thành (NTTU)",
    year: "2025",
    tags: ["Data Science", "Machine Learning", "Python", "Data Pipeline"],
    icon: Award,
  },
  {
    id: "se-competition-2025",
    category: "SOFTWARE ENGINEERING",
    badgeColor: "from-blue-500/20 to-blue-500/5 text-blue-300 border-blue-500/30",
    title: "GIẢI KHUYẾN KHÍCH — SOFTWARE ENGINEERING COMPETITION 2025",
    context: "Cuộc thi Sáng tạo Kỹ thuật Phần mềm cấp trường tại Đại học Nguyễn Tất Thành.",
    result:
      "Hiện thực hóa kiến trúc phần mềm hướng dịch vụ hoàn chỉnh, áp dụng Clean Architecture, giao diện người dùng đáp ứng và quy trình kiểm thử tự động toàn diện.",
    issuer: "Đại học Nguyễn Tất Thành (NTTU)",
    year: "2025",
    tags: ["Software Engineering", "Clean Architecture", "Automated Testing"],
    icon: Award,
  },
  {
    id: "academic-nttu",
    category: "ACADEMIC FOUNDATION",
    badgeColor: "from-emerald-500/20 to-emerald-500/5 text-emerald-300 border-emerald-500/30",
    title: "CỬ NHÂN KỸ THUẬT PHẦN MỀM — GPA 3.09 / 4.0",
    context: "Chương trình Cử nhân Kỹ thuật Phần mềm (10/2022 – Hiện tại).",
    result:
      "Nền tảng học thuật vững chắc về cấu trúc dữ liệu & giải thuật, hệ thống quản trị cơ sở dữ liệu quan hệ, lập trình hướng đối tượng và kiến trúc phân tán.",
    issuer: "Khoa Công nghệ Thông tin · NTTU",
    year: "2022-2026",
    tags: ["Algorithms", "Database Systems", "OOP", "Distributed Architecture"],
    icon: GraduationCap,
  },
  {
    id: "concurrency-proof",
    category: "CONCURRENCY CONTROL",
    badgeColor: "from-cyan-500/20 to-cyan-500/5 text-cyan-300 border-cyan-500/30",
    title: "CHỐNG RACE CONDITION NGÂN SÁCH ĐỒNG THỜI",
    context: "Dự án Expense Tracker Fullstack Architecture.",
    result:
      "Giải quyết triệt để tranh chấp dữ liệu khi nhiều thiết bị đồng thời cập nhật ngân sách bằng giao dịch nguyên tử SELECT FOR UPDATE trên Neon PostgreSQL và Redis caching.",
    issuer: "Production Architecture Milestone",
    year: "2025",
    tags: ["PostgreSQL", "SELECT FOR UPDATE", "Atomic Transactions", "Redis"],
    icon: Server,
  },
  {
    id: "cdp-engine",
    category: "DATA INTEGRITY",
    badgeColor: "from-purple-500/20 to-purple-500/5 text-purple-300 border-purple-500/30",
    title: "MINI CDP SIMULATION & 7 DATA QUALITY CHECKS",
    context: "Dự án Mini Customer Data Platform cho Retail/F&B.",
    result:
      "Thiết kế 5 truy vấn SQL phân khúc khách hàng tự động và 7 bài kiểm tra chẩn đoán chất lượng dữ liệu phát hiện lỗi trùng lặp số điện thoại và bản ghi mồ côi.",
    issuer: "Engineering Research Project",
    year: "2026",
    tags: ["SQL Optimization", "Data Quality Diagnostics", "CDP Simulation"],
    icon: Database,
  },
];

/**
 * Ariyana V3 Section 08 — Selected Proof / Engineering Evidence (§31–34).
 * Adapts Ariyana's "Clients Feedback" visual language to verified engineering evidence:
 * - Large editorial quote card structure with circular colorful avatar badges
 * - Strictly 100% verified facts from Resume and verified projects
 * - Zero fabricated testimonials, zero fake clients
 */
export function SelectedProofSection() {
  return (
    <section
      id="proof"
      aria-labelledby="proof-heading"
      className="relative w-full border-t border-white/10 py-24 lg:py-36 overflow-hidden bg-canvas"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-16">
        {/* Caption Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="caption-pill">
            <span className="size-1.5 rounded-full bg-brand-primary" />
            <span>SELECTED PROOF // HIGHLIGHTS</span>
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="font-mono text-xs text-brand-primary-soft uppercase tracking-widest hidden sm:inline-block">
            08 // EVIDENCE
          </span>
        </div>

        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-3xl">
            <Reveal direction="up" distance={20}>
              <h2
                id="proof-heading"
                className="text-4xl sm:text-5xl md:text-6xl font-display uppercase tracking-tight text-fg leading-tight"
              >
                SELECTED PROOF &amp; EXPERIENCE HIGHLIGHTS
              </h2>
            </Reveal>
            <Reveal direction="up" distance={20} delay={0.1}>
              <p className="mt-4 text-body-l text-fg-muted max-w-2xl">
                Minh chứng năng lực xác thực từ giải thưởng học thuật, thành tích thi đấu công nghệ đến giải pháp kiến trúc trong sản phẩm thực tế.
              </p>
            </Reveal>
          </div>

          <div className="hidden lg:flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand-primary-soft bg-surface/60 border border-white/10 px-4 py-2 rounded-full">
            <CheckCircle2 className="size-3.5 text-brand-primary" />
            <span>ZERO FABRICATED CLAIMS</span>
          </div>
        </div>

        {/* Ariyana Proof Cards Track */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {VERIFIED_PROOF_ITEMS.map((item, idx) => {
            const Icon = item.icon;

            return (
              <Reveal key={item.id} direction="up" distance={30} delay={idx * 0.08}>
                <div className="group relative rounded-[2.5rem] border border-white/15 bg-surface/40 p-8 sm:p-10 backdrop-blur-md flex flex-col justify-between h-full transition-all duration-300 hover:border-brand-primary/50 hover:bg-surface/70 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                  <div>
                    {/* Top Row: Category Pill + Circular Year Stamp */}
                    <div className="flex items-center justify-between gap-4 mb-8">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-semibold tracking-wider uppercase bg-gradient-to-r ${item.badgeColor}`}>
                        <span className="size-1.5 rounded-full bg-current" />
                        <span>{item.category}</span>
                      </span>
                      <div className="size-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center font-mono text-xs text-fg-subtle">
                        {item.year.slice(0, 4)}
                      </div>
                    </div>

                    {/* Milestone Title */}
                    <h3 className="text-xl sm:text-2xl font-display uppercase tracking-tight text-fg leading-snug mb-4 group-hover:text-brand-primary-soft transition-colors">
                      {item.title}
                    </h3>

                    {/* Result Description */}
                    <p className="text-body text-fg-muted leading-relaxed mb-6">
                      {item.result}
                    </p>
                  </div>

                  {/* Bottom: Issuer + Tags */}
                  <div className="pt-6 border-t border-white/10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary shrink-0">
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <p className="font-mono text-xs font-medium text-fg uppercase tracking-wide">
                          {item.issuer}
                        </p>
                        <p className="font-mono text-[11px] text-fg-subtle">
                          {item.context}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-white/10 bg-white/5 text-fg-subtle"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
