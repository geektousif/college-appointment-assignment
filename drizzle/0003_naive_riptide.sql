CREATE TYPE "public"."appointment_status" AS ENUM('scheduled', 'cancelled', 'completed');--> statement-breakpoint
CREATE TABLE "appointment" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "appointment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"professorId" integer NOT NULL,
	"studentId" integer NOT NULL,
	"slotId" integer NOT NULL,
	"status" "appointment_status" DEFAULT 'scheduled' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "slot" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "slot_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"professorId" integer NOT NULL,
	"startTime" timestamp NOT NULL,
	"endTime" timestamp NOT NULL,
	"isBooked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_professorId_user_id_fk" FOREIGN KEY ("professorId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_studentId_user_id_fk" FOREIGN KEY ("studentId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_slotId_slot_id_fk" FOREIGN KEY ("slotId") REFERENCES "public"."slot"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slot" ADD CONSTRAINT "slot_professorId_user_id_fk" FOREIGN KEY ("professorId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;