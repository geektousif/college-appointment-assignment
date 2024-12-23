ALTER TABLE "appointment" RENAME COLUMN "professorId" TO "professor_id";--> statement-breakpoint
ALTER TABLE "appointment" RENAME COLUMN "studentId" TO "student_id";--> statement-breakpoint
ALTER TABLE "appointment" RENAME COLUMN "slotId" TO "slot_id";--> statement-breakpoint
ALTER TABLE "slot" RENAME COLUMN "professorId" TO "professor_id";--> statement-breakpoint
ALTER TABLE "slot" RENAME COLUMN "startTime" TO "start_time";--> statement-breakpoint
ALTER TABLE "slot" RENAME COLUMN "endTime" TO "end_time";--> statement-breakpoint
ALTER TABLE "slot" RENAME COLUMN "isBooked" TO "is_booked";--> statement-breakpoint
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_professorId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_studentId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_slotId_slot_id_fk";
--> statement-breakpoint
ALTER TABLE "slot" DROP CONSTRAINT "slot_professorId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_professor_id_user_id_fk" FOREIGN KEY ("professor_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_slot_id_slot_id_fk" FOREIGN KEY ("slot_id") REFERENCES "public"."slot"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slot" ADD CONSTRAINT "slot_professor_id_user_id_fk" FOREIGN KEY ("professor_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;