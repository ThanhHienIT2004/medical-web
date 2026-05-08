import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const APPOINTMENT_TYPES = new Set(['CONSULTATION', 'TREATMENT', 'FOLLOW_UP']);
const APPOINTMENT_STATUS = new Set(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']);
const REMINDER_STATUS = new Set(['PENDING', 'SENT', 'DONE', 'CANCELLED']);
const USER_ROLES = new Set(['USER', 'ADMIN', 'DOCTOR', 'GUEST']);
const REGIMEN_TYPES = new Set(['STANDARD', 'CUSTOM']);
const CARE_STAGES = new Set(['PrEP', 'PEP', 'ARV']);

function normalizeUpper(value: string | null | undefined): string | null {
  if (!value) return null;
  return value.trim().toUpperCase();
}

function normalizeCareStage(value: string | null | undefined): string | null {
  const upper = normalizeUpper(value);
  if (!upper) return null;
  if (upper === 'PREP') return 'PrEP';
  if (upper === 'PEP') return 'PEP';
  if (upper === 'ARV') return 'ARV';
  return null;
}

async function backfillUsersRole() {
  const users = await prisma.user.findMany({
    select: { id: true, role: true },
  });

  let updated = 0;
  for (const user of users) {
    const normalized = normalizeUpper(user.role);
    if (!normalized || !USER_ROLES.has(normalized) || normalized === user.role) {
      continue;
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { role: normalized },
    });
    updated += 1;
  }
  return updated;
}

async function backfillAppointmentEnums() {
  const appointments = await prisma.appointment.findMany({
    select: {
      appointment_id: true,
      appointment_type: true,
      status: true,
    },
  });

  let updatedType = 0;
  let updatedStatus = 0;

  for (const item of appointments) {
    const nextType = normalizeUpper(item.appointment_type);
    const nextStatus = normalizeUpper(item.status);

    const data: { appointment_type?: string; status?: string } = {};

    if (
      nextType &&
      APPOINTMENT_TYPES.has(nextType) &&
      nextType !== item.appointment_type
    ) {
      data.appointment_type = nextType;
      updatedType += 1;
    }

    if (nextStatus && APPOINTMENT_STATUS.has(nextStatus) && nextStatus !== item.status) {
      data.status = nextStatus;
      updatedStatus += 1;
    }

    if (Object.keys(data).length === 0) {
      continue;
    }

    await prisma.appointment.update({
      where: { appointment_id: item.appointment_id },
      data,
    });
  }

  return { updatedType, updatedStatus };
}

async function backfillReminderStatus() {
  const reminders = await prisma.reminder.findMany({
    select: { reminder_id: true, status: true },
  });

  let updated = 0;
  for (const reminder of reminders) {
    const next = normalizeUpper(reminder.status);
    if (!next || !REMINDER_STATUS.has(next) || next === reminder.status) {
      continue;
    }

    await prisma.reminder.update({
      where: { reminder_id: reminder.reminder_id },
      data: { status: next },
    });
    updated += 1;
  }
  return updated;
}

async function backfillRegimenEnums() {
  const regimens = await prisma.regimen.findMany({
    select: {
      id: true,
      care_stage: true,
      regimen_type: true,
    },
  });

  let updatedCareStage = 0;
  let updatedRegimenType = 0;

  for (const regimen of regimens) {
    const nextCareStage = normalizeCareStage(regimen.care_stage);
    const nextRegimenType = normalizeUpper(regimen.regimen_type);
    const data: { care_stage?: string; regimen_type?: string } = {};

    if (
      nextCareStage &&
      CARE_STAGES.has(nextCareStage) &&
      nextCareStage !== regimen.care_stage
    ) {
      data.care_stage = nextCareStage;
      updatedCareStage += 1;
    }

    if (
      nextRegimenType &&
      REGIMEN_TYPES.has(nextRegimenType) &&
      nextRegimenType !== regimen.regimen_type
    ) {
      data.regimen_type = nextRegimenType;
      updatedRegimenType += 1;
    }

    if (Object.keys(data).length === 0) {
      continue;
    }

    await prisma.regimen.update({
      where: { id: regimen.id },
      data,
    });
  }

  return { updatedCareStage, updatedRegimenType };
}

async function backfillDoctorScheduleAvailability() {
  const result = await prisma.doctorSchedule.updateMany({
    where: { is_available: null },
    data: { is_available: true },
  });
  return result.count;
}

async function main() {
  console.log('Starting backfill for enums/default values...');

  const usersRoleUpdated = await backfillUsersRole();
  const appointmentsUpdated = await backfillAppointmentEnums();
  const remindersUpdated = await backfillReminderStatus();
  const regimensUpdated = await backfillRegimenEnums();
  const schedulesUpdated = await backfillDoctorScheduleAvailability();

  console.log('Backfill completed.');
  console.log(
    JSON.stringify(
      {
        usersRoleUpdated,
        appointmentTypeUpdated: appointmentsUpdated.updatedType,
        appointmentStatusUpdated: appointmentsUpdated.updatedStatus,
        reminderStatusUpdated: remindersUpdated,
        regimenCareStageUpdated: regimensUpdated.updatedCareStage,
        regimenTypeUpdated: regimensUpdated.updatedRegimenType,
        doctorScheduleAvailabilityUpdated: schedulesUpdated,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error('Backfill failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
