import z from "zod";

export const tryoutSchema = z.object({
  title: z
    .string()
    .min(1, "Judul tryout wajib diisi")
    .max(150, "Judul tryout maksimal 150 karakter"),

  description: z
    .string()
    .min(1, "Deskripsi tryout wajib diisi")
    .max(500, "Deskripsi maksimal 500 karakter"),

  is_published: z.boolean(),
  is_free: z.boolean(),
  use_irt: z.boolean(),
  randomize_options: z.boolean(),

  exam_type: z.enum(["utbk", "cpns"], {
    message: "Jenis ujian harus UTBK atau CPNS",
  }),

  start_date: z
    .string()
    .optional()
    .nullable()
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), {
      message: "start_date harus format tanggal yang valid (ISO string).",
    }),

  end_date: z
    .string()
    .optional()
    .nullable()
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), {
      message: "end_date harus format tanggal yang valid (ISO string).",
    }),

  image: z.instanceof(File).optional().nullable(),

  category: z.enum(["UTBK", "UM", "CPNS"], {
    message: "Kategori tryout wajib dipilih",
  }),
}).superRefine((data, ctx) => {
  const isValidCategory = data.exam_type === "cpns"
    ? data.category === "CPNS"
    : data.category === "UTBK" || data.category === "UM";

  if (!isValidCategory) {
    ctx.addIssue({
      code: "custom",
      message: "Kategori tidak sesuai dengan jenis ujian",
      path: ["category"],
    });
  }
});

export type TryoutType = z.infer<typeof tryoutSchema>;
